const { models } = require("@config/database.config");
const ServiceErrorLogger = require("@utils/serviceErrorLogger.util");

/**
 * @class ProjectStudentService
 * @classdesc Service layer for managing associations between Projects and Students in the database.  
 * Provides methods to add, remove, and query relationships between projects and students using Sequelize ORM.
 * 
 * 📌 **General Notes:**
 * - Each association is stored in the `ProjectStudent` join table.
 * - Duplicate associations are prevented using `bulkCreate` with `ignoreDuplicates`.
 * - Nested service `Project` provides all operations related to a specific project.
 */
class ProjectStudentService {

    static #logger = new ServiceErrorLogger({ module: 'ProjectStudentService' });

    /**
     * Project-related operations
     * (Manage students associated with a specific project).
     */
    static Project = class {

        /**
         * Add a student to a project.
         * 
         * @param {Object} params
         * @param {number} params.project_id - The project ID.
         * @param {string} params.student_id - The student ID.
         * @returns {Promise<Object>} The created ProjectStudent instance.
         * @throws {AppError} If creation fails.
         */
        static async addStudent({ project_id, student_id }) {
            try {
                const created = await models.ProjectStudent.create({
                    project_id,
                    student_id,
                });
                return created;
            } catch (error) {
                throw ProjectStudentService.#logger.log(this.addStudent.name, error);
            }
        }

        /**
         * Add multiple students to a project.  
         * Duplicate associations are ignored.
         * 
         * @param {Object} params
         * @param {number} params.project_id - The project ID.
         * @param {Array<string>} params.student_ids - Array of student IDs.
         * @returns {Promise<Array<Object>>} Array of created ProjectStudent instances.
         * @throws {AppError} If creation fails.
         */
        static async addStudents({ project_id, student_ids = [] }) {
            if(!student_ids.length) return [];
            try {
                const _students = student_ids.map(student_id => ({ project_id, student_id }));
                const students = await models.ProjectStudent.bulkCreate(_students, { ignoreDuplicates: true });
                return students;
            } catch (error) {
                throw ProjectStudentService.#logger.log(this.addStudents.name, error);
            }
        }

        /**
         * Get all students associated with a project.
         * Each student includes the profile image if exists.
         * 
         * @param {Object} params
         * @param {number} params.project_id - The project ID.
         * @returns {Promise<Array<Object>>} Array of student objects:
         *   - student_id {string}  
         *   - student_full_name {string}  
         *   - Image {Object|null} - Contains `image_path` if available.
         * @throws {AppError} If fetching fails.
         */
        static async getStudents({ project_id }) {
            try {
                const projectStudents = await models.ProjectStudent.findAll({
                    where: { project_id },
                    include: [
                        { 
                            model: models.Student, 
                            as: 'Student',
                            attributes: [
                                'student_id', 
                                'student_name', 
                                'student_father_name',
                                'student_grandfather_name',
                                'student_family_name',
                                'student_full_name',
                            ]
                        }
                    ],
                    order: [['created_at', 'DESC']]
                });

                return projectStudents
                    .map(ps => ps.Student ? ps.Student.get({ plain: true }) : null)
                    .filter(student => student !== null);

            } catch (error) {
                throw ProjectStudentService.#logger.log(this.getStudents.name, error);
            }
        }

        /**
         * Remove a student from a project.
         * 
         * @param {Object} params
         * @param {number} params.project_id - The project ID.
         * @param {string} params.student_id - The student ID.
         * @returns {Promise<number>} Number of rows deleted.
         * @throws {AppError} If deletion fails.
         */
        static async removeStudent({ project_id, student_id }) {
            try {
                const deletedRows = await models.ProjectStudent.destroy({
                    where: { project_id, student_id }
                });
                return deletedRows;
            } catch (error) {
                throw ProjectStudentService.#logger.log(this.removeStudent.name, error);
            }
        }

        /**
         * Remove multiple students from a project.
         * 
         * @param {Object} params
         * @param {number} params.project_id - The project ID.
         * @param {Array<string>} params.student_ids - Array of student IDs.
         * @returns {Promise<number>} Number of rows deleted, or null if no IDs provided.
         * @throws {AppError} If deletion fails.
         */
        static async removeStudents({ project_id, student_ids = [] }) {
            if(!student_ids.length) return 0;
            try {
                const deletedRows = await models.ProjectStudent.destroy({
                    where: { project_id, student_id: student_ids }
                });
                return deletedRows;
            } catch (error) {
                throw ProjectStudentService.#logger.log(this.removeStudents.name, error);
            }
        }
    }
}

module.exports = ProjectStudentService;
