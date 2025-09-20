const { Model, DataTypes } = require("sequelize");

/**
 * @class CommentLike
 * @extends Model
 * @classdesc Represents a "like" on a comment by an account.
 * 
 * 🔑 **Notes:**
 * - Each account can like a comment only once (unique constraint on `account_id` + `comment_id`).
 * - Supports relations with Account and Comment models.
 */
class CommentLike extends Model {
    /**
     * Define associations for the CommentLike model.
     * @param {object} models - All sequelize models.
     */
    static associate(models) {
        // Each like belongs to an account
        CommentLike.belongsTo(models.Account, { foreignKey: 'account_id' });

        // Each like belongs to a comment
        CommentLike.belongsTo(models.Comment, { foreignKey: 'comment_id' });
    }
}

/**
 * Initialize the CommentLike model.
 *
 * @param {import("sequelize").Sequelize} sequelize - Sequelize instance.
 * @returns {typeof CommentLike} CommentLike model.
 */
function CommentLikeModel(sequelize) {
    CommentLike.init(
        {
            /**
             * Primary key for the comment like
             * @type {number}
             */
            comment_like_id: { 
                type: DataTypes.INTEGER, 
                primaryKey: true, 
                autoIncrement: true 
            },

            /**
             * Account ID who liked the comment
             * @type {string}
             */
            account_id: { 
                type: DataTypes.UUID, 
                allowNull: false 
            },

            /**
             * Comment ID which is liked
             * @type {number}
             */
            comment_id: { 
                type: DataTypes.INTEGER, 
                allowNull: false 
            },
        },
        {
            sequelize,
            modelName: "CommentLike",
            tableName: "comment_likes_tb",
            timestamps: true,
            underscored: true,
            indexes: [
                { unique: true, fields: ['account_id', 'comment_id'] }
            ],
        }
    );

    return CommentLike;
}

module.exports = CommentLikeModel;