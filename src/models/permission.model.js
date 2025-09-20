const { Model, DataTypes } = require("sequelize");

/**
 * @class Permission
 * @extends Model
 * @classdesc Represents a permission that can be assigned to accounts.  
 * Used to control access and actions within the system.
 * 
 * 🔑 **Notes:**
 * - Each permission has a unique ID and name.
 * - Supports many-to-many relation with accounts via AccountPermission.
 */
class Permission extends Model {
    /**
     * Define associations for the Permission model.
     * @param {object} models - All sequelize models.
     */
    static associate(models) {
        // Permission can belong to many accounts
        Permission.belongsToMany(models.Account, {
            through: models.AccountPermission,
            foreignKey: 'permission_id',
            onDelete: 'CASCADE',
        });
    }
}

/**
 * Initialize the Permission model.
 *
 * @param {import("sequelize").Sequelize} sequelize - Sequelize instance.
 * @returns {typeof Permission} Permission model.
 */
function PermissionModel(sequelize) {
    Permission.init(
        {
            /**
             * Primary key for the permission
             * @type {string}
             */
            permission_id: {
                type: DataTypes.STRING(25),
                primaryKey: true,
            },

            /**
             * Name of the permission
             * @type {string}
             */
            permission_name: {
                type: DataTypes.STRING(100),
                allowNull: false,
                unique: true,
            },
        },
        {
            sequelize,
            modelName: "Permission",
            tableName: "permissions_tb",
            timestamps: true,
            underscored: true,
        }
    );

    return Permission;
}

module.exports = PermissionModel;