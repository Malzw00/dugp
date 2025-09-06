const { DataTypes } = require("sequelize");


/**
 * 
 * @param {import('sequelize').Sequelize} sequelize 
 */
module.exports = function (sequelize) {

    const ProjectKeyword = sequelize.define('ProjectKeyword', {
        keyword_id: { 
            type: DataTypes.INTEGER, 
            allowNull: false, 
        },
        project_id: { 
            type: DataTypes.INTEGER, 
            allowNull: false, 
        },
    }, {
        tableName: 'project_keywords_tb',
        timestamps: true,
        underscored: true,
    });

    return ProjectKeyword;
}