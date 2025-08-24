const { DataTypes } = require("sequelize");


/**
 * 
 * @param {import('sequelize').Sequelize} sequelize 
 */
module.exports = function (sequelize) {

    const Permission = sequelize.define('Permission', {
        permission_id: { type: DataTypes.STRING(25), primaryKey: true, }, 
        permission_name: { type: DataTypes.STRING(100), allowNull: false, unique: true }
    }, {
        tableName: 'permissions_tb',
    });

    Permission.associate = function(models) {

        Permission.belongsToMany(models.Account, { 
            through: models.AccountPermission, 
            foreignKey: 'permission_id',
            onDelete: 'CASCADE'
        });
    }

    return Permission;
}