const ServiceErrorLogger = require("@utils/serviceErrorLogger.util");
const { models, sequelize } = require("@config/database.config");
const { fn, col, Op, literal } = require("sequelize");
const FileService = require("@root/src/services/File.service");



/**
 * @class ProjectService
 * @classdesc Service layer for managing Project entities in the database.  
 * Provides methods for CRUD operations, searching, filtering, and managing project-related files.
 * 
 * 📌 **General Notes:**
 * - Uses Sequelize ORM with model associations.
 * - Includes filtering, pagination, and ordering.
 * - Related entities: Categories, Department → Collage, Students, Supervisor, Files.
 */
class ProjectService {
    
    static logger = new ServiceErrorLogger({ module: 'ProjectService' });

    /**
     * Create a new project in the database.
     *
     * This method inserts a new project record with the provided details.
     * It requires the project title, description, academic year, semester, department, and supervisor.
     *
     * @param {Object} params - Parameters for creating the project.
     * @param {string} params.title - The title of the project.
     * @param {string} params.description - The description of the project.
     * @param {string|number} params.year - The academic year for the project.
     * @param {'Winter'|'Spring'|'Summer'|'Autumn'} params.semester - The semester of the project.
     * @param {number} params.department_id - The ID of the department associated with the project.
     * @param {number} params.supervisor_id - The ID of the supervisor for the project.
     * @returns {Promise<import('sequelize').Model>} The created project instance.
     * @throws {AppError} Throws an error if creation fails.
     */
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


