const { DataTypes } = require("sequelize");



/** @param {import('sequelize').Sequelize} sequelize */

module.exports =  function (sequelize) {

    const Account = sequelize.define('Account', {
        account_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        fst_name: { type: DataTypes.STRING(100), allowNull: false, },
        lst_name: { type: DataTypes.STRING(100), allowNull: false, },
        account_email: { type: DataTypes.STRING(255), allowNull: false, unique: true },
        verified_email: { type: DataTypes.BOOLEAN, defaultValue: false },
        hashed_password: { type: DataTypes.STRING(255), allowNull: false },
        account_role: { type: DataTypes.ENUM('user', 'admin', 'manager'), allowNull: false },
        profile_image_id: { 
            type: DataTypes.INTEGER, 
            allowNull: true, 
            references: { model: 'images_tb', key: 'image_id', },
        },
    }, {
        tableName: 'accounts_tb',
        timestamps: true,
        underscored: true,
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
    }

    return Account;
}