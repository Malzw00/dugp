const { DataTypes } = require("sequelize");


/**
 * 
 * @param {import('sequelize').Sequelize} sequelize 
 */
module.exports = function (sequelize) {

    const ProjectPresentation = sequelize.define('ProjectPresentation', {
        presentation_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true, },
        presentation_path: { type: DataTypes.TEXT, allowNull: false },
        project_id: { 
            type: DataTypes.INTEGER, 
            allowNull: false,
            // references: { model: 'projects_tb', key: 'project_id' },
            // onDelete: 'CASCADE'
        },
    }, {
        tableName: 'project_presentations_tb',
        timestamps: true,
        underscored: true,
    });

    ProjectPresentation.associate = function(models) {
        ProjectPresentation.belongsTo(models.Project, { foreignKey: 'project_id' });
    }

    return ProjectPresentation;
}