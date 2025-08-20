const { DataTypes } = require("sequelize");


/**
 * 
 * @param {import('sequelize').Sequelize} sequelize 
 */
module.exports = function (sequelize) {

    const ProjectCategory = sequelize.define('ProjectCategory', {
        project_id: { 
            type: DataTypes.INTEGER, 
            allowNull: false,
            references: { model: 'projects_tb', key: 'project_id' },
            onDelete: 'CASCADE'
        },
        category_id: { 
            type: DataTypes.INTEGER, 
            allowNull: false,
            references: { model: 'categories_tb', key: 'category_id' },
            onDelete: 'CASCADE'
        },
    }, {
        tableName: 'project_categories_tb',
        timestamps: true,
        underscored: true,
    });

    return ProjectCategory;
}