const { DataTypes } = require("sequelize");


/**
 * 
 * @param {import('sequelize').Sequelize} sequelize 
 */
module.exports = function (sequelize) {

    const Permission = sequelize.define('Permission', {
        permission_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true }, 
        permission_name: { type: DataTypes.STRING(100), allowNull: false, unique: true }
    }, {
        tableName: 'permission_tb',
        timestamps: true,
        underscored: true,
    });

    Permission.associate = function(models) {

        Permission.belongsToMany(models.Account, { 
            through: models.AccountPermission, 
            foreignKey: 'permissions_id', 
            onDelete: 'CASCADE'
        });
    }

    return Permission;
}