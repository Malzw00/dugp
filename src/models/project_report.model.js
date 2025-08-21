const { DataTypes } = require("sequelize");


/** @param {import('sequelize').Sequelize} sequelize */

module.exports = function (sequelize) {

    const ProjectReport = sequelize.define('ProjectReport', {
        report_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true, },
        report_reason: { type: DataTypes.STRING(512), allowNull: false },
        is_report_reviewed: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false, },
        is_report_resolved: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false, },
        reporter_id: { 
            type: DataTypes.INTEGER, 
            allowNull: false, 
            // references: { model: 'accounts_tb', key: 'account_id' },
            // onDelete: 'CASCADE'
        },
        project_id: { 
            type: DataTypes.INTEGER, 
            allowNull: false,
            // references: { model: 'projects_tb', key: 'project_id' },
            // onDelete: 'CASCADE'
        },
    }, {
        tableName: 'project_reports_tb',
        timestamps: true,
        underscored: true,
    });

    ProjectReport.associate = function(models) {
        ProjectReport.belongsTo(models.Account, { foreignKey: 'reporter_id' });
        ProjectReport.belongsTo(models.Project, { foreignKey: 'project_id'  });
    }

    return ProjectReport;
}