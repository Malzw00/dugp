const { DataTypes } = require("sequelize");


/** @param {import('sequelize').Sequelize} sequelize */
module.exports = function (sequelize) {

    const CommentLike = sequelize.define('CommentLike', {
        comment_like_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        account_id: { 
            type: DataTypes.INTEGER, 
            allowNull: true, 
        },
        comment_id: { 
            type: DataTypes.INTEGER, 
            allowNull: true, 
        },
    }, {
        tableName: 'comment_likes_tb',
        timestamps: true,
        underscored: true,
        indexes: [
            { unique: true, fields: ['account_id', 'comment_id'] }
        ],
    });

    CommentLike.associate = function(models) {
        CommentLike.belongsTo(models.Account, { foreignKey: 'account_id' });
        CommentLike.belongsTo(models.Comment, { foreignKey: 'comment_id' });
    }

    return CommentLike;
}