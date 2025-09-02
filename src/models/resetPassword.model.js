const { DataTypes } = require("sequelize");


/**
 * 
 * @param {import('sequelize').Sequelize} sequelize 
 */
module.exports = function (sequelize) {

    const ResetPassword = sequelize.define('ResetPassword', {
        reset_password_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, },
        token: { type: DataTypes.TEXT, allowNull: false, unique: true, },
        account_id: { type: DataTypes.INTEGER, allowNull: true, },
        expires_at: { 
            type: DataTypes.DATE,
            allowNull: false, 
            defaultValue: new Date() + (15 * 60 * 1000) 
        }
    }, {
        tableName: 'reset_password_tb',
        timestamps: true,
        underscored: true,
    });

    ResetPassword.associate = (models) => {
        
        ResetPassword.belongsTo(models.Account, {
            foreignKey: 'account_id',
            onDelete: 'CASCADE',
            hooks: true,
        });
    }

    return ResetPassword;
}