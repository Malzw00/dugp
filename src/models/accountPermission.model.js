const { DataTypes } = require("sequelize");


/**
 * 
 * @param {import('sequelize').Sequelize} sequelize 
 */
module.exports = function (sequelize) {

    const AccountPermission = sequelize.define('AccountPermission', {
        account_permission_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: true,
        },
        account_id: { 
            type: DataTypes.UUID, 
            allowNull: false, 
            references: { model: 'accounts_tb', key: 'account_id' },
            onDelete: 'CASCADE',
        },
        permission_id: { 
            type: DataTypes.STRING(25), 
            allowNull: false,
        },
    }, {
        tableName: 'account_permissions_tb',
        timestamps: true,
        underscored: true,
    });

    AccountPermission.associate = function (models) {
        AccountPermission.hasMany(models.PermissionScope, {
            foreignKey: 'account_permission_id',
            onDelete: 'CASCADE',
        });
    }

    return AccountPermission;
}