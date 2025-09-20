const { Model, DataTypes } = require("sequelize");

/**
 * @class AccountPermission
 * @extends Model
 * @classdesc Junction table linking Accounts with Permissions.  
 * Each record specifies which permission is granted to a specific account.
 *
 * 🔑 **Notes:**
 * - Surrogate primary key `account_permission_id`.
 * - Maintains foreign keys to `accounts_tb` and `permissions_tb`.
 */
class AccountPermission extends Model {
    /**
     * Define associations for the AccountPermission model.
     * @param {object} models - All sequelize models.
     */
    static associate(models) {
        // One-to-Many: AccountPermission ↔ PermissionScopes
        AccountPermission.hasMany(models.PermissionScope, {
            foreignKey: 'account_permission_id',
            onDelete: 'CASCADE',
        });

        // Optional: Relations to Account and Permission for convenience
        AccountPermission.belongsTo(models.Account, {
            foreignKey: 'account_id',
            onDelete: 'CASCADE',
        });

        AccountPermission.belongsTo(models.Permission, {
            foreignKey: 'permission_id',
            onDelete: 'CASCADE',
        });
    }
}

/**
 * Initialize the AccountPermission model.
 *
 * @param {import("sequelize").Sequelize} sequelize - Sequelize instance.
 * @returns {typeof AccountPermission} AccountPermission model.
 */
function AccountPermissionModel(sequelize) {
    AccountPermission.init(
        {
            /** Primary key */
            account_permission_id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },

            /** Foreign key to Account */
            account_id: { 
                type: DataTypes.UUID, 
                allowNull: false, 
                references: { model: 'accounts_tb', key: 'account_id' },
                onDelete: 'CASCADE',
            },

            /** Foreign key to Permission */
            permission_id: { 
                type: DataTypes.STRING(25), 
                allowNull: false,
                references: { model: 'permissions_tb', key: 'permission_id' },
                onDelete: 'CASCADE',
            },
        },
        {
            sequelize,
            modelName: "AccountPermission",
            tableName: "account_permissions_tb",
            timestamps: true,
            underscored: true,
        }
    );

    return AccountPermission;
}

module.exports = AccountPermissionModel;