const { DataTypes } = require("sequelize");


/**
 * 
 * @param {import('sequelize').Sequelize} sequelize 
 */
module.exports = function (sequelize) {

    const ProjectReferences = sequelize.define('ProjectReferences', {
        ref_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true, },
        ref_title: { type: DataTypes.STRING(512), allowNull: false, },
        ref_path: { type: DataTypes.TEXT, allowNull: false },
        project_id: { 
            type: DataTypes.INTEGER, 
            allowNull: false,
            // references: { model: 'projects_tb', key: 'project_id' },
            // onDelete: 'CASCADE'
        },
    }, {
        tableName: 'project_references_tb',
        timestamps: true,
    });

    ProjectReferences.associate = function (models) {
        ProjectReferences.belongsTo(models.Project, { foreignKey: 'project_id' });
    }

    return ProjectReferences;
}