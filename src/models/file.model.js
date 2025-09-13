const { DataTypes } = require("sequelize");


/**
 * @param {import('sequelize').Sequelize} sequelize 
 */
module.exports = function (sequelize) {

    const File = sequelize.define('File', {
        file_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        original_name: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        path: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        stored_name: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        mime_type: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        category: {
            type: DataTypes.ENUM('book', 'presentation', 'image', 'reference'),
            allowNull: false,
        },
        size: {
            type: DataTypes.BIGINT,
            allowNull: false,
        },
        file_hash: {
            type: DataTypes.STRING(128),
            allowNull: false,
            unique: true,
        },
        uploader_id: {
            type: DataTypes.UUID,
            allowNull: false,
        },
    }, {
        tableName: 'files_tb',
        timestamps: true,
        underscored: true,
    });

    File.associate = function (models) {
        
        File.belongsTo(models.Account, {
            foreignKey: 'uploader_id',
            as: 'Uploader'
        });

        File.belongsToMany(models.Project, {
            through: models.ProjectReference,
            foreignKey: 'file_id'
        });
    }

    return File;
}