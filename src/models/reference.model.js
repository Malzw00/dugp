const { DataTypes } = require("sequelize");

/** @param {import('sequelize').Sequelize} sequelize */
module.exports = function (sequelize) {

    const Reference = sequelize.define('Reference', {
        reference_id: {
            type: DataTypes.INTEGER, 
            autoIncrement: true,
            primaryKey: true,
        },
        reference_title: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        reference_author: {
            type: DataTypes.STRING(150),
            allowNull: true,
        },
        reference_link: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
    }, {
        tableName: 'references_tb',
        timestamps: true,
        underscored: true,
    });


    Reference.associate = (models) => {
        Reference.belongsToMany(models.Project, {
            through: models.ProjectReference,
            as: 'Projects',
            onDelete: 'CASCADE',
            foreignKey: 'reference_id',
            otherKey: 'project_id',
            timestamps: false,
        });
    }

    return Reference;
}