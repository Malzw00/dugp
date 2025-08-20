const { DataTypes } = require("sequelize");


/** @param {import('sequelize').Sequelize} sequelize */
module.exports = function (sequelize) {

    const CommentLike = sequelize.define('CommentLike', {
        account_id: { 
            type: DataTypes.INTEGER, 
            allowNull: true, 
            references: { model: 'accounts_tb', key: 'account_id' },
            onDelete: 'CASCADE'
        },
        comment_id: { 
            type: DataTypes.INTEGER, 
            allowNull: true, 
            references: { model: 'comments_tb', key: 'comment_id' },
            onDelete: 'CASCADE'
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