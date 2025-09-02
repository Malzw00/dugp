const { models } = require("@config/database.config");
const ServiceErrorLogger = require("@root/src/utils/serviceErrorLogger.util");
const AppError = require("@utils/appError.util");



/**
 * @class DepartmentService
 * @classdesc Service layer for managing Departments in the database.  
 * Provides methods to create, update, and delete departments using Sequelize ORM.
 */
class DepartmentService {
    
    /** 
     * Logger instance for handling and recording service errors.
     * @private
     * @static
     */
    static logger = new ServiceErrorLogger({ module: 'Department' });

    /**
     * Create a new department linked to a specific college.
     * @static
     * @param {Object} params
     * @param {string} params.department_name - The name of the department.
     * @param {number} params.collage_id - The ID of the college this department belongs to.
     * @throws {AppError} If a database error occurs (e.g., unique constraint violation).
     * @returns {Promise<Object>} The newly created department object.
     */
    static async create({ department_name, collage_id }) {
        try {
            const created = await models.Department.create({
                department_name,
                collage_id,
            });

            return created;

        } catch (error) {
            throw this.logger.log(this.create.name, error);
        }
    }
    
    
    static async getDepartments({ collage_id }) {
        try {
            const departments = await models.Department.findAll({ where: { collage_id } });
            return departments;
            
        } catch (error) {
            throw this.logger.log(this.getDepartments.name, error);
        }
    }

    /**
     * Delete a department by its ID.
     * @static
     * @param {Object} params
     * @param {number} params.department_id - The ID of the department to delete.
     * @throws {AppError} If the department ID does not exist.
     * @returns {Promise<number>} Number of rows deleted.
     */
    static async delete({ department_id }) {
        try {
            const deletedRows = await models.Department.destroy({
                where: { department_id },
            });

            if (deletedRows === 0)
                throw AppError.IDNotExistsError();

            return deletedRows;

        } catch (error) {
            throw this.logger.log(this.delete.name, error);
        }
    }

    /**
     * Update the name of a department by its ID.
     * @static
     * @param {Object} params
     * @param {number} params.department_id - The ID of the department.
     * @param {string} params.department_name - The new department name.
     * @throws {ValidationError} If argument types are invalid.
     * @throws {AppError} If the department ID does not exist.
     * @returns {Promise<number>} Number of rows updated.
     */
    static async updateName({ department_id, department_name }) {
        try {
            const [affectedRows] = await models.Department.update(
                { department_name },
                { where: { department_id } },
            );

            if (affectedRows === 0)
                throw AppError.IDNotExistsError();

            return affectedRows;

        } catch (error) {
            throw this.logger.log(this.updateName.name, error);
        }
    }

    /**
     * Update the college of a department by its ID.
     * @static
     * @param {Object} params
     * @param {number} params.department_id - The ID of the department.
     * @param {number} params.collage_id - The new college ID to assign.
     * @throws {ValidationError} If argument types are invalid.
     * @throws {AppError} If the department ID does not exist.
     * @returns {Promise<number>} Number of rows updated.
     */
    static async updateCollage({ department_id, collage_id }) {

        try {
            const [affectedRows] = await models.Department.update(
                { collage_id },
                { where: { department_id } }
            );

            if (affectedRows === 0)
                throw AppError.IDNotExistsError();

            return affectedRows;

        } catch (error) {
            throw this.logger.log(this.updateCollage.name, error);
        }
    }
}

module.exports = DepartmentService;
