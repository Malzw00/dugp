const { DataTypes } = require("sequelize");


/** @param {import('sequelize').Sequelize} sequelize */
module.exports = function (sequelize) {

    const ProjectLike = sequelize.define('ProjectLike', {
        project_like_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true, },
        account_id: { 
            type: DataTypes.INTEGER, 
            allowNull: true, 
        },
        project_id: { 
            type: DataTypes.INTEGER, 
            allowNull: true,
        },
    }, {
        tableName: 'project_likes_tb',
        timestamps: true,
        underscored: true,
        indexes: [
            { unique: true, fields: ['account_id', 'project_id'] }
        ]
    });

    ProjectLike.associate = function(models) {
        ProjectLike.belongsTo(models.Account, { foreignKey: 'account_id' });
        ProjectLike.belongsTo(models.Project, { foreignKey: 'project_id' });
    }

    return ProjectLike;
}