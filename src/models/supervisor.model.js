const { DataTypes } = require("sequelize");
const { v4: uuidv4 } = require('uuid');


/**
 * 
 * @param {import('sequelize').Sequelize} sequelize 
 */
module.exports = function (sequelize) {

    const Supervisor = sequelize.define('Supervisor', {
        supervisor_id: { 
            type: DataTypes.UUID, 
            defaultValue: uuidv4, 
            primaryKey: true, 
        },
        supervisor_name: { type: DataTypes.STRING(50), allowNull: false },
        supervisor_father_name: { type: DataTypes.STRING(50), allowNull: false },
        supervisor_grandfather_name: { type: DataTypes.STRING(50), allowNull: false },
        supervisor_family_name: { type: DataTypes.STRING(50), allowNull: false },
        supervisor_full_name: { type: DataTypes.STRING(50), allowNull: false },
        supervisor_title: { type: DataTypes.STRING(50), allowNull: true },
        supervisor_email: { type: DataTypes.STRING(255), allowNull: false },
        department_id: { type: DataTypes.INTEGER, allowNull: false, },
        account_id: { type: DataTypes.UUID, allowNull: true, defaultValue: null, },
        profile_image_id: { type: DataTypes.INTEGER, allowNull: true, defaultValue: null, },
    }, {
        tableName: 'supervisors_tb',
        timestamps: true,
        underscored: true,
    });

    Supervisor.beforeSave((supervisor, options) => {
        supervisor.full_name = [
            supervisor.supervisor_name,
            supervisor.supervisor_father_name,
            supervisor.supervisor_grandfather_name,
            supervisor.supervisor_family_name
        ].filter(Boolean).join(' ');
    });

    Supervisor.associate = function (models) {
        Supervisor.belongsTo(models.Account, { foreignKey: 'account_id' });
        Supervisor.belongsTo(models.Image, { foreignKey: 'profile_image_id' });
        Supervisor.hasMany(models.Project, { foreignKey: 'supervisor_id', onDelete: 'SET NULL' });
        Supervisor.belongsTo(models.Department, { foreignKey: 'department_id' });
    }

    return Supervisor;
}