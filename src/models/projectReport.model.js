const { DataTypes, Model } = require("sequelize");

/**
 * @class ProjectReport
 * @extends Model
 * @classdesc Represents a report submitted by an Account regarding a Project.
 * 
 * 🔑 **Notes:**
 * - Tracks the reason, review status, and resolution status of a report.
 */
class ProjectReport extends Model {
    /**
     * Define associations for the ProjectReport model.
     * @param {object} models - All sequelize models.
     */
    static associate(models) {
        // Reporter account
        ProjectReport.belongsTo(models.Account, { foreignKey: 'reporter_id' });

        // Related project
        ProjectReport.belongsTo(models.Project, { foreignKey: 'project_id' });
    }
}

/**
 * Initialize the ProjectReport model.
 *
 * @param {import("sequelize").Sequelize} sequelize - Sequelize instance.
 * @returns {typeof ProjectReport} ProjectReport model.
 */
function ProjectReportModel(sequelize) {
    ProjectReport.init(
        {
            /**
             * Primary key for the ProjectReport
             * @type {number}
             */
            report_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },

            /**
             * Reason for reporting the project
             * @type {string}
             */
            report_reason: { type: DataTypes.STRING(512), allowNull: false },

            /**
             * Indicates if the report has been reviewed
             * @type {boolean}
             */
            is_report_reviewed: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },

            /**
             * Indicates if the report has been resolved
             * @type {boolean}
             */
            is_report_resolved: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },

            /**
             * Foreign key to the reporter account
             * @type {string} UUID
             */
            reporter_id: { type: DataTypes.UUID, allowNull: false },

            /**
             * Foreign key to the reported project
             * @type {number}
             */
            project_id: { type: DataTypes.INTEGER, allowNull: false },
        },
        {
            sequelize,
            modelName: 'ProjectReport',
            tableName: 'project_reports_tb',
            timestamps: true,
            underscored: true,
        }
    );

    return ProjectReport;
}

module.exports = ProjectReportModel;