const { Model, DataTypes } = require("sequelize");

/**
 * @class PermissionScope
 * @extends Model
 * @classdesc Represents the scope of a permission for a specific account and collage.
 * 
 * 🔑 **Notes:**
 * - Links an AccountPermission to a specific Collage.
 */
class PermissionScope extends Model {
    /**
     * Define associations for the PermissionScope model.
     * @param {object} models - All sequelize models.
     */
    static associate(models) {
        // PermissionScope belongs to an AccountPermission
        PermissionScope.belongsTo(models.AccountPermission, {
            foreignKey: 'account_permission_id',
        });

        // PermissionScope belongs to a Collage
        PermissionScope.belongsTo(models.Collage, {
            foreignKey: 'collage_id',
        });
    }
}

/**
 * Initialize the PermissionScope model.
 *
 * @param {import("sequelize").Sequelize} sequelize - Sequelize instance.
 * @returns {typeof PermissionScope} PermissionScope model.
 */
function PermissionScopeModel(sequelize) {
    PermissionScope.init(
        {
            /**
             * Primary key for the permission scope
             * @type {number}
             */
            permission_scope_id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },

            /**
             * Foreign key to AccountPermission
             * @type {number}
             */
            account_permission_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },

            /**
             * Foreign key to Collage
             * @type {number}
             */
            collage_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: "PermissionScope",
            tableName: "permission_scopes_tb",
            timestamps: true,
            underscored: true,
        }
    );

    return PermissionScope;
}

module.exports = PermissionScopeModel;