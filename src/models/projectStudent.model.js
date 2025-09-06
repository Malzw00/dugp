const { DataTypes } = require("sequelize");


/**
 * 
 * @param {import('sequelize').Sequelize} sequelize 
 */
module.exports = function (sequelize) {

    const ProjectStudent = sequelize.define('ProjectStudent', {
        project_id: { type: DataTypes.INTEGER, allowNull: false },
        student_id: { type: DataTypes.UUID, allowNull: false },
    }, {
        tableName: 'project_students_tb',
        timestamps: true,
        underscored: true,
    });

    return ProjectStudent;
}