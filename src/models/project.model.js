const { DataTypes } = require("sequelize");


/**
 * 
 * @param {import('sequelize').Sequelize} sequelize 
 */
module.exports = function (sequelize) {

    const Project = sequelize.define('Project', {
        project_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        project_title: { type: DataTypes.STRING(255), allowNull: false, unique: true },
        project_description: { type: DataTypes.STRING(512), allowNull: true, },
        project_year: { type: DataTypes.DATEONLY, allowNull: false },
        project_semester: { type: DataTypes.ENUM('Winter', 'Spring', 'Summer', 'Autumn'), allowNull: false },
        project_grade: { type: DataTypes.DECIMAL(5, 2), allowNull: true, validate: { min: 0.00, max: 100.00 } },
        department_id: { type: DataTypes.INTEGER, allowNull: false, },
        cover_image_id: { type: DataTypes.INTEGER, allowNull: true,defaultValue: null, },
        supervisor_id: { type: DataTypes.UUID, allowNull: true, },
    }, {
        tableName: 'projects_tb',
        timestamps: true,
        underscored: true,
    });

    Project.associate = function (models) {

        Project.belongsToMany(models.Category, { 
            through: models.ProjectCategory, 
            foreignKey: 'project_id', 
            onDelete: 'CASCADE' 
        });

        Project.belongsToMany(models.Keyword, { 
            through: models.ProjectKeyword, 
            foreignKey: 'project_id', 
            onDelete: 'CASCADE' 
        });
        
        Project.hasOne(models.ProjectPresentation, { foreignKey: 'project_id', onDelete: 'CASCADE' });
        
        Project.hasOne(models.ProjectBook, { foreignKey: 'project_id', onDelete: 'CASCADE' });
        
        Project.hasMany(models.ProjectReference, { foreignKey: 'project_id', onDelete: 'CASCADE' });
        
        Project.belongsToMany(models.Student, { 
            through: models.ProjectStudent, 
            foreignKey: 'project_id', 
            onDelete: 'CASCADE' 
        });
        
        Project.belongsTo(models.Supervisor, { foreignKey: 'supervisor_id' });
        
        Project.belongsTo(models.Image, { foreignKey: 'cover_image_id'});
        
        Project.hasMany(models.Comment, { foreignKey: 'project_id', onDelete: 'CASCADE' });
        
        Project.hasMany(models.ProjectLike, { foreignKey: 'project_id', onDelete: 'CASCADE' });
        
        Project.hasMany(models.Rating, { foreignKey: 'project_id', onDelete: 'CASCADE' });
        
        Project.hasMany(models.ProjectReport, { foreignKey: 'project_id', onDelete: 'CASCADE' });

        Project.belongsTo(models.Department, { foreignKey: 'department_id' });
    }

    return Project;
}