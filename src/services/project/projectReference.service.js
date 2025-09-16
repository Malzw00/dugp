const { models } = require("@config/database.config");
const ServiceErrorLogger = require("@utils/serviceErrorLogger.util");

/**
 * @class ProjectReferenceService
 * @classdesc Service layer for managing many-to-many associations between **Projects** and **References**.  
 * Provides CRUD-like methods for attaching, detaching, and querying references of projects (and vice versa) using Sequelize ORM.
 * 
 * 📌 **General Notes:**
 * - Associations are stored in the `ProjectReference` join table.
 * - A project can have multiple references.
 * - A reference can be linked to multiple projects.
 */
class ProjectReferenceService {

    static #logger = new ServiceErrorLogger({ module: 'ProjectReferenceService' });

    /**
     * Operations for handling project-related reference associations.
     */
    static Project = class {

        /**
         * Link a single reference to a project.
         * 
         * @param {Object} params
         * @param {number} params.project_id - The project ID.
         * @param {number} params.reference_id - The reference ID.
         * @returns {Promise<Object>} The created ProjectReference instance.
         * @throws {AppError} If creation fails.
         */
        static async addReference({ project_id, reference_id }) {
            try {
                const created = await models.ProjectReference.create({
                    project_id, 
                    reference_id
                });
                return created;
            } catch (error) {
                throw ProjectReferenceService.#logger.log(this.addReference.name, error);
            }
        }

        /**
         * Link multiple references to a project at once.
         * 
         * @param {Object} params
         * @param {number} params.project_id - The project ID.
         * @param {number[]} params.reference_ids - Array of reference IDs.
         * @returns {Promise<Object[]>} Array of created ProjectReference instances.
         * @throws {AppError} If creation fails.
         */
        static async addReferences({ project_id, reference_ids }) {
            try {
                const records = reference_ids.map(reference_id => ({ reference_id, project_id }));
                const created = await models.ProjectReference.bulkCreate(records, { ignoreDuplicates: true });
                return created;
            } catch (error) {
                throw ProjectReferenceService.#logger.log(this.addReferences.name, error);
            }
        }

        /**
         * Unlink a single reference from a project.
         * 
         * @param {Object} params
         * @param {number} params.project_id - The project ID.
         * @param {number} params.reference_id - The reference ID.
         * @returns {Promise<number>} Number of rows deleted.
         * @throws {AppError} If deletion fails.
         */
        static async removeReference({ project_id, reference_id }) {
            try {
                const deletedRows = await models.ProjectReference.destroy({
                    where: { project_id, reference_id }
                });
                return deletedRows;
            } catch (error) {
                throw ProjectReferenceService.#logger.log(this.removeReference.name, error);
            }
        }

        /**
         * Unlink multiple references from a project.  
         * If `reference_ids` is not provided, remove all references of the project.
         * 
         * @param {Object} params
         * @param {number} params.project_id - The project ID.
         * @param {number[]=} params.reference_ids - Optional array of reference IDs to remove.
         * @returns {Promise<number>} Number of rows deleted.
         * @throws {AppError} If deletion fails.
         */
        static async removeReferences({ project_id, reference_ids }) {
            try {
                const whereCondition = { project_id };
                if(reference_ids?.length) whereCondition.reference_id = reference_ids;

                const deletedRows = await models.ProjectReference.destroy({
                    where: whereCondition,
                });
                return deletedRows;
            } catch (error) {
                throw ProjectReferenceService.#logger.log(this.removeReferences.name, error);
            }
        }

        /**
         * Get all references of a project.
         * 
         * @param {Object} params
         * @param {number} params.project_id - The project ID.
         * @returns {Promise<Array<Object>>} Array of Reference objects.
         * @throws {AppError} If fetching fails.
         */
        static async getReferences({ project_id }) {
            try {
                const refs = await models.Project.findOne({
                    where: { project_id },
                    attributes: ['project_id'],
                    include: {
                        model: models.Reference,
                        as: 'References',
                        attributes: ['reference_id', 'reference_title', 'reference_author', 'reference_link'],
                    }
                });
                return refs.References?? [];
            } catch (error) {
                throw ProjectReferenceService.#logger.log(this.getReferences.name, error);
            }
        }

        /**
         * Check if a specific reference is linked to a project.
         * 
         * @param {Object} params
         * @param {number} params.project_id - The project ID.
         * @param {number} params.reference_id - The reference ID.
         * @returns {Promise<boolean>} True if association exists, otherwise false.
         * @throws {AppError} If query fails.
         */
        static async includes({ project_id, reference_id }) {
            try {
                const exists = await models.ProjectReference.findOne({where: {
                    project_id, 
                    reference_id
                }});
                return !!exists;
            } catch (error) {
                throw ProjectReferenceService.#logger.log(this.includes.name, error);
            }
        }
    }


    /**
     * Operations for handling reference-related project associations.
     */
    static Reference = class {

        /**
         * Get all projects associated with a given reference.
         * 
         * @param {Object} params
         * @param {number} params.reference_id - The reference ID.
         * @returns {Promise<Object>} Reference object with associated Projects.
         * @throws {AppError} If fetching fails.
         */
        static async getReferenceProjects({ reference_id }) {
            try {
                const projects = await models.Reference.findOne({
                    where: { reference_id },
                    include: {
                        model: models.Project,
                        as: 'Projects',
                        attributes: ['project_id', 'project_title'],
                    }
                });
                return projects;
            } catch (error) {
                throw ProjectReferenceService.#logger.log(this.getReferenceProjects.name, error);
            }
        }
    }
}

module.exports = ProjectReferenceService;
