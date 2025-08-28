const { DataTypes } = require("sequelize");


/**
 * 
 * @param {import('sequelize').Sequelize} sequelize 
 */
module.exports = function (sequelize) {

    const Department = sequelize.define('Department', {
        department_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        department_name: { type: DataTypes.STRING(255), unique: true, allowNull: false },
        collage_id: { 
            type: DataTypes.INTEGER, 
            allowNull: false,
        }
    }, {
        tableName: 'departments_tb',
        timestamps: true,
        underscored: true,
        indexes: [{
            unique: true,
            fields: ['collage_id', 'department_name'] // تركيبة فريدة
        }]
    });

    Department.associate = function(models) {
        Department.belongsTo(models.Collage, { foreignKey: 'collage_id' });
        Department.hasMany(models.Student, { foreignKey: 'department_id', onDelete: 'CASCADE' });
        Department.hasMany(models.Project, { foreignKey: 'department_id', onDelete: 'CASCADE' });
        Department.hasMany(models.Supervisor, { foreignKey: 'department_id', onDelete: 'CASCADE' });
    }

    return Department;
}