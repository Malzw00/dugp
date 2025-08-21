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
            // references: { model: 'collages_tb', key: 'collage_id' },
            // onDelete: 'RESTRICT'
        }
    }, {
        tableName: 'departments_tb',
        timestamps: true,
        underscored: true,
    });

    Department.associate = function(models) {
        Department.belongsTo(models.Collage, { foreignKey: 'collage_id' });
        Department.hasMany(models.Student, { foreignKey: 'department_id', onDelete: 'RESTRICT' });
        Department.hasMany(models.Project, { foreignKey: 'department_id', onDelete: 'RESTRICT' });
        Department.hasMany(models.Supervisor, { foreignKey: 'department_id', onDelete: 'RESTRICT' });
    }

    return Department;
}