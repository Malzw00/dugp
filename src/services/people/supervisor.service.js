const { Op } = require("sequelize");
const { models } = require("@root/src/config/database.config");
const ServiceErrorLogger = require("@utils/serviceErrorLogger.util");

/**
 * @class SupervisorService
 * @classdesc Service layer for managing Supervisors in the database.
 * Provides methods to create, update, delete, and search supervisors using Sequelize ORM.
 */
class SupervisorService {

    /** Logger instance for error handling */
    static logger = new ServiceErrorLogger({ module: 'Supervisor' });

    /**
     * Create a new supervisor.
     * @param {Object} params
     * @param {string} params.name - Supervisor's first name.
     * @param {string} params.father_name - Supervisor's father name.
     * @param {string} params.grandfather_name - Supervisor's grandfather name.
     * @param {string} params.family_name - Supervisor's family name.
     * @param {string} params.email - Supervisor's email address.
     * @param {string} params.title - Supervisor's title (e.g., Dr., Prof.).
     * @param {number} params.department_id - Department ID the supervisor belongs to.
     * @returns {Promise<Object>} The created supervisor instance.
     * @throws {AppError} If creation fails.
     */
    static async create({ name, father_name, grandfather_name, family_name, email, title, department_id }) {
        try {
            const created = await models.Supervisor.create({
                supervisor_name: name,
                supervisor_father_name: father_name,
                supervisor_grandfather_name: grandfather_name,
                supervisor_family_name: family_name,
                supervisor_title: title,
                supervisor_email: email,
                department_id: department_id
            });

            return created;

        } catch (error) {
            throw this.logger.log(this.create.name, error);
        }
    }

    /**
     * Delete a supervisor by ID.
     * @param {Object} params
     * @param {number} params.supervisor_id - The supervisor identifier.
     * @returns {Promise<number>} Number of deleted rows.
     * @throws {AppError} If deletion fails.
     */
    static async delete({ supervisor_id }) {
        try {
            const deletedRows = await models.Supervisor.destroy({ 
                where: { supervisor_id: supervisor_id } 
            });

            return deletedRows;

        } catch (error) {
            throw this.logger.log(this.delete.name, error);
        }
    }

    /**
     * Update the supervisor's name components.
     * @param {Object} params
     * @param {number} params.supervisor_id - Supervisor ID to update.
     * @param {string} [params.name] - First name.
     * @param {string} [params.father_name] - Father name.
     * @param {string} [params.grand_father_name] - Grandfather name.
     * @param {string} [params.family_name] - Family name.
     * @returns {Promise<number>} Number of affected rows.
     */
    static async updateName({ supervisor_id, name, father_name, grand_father_name, family_name }) {
        try {
            const values = {};
            
            if(name) values.supervisor_name = name;
            if(father_name) values.supervisor_father_name = father_name;
            if(grand_father_name) values.supervisor_grandfather_name = grand_father_name;
            if(family_name) values.supervisor_family_name = family_name;

            const [affectedRows] = await models.Supervisor.update(
                values, { where: { supervisor_id: supervisor_id } }
            );

            return affectedRows;

        } catch (error) {
            throw this.logger.log(this.updateName.name, error);
        }
    }

    /**
     * Update the supervisor's title.
     * @param {Object} params
     * @param {number} params.supervisor_id - Supervisor ID to update.
     * @param {string} params.title - New title.
     * @returns {Promise<number>} Number of affected rows.
     */
    static async updateTitle({ supervisor_id, title }) {
        try {
            const [affectedRows] = await models.Supervisor.update(
                { supervisor_title: title },
                { where: { supervisor_id: supervisor_id } }
            );

            return affectedRows;

        } catch (error) {
            throw this.logger.log(this.updateTitle.name, error);
        }
    }