    /**
     * Update an existing project's details.
     *
     * Only the fields provided (non-undefined) will be updated.
     * This allows partial updates without overwriting other fields.
     *
     * @param {Object} params - Parameters for updating the project.
     * @param {number} params.project_id - The ID of the project to update.
     * @param {string} [params.title] - New title of the project.
     * @param {string} [params.description] - New description of the project.
     * @param {string} [params.date] - New project date.
     * @param {string} [params.semester] - New semester value.
     * @param {number} [params.grade] - New grade value.
     * @param {number} [params.department_id] - New department ID.
     * @param {number} [params.cover_image_id] - New cover image file ID.
     * @param {number} [params.supervisor_id] - New supervisor ID.
     * @param {boolean} [params.available] - Update availability status.
     * @returns {Promise<number>} Number of affected rows (should be 1 if update succeeded).
     * @throws {AppError} Throws an error if the update fails.
     */
    static async update({ 
        project_id, title, description, date, semester, 
        grade, department_id, cover_image_id, supervisor_id, available 
    }) {
        try {
            const values = {};

            if (title !== undefined) values.project_title = title;
            if (description !== undefined) values.project_description = description;
            if (date !== undefined) values.project_date = date;
            if (semester !== undefined) values.project_semester = semester;
            if (grade !== undefined) values.project_grade = grade;
            if (department_id !== undefined) values.department_id = department_id;
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


    /**
     * Update the availability status of a project.
     *
     * @param {Object} params - Parameters for updating availability.
     * @param {number} params.project_id - The ID of the project to update.
     * @param {boolean} params.available - New availability status.
     * @returns {Promise<number>} Number of affected rows (should be 1 if update succeeded).
     * @throws {AppError} Throws an error if the update fails.
     */
    static async updateAvailable({ project_id, available }) {
        try {
            const [affectedRows] = await models.Project.update(
                { available },
                { where: { project_id } }
            );
            return affectedRows;
        } catch (error) {
            throw this.logger.log(this.updateAvailable.name, error);
        }
    }


    /**
     * Retrieve a project by its ID.
     *
     * This method fetches the project along with its associated Students, Supervisor, Cover file, Department, and Collage.
     *
     * @param {Object} params - Parameters for fetching the project.
     * @param {number} params.project_id - The ID of the project to retrieve.
     * @returns {Promise<import('sequelize').Model|null>} The project instance if found, otherwise null.
     * @throws {AppError} Throws an error if fetching fails.
     */
    static async get({ project_id }) {
        try {
            const project = await models.Project.findByPk(
                project_id, 
                {
                    include: [
                        { 
                            model: models.Student, 
                            attributes: [
                                'student_id', 
                                'student_full_name'
                            ] 
                        },
                        { 
                            model: models.Supervisor, 
                            attributes: [
                                'supervisor_id', 
                                'supervisor_full_name'
                            ] 
                        },
                        { 
                            model: models.File,
                            attributes: [
                                'file_id', 
                                'original_name', 
                                'stored_name', 
                                'path'
                            ],
                            as: 'Cover', 
                        },
                        { 
                            model: models.Department, 
                            include: { 
                                model: models.Collage,
                                attributes: ['collage_id','collage_name'], 
                            } 
                        },
                    ]
                }
            );
            return project;
        } catch (error) {
            throw this.logger.log(this.get.name, error);
        } 
    }



    /**
     * Retrieve all projects with pagination, ordering, and optional filters.
     *
     * This method fetches a list of projects along with their associated Departments, Collages,
     * Categories, Cover file, likes, comments, and ratings. It supports filtering by collage, 
     * department, and categories, as well as ordering by date, rating, likes, or grade.
     *
     * @param {Object} params - Parameters for fetching projects.
     * @param {number} [params.offset=0] - Number of records to skip for pagination.
     * @param {number} [params.limit=10] - Maximum number of projects to return.
     * @param {Object} [params.order={by: 'date', dir: 'ASC'}] - Ordering of results.
     * @param {('date'|'rating'|'likes'|'grade')} [params.order.by='date'] - Field to sort by.
     * @param {('ASC'|'DESC')} [params.order.dir='ASC'] - Sorting direction.
     * @param {Object} [params.filters={}] - Filters to apply.
     * @param {number} [params.filters.collage_id] - Filter projects by collage ID.
     * @param {number} [params.filters.department_id] - Filter projects by department ID.
     * @param {Array<number>} [params.filters.category_ids] - Filter projects by category IDs.
     * @returns {Promise<Array<import('sequelize').Model>>} Array of project instances matching the criteria.
     * Each project includes associated Department, Collage, Categories, Cover file, likes count, comments count, and average rating.
     * @throws {AppError} Throws an error if fetching fails.
     */
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
                    'project_description',
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
                    'Categories->ProjectCategory.project_id', 
                    'Cover.file_id'
                ],
                order: [[orderField, order.dir.toUpperCase()]]
            });

            return projects;

        } catch (error) {
            throw this.logger.log(this.getAll.name, error);
        }
    }




    /**
     * Ordering options for search results.
     * 
     * @typedef {Object} OrderOptions
     * @property {'date'|'rating'|'likes'|'grade'} by - The field used for ordering:
     * - `'date'`: project creation date (`created_at`)
     * - `'rating'`: average project rating
     * - `'likes'`: total likes count
     * - `'grade'`: project grade
     * @property {'ASC'|'DESC'} dir - Sorting direction (ascending or descending).
     */

    /**
     * Search result object for each project.
     * 
     * @typedef {Object} SearchResult
     * @property {number} project_id - Unique project identifier.
     * @property {string} project_title - Project title.
     * @property {string} project_description - Project description.
     * @property {string} project_date - Project date (YYYY-MM-DD).
     * @property {string} project_semester - Academic semester of the project.
     * @property {number} project_grade - Project grade.
     * @property {string} created_at - Timestamp when the project was created.
     * @property {number} rating - Average rating (calculated from `Ratings`).
     * @property {number} likes_count - Number of likes.
     * @property {number} comment_count - Number of comments.
     * @property {{ file_id: number }|null} Cover - Cover file object (if exists).
     * @property {{ keyword: string }[]} Keywords - Associated keywords.
     * @property {{ category_id: number }[]} Categories - Associated categories.
     * @property {{ department_id: number }|null} Department - Associated department.
     * @property {{ collage_id: number }|null} Collage - Associated collage (optional).
     */

    /**
     * Search projects in the database using text, filters, ordering, and pagination.
     *
     * Features:
     * - Full-text search across project title, description, and keywords.
     * - Filters: department, collage, semester, date, grade, keywords, categories.
     * - Statistics: likes count, average ratings, comments count.
     * - Sorting by date, rating, likes, or grade.
     *
     * @param {Object} params - Search parameters.
     * @param {string} [params.searchText=''] - Text query for full-text search.
     * @param {Object} [params.filters={}] - Filtering options.
     * @param {number} [params.filters.department_id] - Department ID.
     * @param {number} [params.filters.collage_id] - Collage ID.
     * @param {string} [params.filters.semester] - Academic semester.
     * @param {{start: string, end: string}|string} [params.filters.date] - Date range or specific date.
     * @param {{min:number,max:number}} [params.filters.grade] - Grade range filter.
     * @param {string[]} [params.filters.keywords] - List of keywords.
     * @param {number[]} [params.filters.category_ids] - List of category IDs.
     * @param {number} [params.offset=0] - Pagination offset.
     * @param {number} [params.limit=10] - Maximum number of results.
     * @param {OrderOptions} [params.order={ by:'date', dir:'ASC' }] - Ordering options.
     * 
     * @returns {Promise<SearchResult[]>} List of projects with their details and aggregated stats.
     */
    static async search({ searchText='', filters={}, offset=0, limit=10, order = { by: 'date', dir: 'ASC' } }) {

        // Build Search Condition with Full-Text
        const searchCondition = (
            searchText? literal(`(
                MATCH(
                    projects_tb.project_title, 
                    projects_tb.project_description
                ) 
                AGAINST(${sequelize.escape(searchText)} IN NATURAL LANGUAGE MODE)
                OR MATCH(keywords_tb.keyword) 
                AGAINST(${sequelize.escape(searchText)} IN NATURAL LANGUAGE MODE)
            )`): null
        );

        // Build Filter Condition
        const filterCondition = {};
        if (filters.department_id) 
            filterCondition.department_id = filters.department_id;

        if (filters.semester) 
            filterCondition.project_semester = filters.semester;

        if (filters.date && filters.date.start && filters.date.end) 
            filterCondition.project_date = {
                [Op.between]: [filters.date.start, filters.date.end]
            }

        if (filters.grade) 
            filterCondition.project_grade = {
                [Op.between]: [filters.grade.min, filters.grade.max]
            };
        //

        // Build Order Field
        let orderField;
        switch (order.by) {
            case 'date':    orderField = 'created_at';      break;
            case 'rating':  orderField = 'rating';          break;
            case 'likes':   orderField = 'likes_count';     break;
            case 'grade':   orderField = 'project_grade';   break;
            default:        orderField = 'created_at';
        }

        // Search For Projects
        const projects = await models.Project.findAll({
            where: {
                ...filterCondition,
                ...(searchCondition ? { [Op.and]: [searchCondition] } : {})
            },
            attributes: {
                include: [
                    [fn('AVG',   fn('DISTINCT', col('Ratings.rate'))), 'rating'],
                    [fn('COUNT', fn('DISTINCT', col('ProjectLikes.project_like_id'))), 'likes_count'],
                    [fn('COUNT', fn('DISTINCT', col('Comments.comment_id'))), 'comment_count'],
   
                ]
            },
            include: [
                {
                    model: models.Keyword,
                    through: { attributes: [] },
                    attributes: ['keyword'],
                    ...(filters.keywords?.length? { where: { keyword: { [Op.in]: filters.keywords } } } : {})
                },
                {
                    model: models.Category,
                    through: { attributes: [] },
                    attributes: ['category_id'],
                    ...(filters.category_ids ? { where: { category_id: { [Op.in]: filters.category_ids } } } : {})
                },
                {
                    model: models.Department,
                    attributes: ['department_id'],
                    ...(filters.department_id ? { where: { department_id: filters.department_id } } : {})
                },
                {
                    model: models.Collage,
                    attributes: ['collage_id'],
                    required: false,
                    ...(filters.collage_id ? { where: { collage_id: filters.collage_id } } : {})
                },
                { 
                    model: models.File, 
                    as: 'Cover', 
                    attributes: [ 'file_id' ] 
                },
                {
                    model: models.ProjectLike,
                    attributes: []
                },
                {
                    model: models.Rating,
                    attributes: []
                },
                {
                    model: models.Comment,
                    attributes: []
                }
            ],
            offset,
            limit,
            order: [[literal(orderField), order.dir.toUpperCase()]],
            group: [
                'Project.project_id',
                'Keywords.keyword',
                'Categories.category_id',
                'Department.department_id',
                'Collage.collage_id',
                'Cover.file_id'
            ],
            distinct: true,
            subQuery: false,
        });

        return projects;
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

    
    /**
     * Associate a book file with a project.
     *
     * @param {Object} params
     * @param {number} params.project_id - ID of the project.
     * @param {number} params.file_id - ID of the file to set as the book.
     * @returns {Promise<number>} Number of affected rows (1 if updated, 0 otherwise).
     * @throws {AppError} Throws if update fails.
     */
    static async setBook({ project_id, file_id }) {
        try {
            const [affectedRows] = await models.Project.update(
                { book_id: file_id },
                { where: { project_id } }
            );

            return affectedRows;
        } catch (error) {
            throw this.logger.log(this.setBook.name, error);
        }
    }

    /**
     * Delete the book associated with a project.
     *
     * @param {Object} params
     * @param {number} params.project_id - ID of the project.
     * @returns {Promise<boolean>} True if deletion was successful, false if no book exists.
     * @throws {AppError} Throws if deletion fails.
     */
    static async deleteBook({ project_id }) {
        const _transaction = await sequelize.transaction();
        try {
            const project = await models.Project.findByPk(project_id, {
                include: {
                    model: models.File,
                    as: 'Book',
                    required: false,
                    attributes: [ 'file_id' ],
                    where: { category: 'book' },
                },
                transaction: _transaction,
            });

            if(!project?.Book) {
                await _transaction.rollback();
                return false;
            }

            const deleted = await FileService.deleteFile(
                project.Book.file_id, 
                { transaction: _transaction }
            );

            await _transaction.commit();

            return deleted;
        } catch (error) {
            await _transaction.rollback();
            throw this.logger.log(this.deleteBook.name, error);
        }
    }

    /**
     * Get the book file associated with a project.
     *
     * @param {Object} params
     * @param {number} params.project_id - ID of the project.
     * @returns {Promise<Object|null>} File instance if exists, otherwise null.
     * @throws {AppError} Throws if fetching fails.
     */
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

    /**
     * Get the presentation file associated with a project.
     *
     * @param {Object} params
     * @param {number} params.project_id - ID of the project.
     * @returns {Promise<Object|null>} File instance if exists, otherwise null.
     * @throws {AppError} Throws if fetching fails.
     */
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
            throw this.logger.log(this.getPresentation.name, error);
        }
    }

    /**
     * Associate a presentation file with a project.
     *
     * @param {Object} params
     * @param {number} params.project_id - ID of the project.
     * @param {number} params.file_id - ID of the file to set as the presentation.
     * @returns {Promise<number>} Number of affected rows (1 if updated, 0 otherwise).
     * @throws {AppError} Throws if update fails.
     */
    static async setPresentation({ project_id, file_id }) {
        try {
            const [affectedRows] = await models.Project.update(
                { presentation_id: file_id },
                { where: { project_id } }
            );

            return affectedRows;
        } catch (error) {
            throw this.logger.log(this.setPresentation.name, error);
        }
    }

    /**
     * Delete the presentation file associated with a project.
     *
     * @param {Object} params
     * @param {number} params.project_id - ID of the project.
     * @returns {Promise<boolean>} True if deletion was successful, false if no presentation exists.
     * @throws {AppError} Throws if deletion fails.
     */
    static async deletePresentation({ project_id }) {
        const _transaction = await sequelize.transaction();
        try {
            const project = await models.Project.findByPk(project_id, {
                include: {
                    model: models.File,
                    as: 'Presentation',
                    required: false,
                    attributes: [ 'file_id' ],
                    where: { category: 'presentation' },
                },
                transaction: _transaction,
            });

            if(!project?.Presentation) {
                _transaction.rollback();
                return false
            }

            const deleted = await FileService.deleteFile(project.Presentation.file_id, { 
                transaction: _transaction 
            });

            await _transaction.commit();

            return deleted;

        } catch (error) {
            await _transaction.rollback();
            throw this.logger.log(this.deletePresentation.name, error);
        }
    }

    /**
     * Get the cover image associated with a project.
     *
     * @param {Object} params
     * @param {number} params.project_id - ID of the project.
     * @returns {Promise<Object|null>} File instance if exists, otherwise null.
     * @throws {AppError} Throws if fetching fails.
     */
    static async getCover({ project_id }) {
        try {
            const project = await models.Project.findByPk(project_id, {
                include: {
                    model: models.File,
                    as: 'Cover',
                    where: { category: 'cover' },
                    required: false,
                }
            });
            return project?.Cover ?? null;
        } catch (error) {
            throw this.logger.log(this.getCover.name, error);
        }
    }

    /**
     * Associate a cover image file with a project.
     *
     * @param {Object} params
     * @param {number} params.project_id - ID of the project.
     * @param {number} params.file_id - ID of the file to set as the cover.
     * @returns {Promise<number>} Number of affected rows (1 if updated, 0 otherwise).
     * @throws {AppError} Throws if update fails.
     */
    static async setCover({ project_id, file_id }) {
        try {
            const [affectedRows] = await models.Project.update(
                { cover_image_id: file_id },
                { where: { project_id } }
            );
            return affectedRows;
        } catch (error) {
            throw this.logger.log(this.setCover.name, error);
        }
    }

    /**
     * Delete the cover image associated with a project.
     *
     * @param {Object} params
     * @param {number} params.project_id - ID of the project.
     * @returns {Promise<boolean>} True if deletion was successful, false if no cover exists.
     * @throws {AppError} Throws if deletion fails.
     */
    static async deleteCover({ project_id }) {
        const _transaction = await sequelize.transaction();
        try {
            const project = await models.Project.findByPk(project_id, {
                include: {
                    model: models.File,
                    as: 'Cover',
                    where: { category: 'cover' },
                    required: false,
                    attributes: ['file_id']
                },
                transaction: _transaction,
            });

            if (!project?.Cover) {
                await _transaction.rollback();
                return false;
            }

            const deleted = await FileService.deleteFile(project.Cover.file_id, { transaction: _transaction });

            await _transaction.commit();
            return deleted;

        } catch (error) {
            await _transaction.rollback();
            throw this.logger.log(this.deleteCover.name, error);
        }
    }

}


module.exports = ProjectService;