const ServiceErrorLogger = require("@utils/serviceErrorLogger.util");
const { models, sequelize } = require("@config/database.config");
const { fn, col, where, Op } = require("sequelize");
const RatingService = require("@services/social/rating.service");



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


    static async get (project_id) {
        try {
            const project = await models.Project.findByPk(
                project_id, 
                {
                    include: [
                        { model: models.Student, attributes: ['student_id', 'student_full_name'] },
                        { model: models.Supervisor, attributes: ['supervisor_id', 'supervisor_full_name'] },
                        { model: models.Image, attributes: ['image_path'] },
                        { model: models.Department, include: { model: models.Collage } },
                    ]
                }
            );
            return project;
        } catch (error) {
            throw this.logger.log(this.get.name, error);
        } 
    }
    

    // uncompleted function ---
    /** order: { by: 'date' | 'rating' | 'grade' | 'likes_count', dir: 'ASC' | 'DESC' } */
    /** (**important: you should add categories, collage, department filter) */
    static async getAll({ offset = 0, limit = 10, order = { by:'date', dir:'ASC' } }){
        try {
            const projects = await models.Project.findAll({
                where: { available: true },
                offset: offset?? 0,
                limit:  limit?? 10,
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
                include: [
                    { model: models.ProjectLike, attributes: [] },
                    { model: models.Comment, attributes: [] },
                    { model: models.Rating, attributes: [] },
                ],
                group: ['Project.project_id'],
                order: [[
                    order.by === 'date'
                    ? 'created_at'
                    : order.by === 'rating'
                    ? 'rating'
                    : order.by === 'likes'
                    ? 'likes_count'
                    : 'grade',
                    order.dir
                ]]
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



    static async delete({ project_id }) {
        
    }




}


module.exports = ProjectService;