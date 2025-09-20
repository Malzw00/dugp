const { Model, DataTypes } = require("sequelize");

/**
 * @class AccountReport
 * @extends Model
 * @classdesc Represents reports made by users against other accounts.  
 * Stores the reason, status, and resolution state of each report.
 *
 * 🔑 **Notes:**
 * - Each report links a `reporter` account with a `reported` account.
 * - Reports can be reviewed and marked as resolved.
 */
class AccountReport extends Model {
    /**
     * Define associations for the AccountReport model.
     * @param {object} models - All sequelize models.
     */
    static associate(models) {
        // Reporter account (the one who submits the report)
        AccountReport.belongsTo(models.Account, { 
            as: 'Reporter', 
            foreignKey: 'reporter_id' 
        });

        // Reported account (the one being reported)
        AccountReport.belongsTo(models.Account, { 
            as: 'ReportedAccount', 
            foreignKey: 'account_id' 
        });
    }
}

/**
 * Initialize the AccountReport model.
 *
 * @param {import("sequelize").Sequelize} sequelize - Sequelize instance.
 * @returns {typeof AccountReport} AccountReport model.
 */
function AccountReportModel(sequelize) {
    AccountReport.init(
        {
            report_id: { 
                type: DataTypes.INTEGER, 
                autoIncrement: true, 
                primaryKey: true, 
            },
            reporter_id: { 
                type: DataTypes.UUID, 
                allowNull: false,
            },
            account_id: { 
                type: DataTypes.UUID, 
                allowNull: false,
            },
            report_reason: { 
                type: DataTypes.STRING(512), 
                allowNull: false 
            },
            is_report_reviewed: { 
                type: DataTypes.BOOLEAN, 
                allowNull: false, 
                defaultValue: false, 
            },
            is_report_resolved: { 
                type: DataTypes.BOOLEAN, 
                allowNull: false, 
                defaultValue: false, 
            },
        },
        {
            sequelize,
            modelName: "AccountReport",
            tableName: "account_reports_tb",
            timestamps: true,
            underscored: true,
        }
    );

    return AccountReport;
}

module.exports = AccountReportModel;