    /**
     * Update the supervisor's department.
     * @param {Object} params
     * @param {number} params.supervisor_id - Supervisor ID to update.
     * @param {number} params.department_id - New department ID.
     * @returns {Promise<number>} Number of affected rows.
     */
    static async updateDepartment({ supervisor_id, department_id }) {
        try {
            const [affectedRows] = await models.Supervisor.update(
                { department_id: department_id },
                { where: { supervisor_id: supervisor_id } }
            );          

            return affectedRows;

        } catch (error) {
            throw this.logger.log(this.updateDepartment.name, error);
        }
    }

    /**
     * Update the supervisor's linked account.
     * @param {Object} params
     * @param {number} params.supervisor_id - Supervisor ID to update.
     * @param {number} params.account_id - Linked account ID.
     * @returns {Promise<number>} Number of affected rows.
     */
    static async updateAccount({ supervisor_id, account_id }) {
        try {
            const [affectedRows] = await models.Supervisor.update(
                { account_id: account_id }, 
                { where: { supervisor_id: supervisor_id } }
            );

            return affectedRows;

        } catch (error) {
            throw this.logger.log(this.updateAccount.name, error);
        }
    }

    /**
     * Update the supervisor's profile image.
     * @param {Object} params
     * @param {number} params.supervisor_id - Supervisor ID to update.
     * @param {number} params.image_id - Image ID to assign.
     * @returns {Promise<number>} Number of affected rows.
     */
    static async updateProfileImage({ supervisor_id, image_id }) {
        try {
            const [affectedRows] = await models.Supervisor.update(
                { image_id: image_id }, 
                { where: { supervisor_id: supervisor_id } }
            );            

            return affectedRows;

        } catch (error) {
            throw this.logger.log(this.updateProfileImage.name, error);
        }
    }

    /**
     * Search supervisors by full name with optional department filter.
     * @param {string} keyword - Search keyword.
     * @param {Object} options
     * @param {number} [options.department_id] - Optional department ID filter.
     * @returns {Promise<Object[]>} Array of matching supervisors.
     */
    static async searchByName(keyword, { department_id }) {
        try {
            const whereOptions = {
                supervisor_full_name: { [Op.like]: `%${keyword}%` },
            };

            if(department_id)
                whereOptions.department_id = department_id;

            const supervisors = await models.Supervisor.findAll({
                where: whereOptions,
                attributes: ['supervisor_id', 'supervisor_full_name']
            });

            return supervisors;

        } catch (error) {
            throw this.logger.log(this.searchByName.name, error);
        }
    }

    /**
     * Get supervisor by ID.
     * @param {Object} params
     * @param {number} params.supervisor_id - Supervisor ID to fetch.
     * @returns {Promise<Object|null>} Supervisor instance or null if not found.
     */
    static async get({ supervisor_id }) {
        try {
            const supervisor = await models.Supervisor.findOne({ 
                where: { supervisor_id: supervisor_id } 
            });
            
            return supervisor;

        } catch (error) {
            throw this.logger.log(this.get.name, error);
        }
    }

    /**
     * Get all supervisors in a specific department.
     * @param {Object} params
     * @param {number} params.department_id - Department ID.
     * @returns {Promise<Object[]>} Array of supervisors in the department.
     */
    static async getByDepartmentSupervisors({ department_id }) {
        try {
            const supervisors = await models.Supervisor.findAll({ 
                where: { department_id: department_id } 
            });
            
            return supervisors;

        } catch (error) {
            throw this.logger.log(this.getByDepartmentSupervisors.name, error);
        }
    }

    /**
     * Get all supervisors in a specific collage.
     * @param {Object} params
     * @param {number} params.collage_id - Collage ID.
     * @returns {Promise<Object[]>} Array of supervisors across all departments of the collage.
     */
    static async getByCollageID({ collage_id }) {
        try {
            const departments = await models.Department.findAll({ 
                where: { collage_id: collage_id } 
            });

            const supervisorsArrays = await Promise.all(
                departments.map(async ({ department_id }) => {
                    return await models.Supervisor.findAll({ where: { department_id: department_id } });
                })
            );

            const supervisors = supervisorsArrays.flat();

            return supervisors;

        } catch (error) {
            throw this.logger.log(this.getByCollageID.name, error);    
        }
    }
}

module.exports = SupervisorService;