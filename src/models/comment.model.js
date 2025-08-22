const { DataTypes } = require("sequelize");


/**
 * 
 * @param {import('sequelize').Sequelize} sequelize 
 */
module.exports = function (sequelize) {

    const Comment = sequelize.define('Comment', {
        comment_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        comment_content: { type: DataTypes.STRING(512), allowNull: false },
        project_id: { 
            type: DataTypes.INTEGER, 
            allowNull: false,
        },
        account_id: { 
            type: DataTypes.INTEGER, 
            allowNull: true,
        },
        parent_id: { 
            type: DataTypes.INTEGER, 
            allowNull: true, 
            defaultValue: null, 
        }
    }, {
        tableName: 'comments_tb',
        timestamps: true,
        underscored: true,
    });

    Comment.associate = function(models) {

        Comment.belongsTo(models.Account, { 
            foreignKey: 'account_id' 
        });

        Comment.hasMany(models.CommentLike, { 
            foreignKey: 'comment_id', 
            onDelete: 'CASCADE'
        });

        Comment.hasMany(models.Comment, { 
            as: 'Replies', 
            foreignKey: 'parent_id', 
            onDelete: 'CASCADE'
        });

        Comment.belongsTo(models.Comment, { 
            as: 'Parent', 
            foreignKey: 'parent_id' 
        });

        Comment.hasMany(models.CommentReport, { 
            foreignKey: 'comment_id', 
            onDelete: 'CASCADE' 
        });

        Comment.belongsTo(models.Project, { 
            foreignKey: 'project_id' 
        });
    }

    return Comment;
}