const { DataTypes } = require("sequelize");


/** @param {import('sequelize').Sequelize} sequelize */
module.exports = function (sequelize) {

    const ProjectReference = sequelize.define('ProjectReference', {
        project_reference_id: { 
            type: DataTypes.INTEGER, 
            autoIncrement: true, 
            primaryKey: true, 
        },
        reference_id: {
            type: DataTypes.INTEGER, 
            allowNull: false,
        },
        project_id: { 
            type: DataTypes.INTEGER, 
            allowNull: false,
        },
    }, {
        tableName: 'project_references_tb',
        timestamps: true,
        underscored: true,
        indexes: [
            {
                unique: true,
                fields: ['reference_id', 'project_id']
            }
        ]
    });

    return ProjectReference;
}