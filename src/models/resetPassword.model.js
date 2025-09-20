const { DataTypes, Model } = require("sequelize");

/**
 * @class ResetPassword
 * @extends Model
 * @classdesc Represents a password reset token for an account.
 * 
 * 🔑 **Notes:**
 * - Each token is unique.
 * - Linked to a specific account (nullable if account is deleted).
 * - Automatically expires 15 minutes after creation by default.
 */
class ResetPassword extends Model {
    /**
     * Define associations for the ResetPassword model.
     * @param {object} models - All sequelize models.
     */
    static associate(models) {
        // ResetPassword belongs to an Account
        ResetPassword.belongsTo(models.Account, {
            foreignKey: 'account_id',
            onDelete: 'CASCADE',
            hooks: true,
        });
    }
}

/**
 * Initialize the ResetPassword model.
 *
 * @param {import("sequelize").Sequelize} sequelize - Sequelize instance.
 * @returns {typeof ResetPassword} ResetPassword model.
 */
function ResetPasswordModel(sequelize) {
    ResetPassword.init(
        {
            /**
             * Primary key for the reset password token
             * @type {number}
             */
            reset_password_id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },

            /**
             * The actual reset password token string
             * @type {string}
             */
            token: {
                type: DataTypes.STRING(512),
                allowNull: false,
                unique: true,
            },

            /**
             * Foreign key to the Account
             * @type {string} UUID
             */
            account_id: {
                type: DataTypes.UUID,
                allowNull: true,
            },

            /**
             * Expiration date/time of the token
             * @type {Date}
             */
            expires_at: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: () => new Date(Date.now() + 15 * 60 * 1000),
            },
        },
        {
            sequelize,
            modelName: "ResetPassword",
            tableName: "reset_password_tb",
            timestamps: true,
            underscored: true,
        }
    );

    return ResetPassword;
}

module.exports = ResetPasswordModel;