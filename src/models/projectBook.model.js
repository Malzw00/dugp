const { DataTypes } = require("sequelize");


/** @param {import('sequelize').Sequelize} sequelize */

module.exports = function (sequelize) {

    const ProjectBook = sequelize.define('ProjectBook', {
        book_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true, },
        book_path: { type: DataTypes.TEXT, allowNull: false },
        project_id: { 
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true
        },
    }, {
        tableName: 'project_books_tb',
        timestamps: true,
        underscored: true,
    });

    ProjectBook.associate = function(models) {
        ProjectBook.belongsTo(models.Project, { foreignKey: 'project_id' });
    }

    return ProjectBook;
}