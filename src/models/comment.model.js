const { Model, DataTypes } = require("sequelize");

/**
 * @class Comment
 * @extends Model
 * @classdesc Represents comments on projects.  
 * Comments can be nested (replies) and associated with accounts.
 * 
 * 🔑 **Notes:**
 * - Each comment belongs to a project and optionally to an account.
 * - Supports replies, likes, and reports.
 */
class Comment extends Model {
    /**
     * Define associations for the Comment model.
     * @param {object} models - All sequelize models.
     */
    static associate(models) {
        // Comment belongs to Account (optional)
        Comment.belongsTo(models.Account, { 
            foreignKey: 'account_id' 
        });

        // Comment can have many likes
        Comment.hasMany(models.CommentLike, { 
            foreignKey: 'comment_id',
            onDelete: 'CASCADE',
        });

        // Comment can have many replies
        Comment.hasMany(models.Comment, { 
            as: 'Replies', 
            foreignKey: 'parent_id', 
            onDelete: 'CASCADE'
        });

        // Comment can belong to a parent comment
        Comment.belongsTo(models.Comment, { 
            as: 'Parent', 
            foreignKey: 'parent_id' 
        });

        // Comment can have many reports
        Comment.hasMany(models.CommentReport, { 
            foreignKey: 'comment_id', 
            onDelete: 'CASCADE' 
        });

        // Comment belongs to a project
        Comment.belongsTo(models.Project, { 
            foreignKey: 'project_id' 
        });
    }
}

/**
 * Initialize the Comment model.
 *
 * @param {import("sequelize").Sequelize} sequelize - Sequelize instance.
 * @returns {typeof Comment} Comment model.
 */
function CommentModel(sequelize) {
    Comment.init(
        {
            /**
             * Primary key for the comment
             * @type {number}
             */
            comment_id: { 
                type: DataTypes.INTEGER, 
                autoIncrement: true, 
                primaryKey: true 
            },

            /**
             * Content of the comment
             * @type {string}
             */
            comment_content: { 
                type: DataTypes.STRING(512), 
                allowNull: false 
            },

            /**
             * Project ID to which the comment belongs
             * @type {number}
             */
            project_id: { 
                type: DataTypes.INTEGER, 
                allowNull: false,
            },

            /**
             * Account ID of the author (optional)
             * @type {string}
             */
            account_id: { 
                type: DataTypes.UUID, 
                allowNull: true,
            },

            /**
             * Parent comment ID for nested comments (optional)
             * @type {number|null}
             */
            parent_id: { 
                type: DataTypes.INTEGER, 
                allowNull: true, 
                defaultValue: null, 
            },
        },
        {
            sequelize,
            modelName: "Comment",
            tableName: "comments_tb",
            timestamps: true,
            underscored: true,
        }
    );

    return Comment;
}

module.exports = CommentModel;