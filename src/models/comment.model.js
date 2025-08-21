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
            // references: { model: 'projects_tb', key: 'project_id' }
        },
        account_id: { 
            type: DataTypes.INTEGER, 
            allowNull: true,
            // references: { model: 'accounts_tb', key: 'account_id' },
            // onDelete: 'CASCADE'
        },
        parent_id: { 
            type: DataTypes.INTEGER, 
            allowNull: true, 
            defaultValue: null, 
            // references: { model: 'comments_tb', key: 'comment_id' },
            // onDelete: 'CASCADE'
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