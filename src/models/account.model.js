const { Model, DataTypes, Op } = require("sequelize");

/**
 * @class Account
 * @extends Model
 * @classdesc Represents a user account in the system.
 * 
 * 🔑 **Notes:**
 * - Each account has a unique email.
 * - Only one `manager` account is allowed (validated by hooks).
 * - Supports relations with permissions, reports, comments, likes, ratings, and student/supervisor profiles.
 */
class Account extends Model {
    /**
     * Define associations for the Account model.
     * @param {object} models - All sequelize models.
     */
    static associate(models) {
        // Many-to-Many: Accounts ↔ Permissions
        Account.belongsToMany(models.Permission, { 
            through: models.AccountPermission, 
            foreignKey: 'account_id', 
            onDelete: 'CASCADE' 
        });

        // One-to-Many relationships
        Account.hasMany(models.AccountReport, { as: 'SentReports', foreignKey: 'reporter_id', onDelete: 'CASCADE' });
        Account.hasMany(models.ProjectReport, { foreignKey: 'reporter_id', onDelete: 'CASCADE' });
        Account.hasMany(models.CommentReport, { foreignKey: 'reporter_id', onDelete: 'CASCADE' });
        Account.hasMany(models.Comment, { foreignKey: 'account_id', onDelete: 'CASCADE' });
        Account.hasMany(models.ProjectLike, { foreignKey: 'account_id', onDelete: 'CASCADE' });
        Account.hasMany(models.CommentLike, { foreignKey: 'account_id', onDelete: 'CASCADE' });
        Account.hasMany(models.Rating, { foreignKey: 'account_id', onDelete: 'CASCADE' });
        Account.hasMany(models.RefreshToken, { foreignKey: 'account_id', onDelete: 'CASCADE', hooks: true });
        Account.hasMany(models.AccountReport, { as: 'ReceivedReports', foreignKey: 'account_id', onDelete: 'CASCADE' });

        // One-to-One relationships
        Account.hasOne(models.Student, { foreignKey: 'account_id', onDelete: 'SET NULL' });
        Account.hasOne(models.Supervisor, { foreignKey: 'account_id', onDelete: 'SET NULL' });

        // Profile image
        Account.belongsTo(models.File, { foreignKey: 'profile_image_id', as: 'ProfileImage' });
    }
}

/**
 * Initialize the Account model.
 *
 * @param {import("sequelize").Sequelize} sequelize - Sequelize instance.
 * @returns {typeof Account} Account model.
 */
function AccountModel(sequelize) {
    Account.init(
        {
            /**
             * Primary key (UUID)
             * @type {string}
             */
            account_id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },

            /** 
             * First name 
             * @type {string}
             */
            fst_name: { type: DataTypes.STRING(100), allowNull: false },

            /** 
             * Last name
             * @type {string} 
             */
            lst_name: { type: DataTypes.STRING(100), allowNull: false },

            /** 
             * Email (unique) 
             * @type {string}
             */
            account_email: { type: DataTypes.STRING(255), allowNull: false, unique: 'unique_account_email' },

            /** 
             * Email verified flag 
             * @type {boolean}
             */
            verified_email: { type: DataTypes.BOOLEAN, defaultValue: false },

            /** 
             * Hashed password 
             * @type {string}
             */
            hashed_password: { type: DataTypes.STRING(255), allowNull: false },

            /** 
             * Role: user, admin, or manager 
             * @enum { 'user', 'admin', 'manager' } 
             * @type {}
             */
            account_role: { type: DataTypes.ENUM('user', 'admin', 'manager'), allowNull: false },

            /** Optional profile image */
            profile_image_id: { type: DataTypes.INTEGER, allowNull: true },
        },
        {
            sequelize,
            modelName: "Account",
            tableName: "accounts_tb",
            timestamps: true,
            underscored: true,
            hooks: {
                /** Ensure only one manager account exists */
                beforeCreate: async (account) => {
                    if (account.account_role === 'manager') {
                        const exists = await Account.findOne({ where: { account_role: 'manager' } });
                        if (exists) throw new Error('Only one manager account is allowed.');
                    }
                },
                beforeUpdate: async (account) => {
                    if (account.account_role === 'manager') {
                        const exists = await Account.findOne({
                            where: { account_role: 'manager', account_id: { [Op.ne]: account.account_id } }
                        });
                        if (exists) throw new Error('Only one manager account is allowed.');
                    }
                }
            }
        }
    );

    return Account;
}

module.exports = AccountModel;