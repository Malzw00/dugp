const { Model, DataTypes } = require("sequelize");

/**
 * @class CommentReport
 * @extends Model
 * @classdesc Represents a report made by an account on a comment.
 * 
 * 🔑 **Notes:**
 * - Each report links a reporter (Account) to a comment.
 * - Tracks whether the report has been reviewed and resolved.
 */
class CommentReport extends Model {
    /**
     * Define associations for the CommentReport model.
     * @param {object} models - All sequelize models.
     */
    static associate(models) {
        // Each report belongs to a reporter (Account)
        CommentReport.belongsTo(models.Account, { foreignKey: 'reporter_id' });

        // Each report belongs to a comment
        CommentReport.belongsTo(models.Comment, { foreignKey: 'comment_id' });
    }
}

/**
 * Initialize the CommentReport model.
 *
 * @param {import("sequelize").Sequelize} sequelize - Sequelize instance.
 * @returns {typeof CommentReport} CommentReport model.
 */
function CommentReportModel(sequelize) {
    CommentReport.init(
        {
            /**
             * Primary key for the comment report
             * @type {number}
             */
            report_id: { 
                type: DataTypes.INTEGER, 
                autoIncrement: true, 
                primaryKey: true 
            },

            /**
             * Reason for reporting the comment
             * @type {string}
             */
            report_reason: { 
                type: DataTypes.STRING(512), 
                allowNull: false 
            },

            /**
             * Indicates whether the report has been reviewed
             * @type {boolean}
             */
            is_report_reviewed: { 
                type: DataTypes.BOOLEAN, 
                allowNull: false, 
                defaultValue: false 
            },

            /**
             * Indicates whether the report has been resolved
             * @type {boolean}
             */
            is_report_resolved: { 
                type: DataTypes.BOOLEAN, 
                allowNull: false, 
                defaultValue: false 
            },

            /**
             * ID of the account who reported
             * @type {string}
             */
            reporter_id: { 
                type: DataTypes.UUID, 
                allowNull: false 
            },

            /**
             * ID of the reported comment
             * @type {number}
             */
            comment_id: { 
                type: DataTypes.INTEGER, 
                allowNull: false 
            },
        },
        {
            sequelize,
            modelName: "CommentReport",
            tableName: "comment_reports_tb",
            timestamps: true,
            underscored: true,
        }
    );

    return CommentReport;
}

module.exports = CommentReportModel;