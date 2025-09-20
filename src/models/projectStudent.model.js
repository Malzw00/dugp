const { DataTypes, Model } = require("sequelize");

/**
 * @class ProjectStudent
 * @extends Model
 * @classdesc Represents the association between a Project and a Student.
 * 
 * 🔑 **Notes:**
 * - This is a join table for the many-to-many relation between Projects and Students.
 */
class ProjectStudent extends Model {
    /**
     * Define associations for the ProjectStudent model.
     * @param {object} models - All sequelize models.
     */
    static associate(models) {
        // Associations can be defined here if needed
    }
}

/**
 * Initialize the ProjectStudent model.
 *
 * @param {import("sequelize").Sequelize} sequelize - Sequelize instance.
 * @returns {typeof ProjectStudent} ProjectStudent model.
 */
function ProjectStudentModel(sequelize) {
    ProjectStudent.init(
        {
            /**
             * Foreign key to the Project
             * @type {number}
             */
            project_id: { type: DataTypes.INTEGER, allowNull: false },

            /**
             * Foreign key to the Student
             * @type {string} UUID
             */
            student_id: { type: DataTypes.UUID, allowNull: false },
        },
        {
            sequelize,
            modelName: 'ProjectStudent',
            tableName: 'project_students_tb',
            timestamps: true,
            underscored: true,
        }
    );

    return ProjectStudent;
}

module.exports = ProjectStudentModel;