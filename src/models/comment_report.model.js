const { DataTypes } = require("sequelize");


/** @param {import('sequelize').Sequelize} sequelize */
module.exports = function (sequelize) {

    const CommentReport = sequelize.define('CommentReport', {
        report_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true, },
        report_reason: { type: DataTypes.STRING(512), allowNull: false },
        is_report_reviewed: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false, },
        is_report_resolved: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false, },
        reporter_id: { 
            type: DataTypes.INTEGER, 
            allowNull: false,
            references: { models: 'accounts_tb', key: 'account_id', }, 
            onDelete: 'CASCADE',
        },
        comment_id: { 
            type: DataTypes.INTEGER, 
            allowNull: false,
            references: { models: 'comments_tb', key: 'commnet_id', },
            onDelete: 'CASCADE',
        },
    }, {
        tableName: 'comment_reports_tb',
        timestamps: true,
        underscored: true,
    });

    CommentReport.associate = function (models) {
        CommentReport.belongsTo(models.Account, { foreignKey: 'reporter_id' });
        CommentReport.belongsTo(models.Comment, { foreignKey: 'comment_id' });
    }

    return CommentReport;
}