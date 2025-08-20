const { DataTypes } = require("sequelize");


/**
 * 
 * @param {import('sequelize').Sequelize} sequelize 
 */
module.exports = function (sequelize) {

    const AccountPermission = sequelize.define('AccountPermission', {
        account_id: { 
            type: DataTypes.INTEGER, 
            allowNull: false, 
            references: { model: 'accounts_tb', key: 'account_id' },
            onDelete: 'CASCADE',
        },
        permission_id: { 
            type: DataTypes.INTEGER, 
            allowNull: false, 
            references: { model: 'permissions_tb', key: 'permission_id' },
            onDelete: 'CASCADE',
        },
    }, {
        tableName: 'account_permissions_tb',
        timestamps: true,
        underscored: true,
    });

    return AccountPermission;
}