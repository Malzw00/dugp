const { DataTypes } = require("sequelize");


/**
 * 
 * @param {import('sequelize').Sequelize} sequelize 
 */
module.exports = function (sequelize) {

    const Supervisor = sequelize.define('Supervisor', {
        supervisor_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true, },
        supervisor_name: { type: DataTypes.STRING(50), allowNull: false },
        supervisor_father_name: { type: DataTypes.STRING(50), allowNull: false },
        supervisor_grandfather_name: { type: DataTypes.STRING(50), allowNull: false },
        supervisor_family_name: { type: DataTypes.STRING(50), allowNull: false },
        supervisor_title: { type: DataTypes.STRING(50), allowNull: false },
        supervisor_email: { type: DataTypes.STRING(255), allowNull: false },
        department_id: { type: DataTypes.INTEGER, allowNull: false, },
        account_id: { type: DataTypes.INTEGER, allowNull: true, defaultValue: null, },
        profile_image_id: { type: DataTypes.INTEGER, allowNull: true, defaultValue: null, },
    }, {
        tableName: 'supervisors_tb',
        timestamps: true,
        underscored: true,
    });

    Supervisor.associate = function (models) {
        Supervisor.belongsTo(models.Account, { foreignKey: 'account_id' });
        Supervisor.belongsTo(models.Image, { foreignKey: 'profile_image_id' });
        Supervisor.hasMany(models.Project, { foreignKey: 'supervisor_id', onDelete: 'SET NULL' });
        Supervisor.belongsTo(models.Department, { foreignKey: 'department_id' });
    }

    return Supervisor;
}