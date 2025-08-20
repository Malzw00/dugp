const { DataTypes } = require("sequelize");


/**
 * 
 * @param {import('sequelize').Sequelize} sequelize 
 */
module.exports = function (sequelize) {

    const Supervisor = sequelize.define('Supervisor', {
        supervisors_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true, },
        supervisors_name: { type: DataTypes.STRING(50), allowNull: false },
        students_father_name: { type: DataTypes.STRING(50), allowNull: false },
        supervisors_grandfather_name: { type: DataTypes.STRING(50), allowNull: false },
        supervisors_family_name: { type: DataTypes.STRING(50), allowNull: false },
        supervisors_title: { type: DataTypes.STRING(50), allowNull: false },
        supervisors_email: { type: DataTypes.STRING(255), allowNull: false },
        department_id: { 
            type: DataTypes.INTEGER, 
            allowNull: false, 
            references: { model: 'departments_tb', key: 'department_id' },
            onDelete: 'RESTRICT'
        },
        account_id: { 
            type: DataTypes.INTEGER, 
            allowNull: true, 
            defaultValue: null,
            references: { model: 'accounts_tb', key: 'account_id' },
            onDelete: 'SET NULL',
        },
        profile_image_id: { 
            type: DataTypes.INTEGER, 
            allowNull: true, 
            defaultValue: null,
            references: { model: 'images_tb', key: 'image_id' },
            onDelete: 'SET NULL',
        },
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