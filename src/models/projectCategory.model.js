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
        },
        category_id: { 
            type: DataTypes.INTEGER, 
            allowNull: false,
        },
    }, {
        tableName: 'project_categories_tb',
        timestamps: true,
        underscored: true,
    });

    return ProjectCategory;
}