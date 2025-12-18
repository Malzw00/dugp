const { DataTypes, Model } = require("sequelize");

/**
 * @class RefreshToken
 * @extends Model
 * @classdesc Represents a refresh token for an account used for authentication.
 * 
 * 🔑 **Notes:**
 * - Each token is unique.
 * - Linked to a specific account.
 * - Used to refresh access tokens for authentication.
 */
class RefreshToken extends Model {
    /**
     * Define associations for the RefreshToken model.
     * @param {object} models - All sequelize models.
     */
    static associate(models) {
        // RefreshToken belongs to an Account
        RefreshToken.belongsTo(models.Account, {
            foreignKey: 'account_id',
            onDelete: 'CASCADE',
            hooks: true,
        });
    }
}

/**
 * Initialize the RefreshToken model.
 *
 * @param {import("sequelize").Sequelize} sequelize - Sequelize instance.
 * @returns {typeof RefreshToken} RefreshToken model.
 */
function RefreshTokenModel(sequelize) {
    RefreshToken.init(
        {
            /**
             * Primary key for the refresh token
             * @type {number}
             */
            refresh_token_id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },

            /**
             * The actual refresh token string
             * @type {string}
             */
            token: {
                type: DataTypes.STRING(512),
                allowNull: false,
                unique: 'unique_token',
            },

            /**
             * Foreign key to the Account
             * @type {string} UUID
             */
            account_id: {
                type: DataTypes.UUID,
                allowNull: false,
            },

            /**
             * Expiration date/time of the token
             * @type {Date}
             */
            expires_at: {
                type: DataTypes.DATE,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: "RefreshToken",
            tableName: "refresh_token_tb",
            timestamps: true,
            underscored: true,
        }
    );

    return RefreshToken;
}

module.exports = RefreshTokenModel;