const { DataTypes } = require("sequelize");


/**
 * 
 * @param {import('sequelize').Sequelize} sequelize 
 */
module.exports = function (sequelize) {

    const RefreshToken = sequelize.define('RefreshToken', {
        refresh_token_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, },
        token: { type: DataTypes.STRING(512), allowNull: false, unique: true },
        account_id: { type: DataTypes.UUID, allowNull: false },
        expires_at: { type: DataTypes.DATE, allowNull: false },
    }, {
        tableName: 'refresh_token_tb',
        timestamps: true,
        underscored: true,
    });

    RefreshToken.associate = (models) => {
        
        RefreshToken.belongsTo(models.Account, {
            foreignKey: 'account_id',
            onDelete: 'CASCADE',
            hooks: true,
        });
    }

    return RefreshToken;
}