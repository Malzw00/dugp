const { DataTypes } = require("sequelize");


/**
 * 
 * @param {import('sequelize').Sequelize} sequelize 
 */
module.exports = function (sequelize) {

    const PermissionScope = sequelize.define('PermissionScope', {
        account_permission_id: { type: DataTypes.INTEGER, allowNull: false, },
        collage_id: { type: DataTypes.INTEGER, allowNull: false, }
    }, {
        tableName: 'permission_scopes_tb',
        timestamps: true,
        underscored: true,
    });

    PermissionScope.associate = function (models) {
        PermissionScope.belongsTo(models.AccountPermission, {
            foreignKey: 'account_permission_id',
        });
        PermissionScope.belongsTo(models.Collage, {
            foreignKey: 'collage_id',
        });
    }

    return PermissionScope;
}