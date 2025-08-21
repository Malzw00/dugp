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
            // references: { model: 'keywords_tb', key: 'keyword_id' },
            // onDelete: 'CASCADE',
        },
        project_id: { 
            type: DataTypes.INTEGER, 
            allowNull: false, 
            // references: { model: 'projects_tb', key: 'project_id' },
            // onDelete: 'CASCADE',
        },
    }, {
        tableName: 'project_keywords_tb',
        timestamps: true,
        underscored: true,
    });

    return ProjectKeyword;
}