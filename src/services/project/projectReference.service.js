const { models } = require("@config/database.config");
const ServiceErrorLogger = require("@utils/serviceErrorLogger.util");

/**
 * @class ProjectReferenceService
 * @classdesc Service layer for managing associations between Projects and Files (References) in the database.  
 * Provides methods to add, remove, and query relationships between projects and reference files using Sequelize ORM.
 * 
 * 📌 **General Notes:**
 * - Each association is stored in the `ProjectReference` join table.
 * - A file can be referenced by multiple projects.
 * - A project can have multiple reference files.
 */
class ProjectReferenceService {

    static #logger = new ServiceErrorLogger({ module: 'ProjectReferenceService' });


    /**
     * Create a new project reference (link a project with a file).
     * 
     * @param {Object} params
     * @param {number} params.project_id - The project ID.
     * @param {number} params.file_id - The file ID.
     * @returns {Promise<Object>} The created ProjectReference instance.
     * @throws {AppError} If creation fails.
     */
    static async create({ project_id, file_id }) {
        try {
            const created = await models.ProjectReference.create({
                file_id,
                project_id, 
            });
            return created;
        } catch (error) {
            throw this.#logger.log(this.create.name, error);
        }
    }


    /**
     * Get all projects that reference a specific file.
     * 
     * @param {Object} params
     * @param {number} params.file_id - The file ID.
     * @returns {Promise<Array<Object>>} Array of Project objects.
     * @throws {AppError} If fetching fails.
     */
    static async getReferenceProjects({ file_id }) {
        try {
            const file = await models.File.findByPk(file_id, {
                include: [
                    {
                        model: models.Project,
                        through: { attributes: [] }, // hide join table columns
                    }
                ]
            });

            return file ? file.Projects : [];
        } catch (error) {
            throw this.#logger.log(this.getReferenceProjects.name, error);
        }
    }


    /**
     * Get all file references of a specific project.
     * 
     * @param {Object} params
     * @param {number} params.project_id - The project ID.
     * @returns {Promise<Array<Object>>} Array of File objects.
     * @throws {AppError} If fetching fails.
     */
    static async getProjectReferences({ project_id }) {
        try {
            const project = await models.Project.findByPk(project_id, {
                include: [
                    {
                        include: models.File,
                        as: 'References',
                        through: { attributes: [] }
                    }
                ]
            });
            return project ? project.References : [];
        } catch (error) {
            throw this.#logger.log(this.getProjectReferences.name, error);
        }
    }


    /**
     * Check if a specific file is a reference of a given project.
     * 
     * @param {Object} params
     * @param {number} params.project_id - The project ID.
     * @param {number} params.file_id - The file ID.
     * @returns {Promise<boolean>} True if the file is a reference of the project, otherwise false.
     * @throws {AppError} If query fails.
     */
    static async isReferenceOfProject({ project_id, file_id }) {
        try {
            const count = await models.ProjectReference.count({
                where: { project_id, file_id }
            });

            return count > 0;
        } catch (error) {
            throw this.#logger.log(this.isReferenceOfProject.name, error);
        }
    }


    /**
     * Delete a specific project reference by project_id and file_id.
     * 
     * @param {Object} params
     * @param {number} params.project_id - The project ID.
     * @param {number} params.file_id - The file ID.
     * @returns {Promise<number>} Number of rows deleted.
     * @throws {AppError} If deletion fails.
     */
    static async delete({ project_id, file_id }) {
        try {
            const deletedRows = await models.ProjectReference.destroy({
                where: { project_id, file_id }
            });
            return deletedRows;
        } catch (error) {
            throw this.#logger.log(this.delete.name, error);
        }
    }


    /**
     * Delete a project reference by its ID.
     * 
     * @param {Object} params
     * @param {number} params.project_reference_id - The project reference ID.
     * @returns {Promise<number>} Number of rows deleted.
     * @throws {AppError} If deletion fails.
     */
    static async deleteByID({ project_reference_id }) {
        try {
            const deletedRows = await models.ProjectReference.destroy({
                where: { project_reference_id }
            });
            return deletedRows;
        } catch (error) {
            throw this.#logger.log(this.deleteByID.name, error);
        }
    }
}

module.exports = ProjectReferenceService;