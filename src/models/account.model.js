const { DataTypes } = require("sequelize");
const { v4: uuidv4 } = require('uuid');


/** @param {import('sequelize').Sequelize} sequelize */

module.exports =  function (sequelize) {

    const Account = sequelize.define('Account', {
        account_id: { 
            type: DataTypes.UUID, 
            defaultValue: DataTypes.UUIDV4, 
            primaryKey: true 
        },
        fst_name: { type: DataTypes.STRING(100), allowNull: false, },
        lst_name: { type: DataTypes.STRING(100), allowNull: false, },
        account_email: { type: DataTypes.STRING(255), allowNull: false, unique: true },
        verified_email: { type: DataTypes.BOOLEAN, defaultValue: false, allowNull: true },
        hashed_password: { type: DataTypes.STRING(255), allowNull: false },
        account_role: { type: DataTypes.ENUM('user', 'admin', 'manager'), allowNull: false },
        profile_image_id: { 
            type: DataTypes.INTEGER, 
            allowNull: true,
        },
    }, {
        tableName: 'accounts_tb',
        timestamps: true,
        underscored: true,
    });

    Account.addHook('beforeCreate', async (account, options) => {
        if (account.account_role === 'manager') {
        const managerExists = await Account.findOne({ where: { account_role: 'manager' } });
            if (managerExists) {
                throw new Error('Only one manager account is allowed.');
            }
        }
    });

    Account.addHook('beforeUpdate', async (account, options) => {
        if (account.account_role === 'manager') {
            const managerExists = await Account.findOne({
                where: {
                    account_role: 'manager',
                    account_id: { [sequelize.Op.ne]: account.account_id } // استثني الحساب نفسه
                }
            });
            if (managerExists) {
                throw new Error('Only one manager account is allowed.');
            }
        }
    });


    Account.associate = function (models) {
        
        Account.belongsToMany(models.Permission, { 
            through: models.AccountPermission, 
            foreignKey: 'account_id', 
            onDelete: 'CASCADE' 
        });

        Account.hasMany(models.AccountReport, { 
            as: 'SentReports', 
            foreignKey: 'reporter_id', 
            onDelete: 'CASCADE' 
        });

        Account.hasMany(models.Comment, { 
            foreignKey: 'account_id', 
            onDelete: 'CASCADE' 
        });

        Account.belongsTo(models.Image, { 
            foreignKey: 'profile_image_id', 
        });

        Account.hasMany(models.ProjectLike, { 
            foreignKey: 'account_id', 
            onDelete: 'CASCADE' 
        });

        Account.hasMany(models.CommentLike, { 
            foreignKey: 'account_id', 
            onDelete: 'CASCADE' 
        });

        Account.hasMany(models.Rating, { 
            foreignKey: 'account_id', 
            onDelete: 'CASCADE' 
        });

        Account.hasOne(models.Student, { 
            foreignKey: 'account_id', 
            onDelete: 'SET NULL' 
        });

        Account.hasOne(models.Supervisor, { 
            foreignKey: 'account_id', 
            onDelete: 'SET NULL' 
        });

        Account.hasMany(models.ProjectReport, { 
            foreignKey: 'reporter_id', 
            onDelete: 'CASCADE' 
        });

        Account.hasMany(models.CommentReport, { 
            foreignKey: 'reporter_id', 
            onDelete: 'CASCADE' 
        });

        Account.hasMany(models.AccountReport, { 
            as: 'ReceivedReports', 
            foreignKey: 'account_id', 
            onDelete: 'CASCADE'
        });

        Account.hasMany(models.RefreshToken, {
            foreignKey: 'account_id',
            onDelete: 'CASCADE',
            hooks: true, // مهم لتمكين CASCADE عند استخدام Sequelize hooks
        });
    }

    return Account;
}