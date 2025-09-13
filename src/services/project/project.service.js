const ServiceErrorLogger = require("@utils/serviceErrorLogger.util");
const { models, sequelize } = require("@config/database.config");
const { fn, col } = require("sequelize");
const FileService = require("@root/src/services/File.service");
const ProjectReferenceService = require("./projectReference.service");



class ProjectService {
    
    static logger = new ServiceErrorLogger({ module: 'ProjectService' });

    static async create({ title, description, year, semester, department_id, supervisor_id }) {
        try {
            const created = await models.Project.create({
                project_title: title,
                project_description: description,
                project_year: year,
                project_semester: semester,
                department_id,
                supervisor_id
            });
            return created;
        } catch (error) {
            throw this.logger.log(this.create.name, error);
        }
    }


    static async update({ 
        project_id, title, describtion, date, semester, 
        grade, department, cover_image_id, supervisor_id, available 
    }) {
        try {
            const values = {};

            if (title !== undefined) values.project_title = title;
            if (describtion !== undefined) values.project_describtion = describtion;
            if (date !== undefined) values.project_date = date;
            if (semester !== undefined) values.project_semester = semester;
            if (grade !== undefined) values.project_grade = grade;
            if (department !== undefined) values.department = department;
            if (cover_image_id !== undefined) values.cover_image_id = cover_image_id;
            if (supervisor_id !== undefined) values.supervisor_id = supervisor_id;
            if (available !== undefined) values.available = available;

            const [affectedRows] = await models.Project.update(
                values,
                { where: { project_id } }
            );

            return affectedRows;

        } catch (error) {
            throw this.logger.log(this.update.name, error);
        }
    }



    static async updateAvailable({ project_id, available }) {
        try {
            const [affectedRows] = await models.Project.update(
                { available },
                { where: { project_id } }
            );
            return affectedRows;
        } catch (error) {
            this.logger.log(this.setAvailable.name, error);
        }
    }


    static async get ({ project_id }) {
        try {
            const project = await models.Project.findByPk(
                project_id, 
                {
                    include: [
                        { model: models.Student, attributes: ['student_id', 'student_full_name'] },
                        { model: models.Supervisor, attributes: ['supervisor_id', 'supervisor_full_name'] },
                        { 
                            model: models.File,
                            attributes: ['file_id', 'original_name', 'stored_name', 'path'],
                            as: 'Cover', 
                        },
                        { model: models.Department, include: { model: models.Collage } },
                    ]
                }
            );
            return project;
        } catch (error) {
            throw this.logger.log(this.get.name, error);
        } 
    }


    static async getAll({ 
        offset = 0, 
        limit = 10, 
        order = { by: 'date', dir: 'ASC' },
        filters = {} // { collage_id, department_id, category_ids }
    }) {
        try {
            const where = { available: true };

            // فلترة حسب الكلية
            if (filters.collage_id) {
                where['$Department.collage_id$'] = filters.collage_id;
            }

            // فلترة حسب القسم
            if (filters.department_id) {
                where['department_id'] = filters.department_id;
            }

            // إعداد JOIN مع الفئات إذا وجدت
            const include = [
                { model: models.ProjectLike, attributes: [] },
                { model: models.Comment, attributes: [] },
                { model: models.Rating, attributes: [] },
                {
                    model: models.Department,
                    attributes: ['department_id', 'department_name'],
                    include: [
                        {
                            model: models.Collage,
                            attributes: ['collage_id', 'collage_name']
                        }
                    ]
                },
                {
                    model: models.Category,
                    attributes: ['category_id', 'category_name'],
                    through: { attributes: [] },
                },
                {
                    model: models.File,
                    as: 'Cover',
                    attributes: ['file_id', 'original_name', 'stored_name', 'path']
                }
            ];

            // إذا تم تمرير فلاتر للفئات
            if (filters.category_ids && filters.category_ids.length) {
                include.push({
                    model: models.Category,
                    attributes: [],
                    through: { attributes: [] },
                    where: { category_id: filters.category_ids }
                });
            }

            // تحديد ترتيب حسب الحقل
            let orderField;
            switch (order.by) {
                case 'date': orderField = 'created_at'; break;
                case 'rating': orderField = fn('AVG', col('Ratings.rate')); break;
                case 'likes': orderField = fn('COUNT', col('ProjectLikes.project_like_id')); break;
                case 'grade': orderField = 'project_grade'; break;
                default: orderField = 'created_at';
            }

            const projects = await models.Project.findAll({
                where,
                include,
                attributes: [
                    'project_id',
                    'project_title',
                    'project_describtion',
                    'project_date',
                    'created_at',
                    'project_grade',
                    [fn('COUNT', col('ProjectLikes.project_like_id')), 'likes_count'],
                    [fn('COUNT', col('Comments.comment_id')), 'comments_count'],
                    [fn('AVG', col('Ratings.rate')), 'rating']
                ],
                offset,
                limit,
                group: [
                    'Project.project_id',
                    'Department.department_id', 
                    'Department->Collage.collage_id', 
                    'Categories.category_id',
                ],
                order: [[orderField, order.dir.toUpperCase()]]
            });

            return projects;

        } catch (error) {
            throw this.logger.log(this.getAll.name, error);
        }
    }


    /**
     * 
     * @param {*} options 
     * @param {*} filters
     */
    static async search({  }, {  }) {
        
    }



    /**
     * Deletes a project along with its associated files (book, presentation, references) and related data.
     * Comments, likes, ratings, and reports are deleted automatically via ON DELETE CASCADE.
     * Students associated with the project are not deleted.
     *
     * @param {Object} params
     * @param {number} params.project_id - The ID of the project to delete
     * @returns {Promise<{ isDeleted: boolean, deletedFiles: number }>} Result of the deletion
     * @throws {Error} Throws an error if deletion fails
     */
    static async delete({ project_id }) {
        const _transaction = await sequelize.transaction();
        try {
            const project = await models.Project.findByPk(project_id, { 
                include: [
                    {
                        model: models.File,
                        as: 'References',
                        attributes: ['file_id'],
                        through: { attributes: [] },
                    }
                ],
                transaction: _transaction 
            });

            if (!project) {
                await _transaction.rollback();
                return { isDeleted: false, deletedFiles: 0 };
            }
            
            const fileIds = [
                project.book_id, 
                project.presentation_id,
                ...project.References.map(ref => ref.file_id),
            ].filter(Boolean);

            const deletedFiles = await FileService.bulkDeleteFiles(fileIds, _transaction);

            await project.destroy({ transaction: _transaction });

            await _transaction.commit();

            return { isDeleted: true, deletedFiles };

        } catch (error) {
            await _transaction.rollback();
            throw this.logger.log(this.delete.name, error);
        }
    }


    static async getBook({ project_id }) {
        try {
            const project = await models.Project.findByPk(project_id, {
                include: {
                    model: models.File,
                    as: 'Book',
                    where: { category: 'book' },
                    required: false,
                }
            });
            return project?.Book?? null;
        } catch (error) {
            throw this.logger.log(this.getBook.name, error);
        }
    }
    
    
    static async getPresentation({ project_id }) {
        try {
            const project = await models.Project.findByPk(project_id, {
                include: {
                    model: models.File,
                    as: 'Presentation',
                    where: { category: 'presentation' },
                    required: false,
                }
            });
            return project?.Presentation?? null;
        } catch (error) {
            throw this.logger.log(this.getBook.name, error);
        }
    }
}


module.exports = ProjectService;