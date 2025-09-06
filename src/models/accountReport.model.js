const { DataTypes } = require("sequelize");


/** @param {import('sequelize').Sequelize} sequelize */
module.exports = function (sequelize) {

    const AccountReport = sequelize.define('AccountReport', {
        report_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true, },
        reporter_id: { 
            type: DataTypes.UUID, 
            allowNull: false,
        },
        account_id: { 
            type: DataTypes.UUID, 
            allowNull: false,
        },
        report_reason: { type: DataTypes.STRING(512), allowNull: false },
        is_report_reviewed: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false, },
        is_report_resolved: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false, },
    }, {
        tableName: 'account_reports_tb',
        timestamps: true,
        underscored: true,
    });

    AccountReport.associate = function (models) {

        AccountReport.belongsTo(models.Account, { 
            as: 'Reporter', 
            foreignKey: 'reporter_id' 
        });

        AccountReport.belongsTo(models.Account, { 
            as: 'ReportedAccount', 
            foreignKey: 'account_id' 
        });
    }

    return AccountReport;
}