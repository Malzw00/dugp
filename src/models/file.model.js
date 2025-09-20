const { Model, DataTypes } = require("sequelize");

/**
 * @class File
 * @extends Model
 * @classdesc Represents uploaded files in the system.  
 * Can be books, presentations, images, or references.  
 * Tracks file metadata and uploader.
 * 
 * 🔑 **Notes:**
 * - Each file has a unique hash (`file_hash`) to prevent duplicates.
 * - Supports relations with Account (uploader) and Projects via ProjectReference.
 */
class File extends Model {
    /**
     * Define associations for the File model.
     * @param {object} models - All sequelize models.
     */
    static associate(models) {
        // File belongs to an uploader account
        File.belongsTo(models.Account, {
            foreignKey: 'uploader_id',
            as: 'Uploader'
        });

        // File can be linked to many projects
        File.belongsToMany(models.Project, {
            through: models.ProjectReference,
            foreignKey: 'file_id'
        });
    }
}

/**
 * Initialize the File model.
 *
 * @param {import("sequelize").Sequelize} sequelize - Sequelize instance.
 * @returns {typeof File} File model.
 */
function FileModel(sequelize) {
    File.init(
        {
            /**
             * Primary key for the file
             * @type {number}
             */
            file_id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },

            /**
             * Original name of the uploaded file
             * @type {string}
             */
            original_name: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },

            /**
             * Path where the file is stored
             * @type {string}
             */
            path: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },

            /**
             * Stored name of the file on disk
             * @type {string}
             */
            stored_name: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },

            /**
             * MIME type of the file
             * @type {string}
             */
            mime_type: {
                type: DataTypes.STRING(100),
                allowNull: false,
            },

            /**
             * File category
             * @type {'book'|'presentation'|'image'|'reference'}
             */
            category: {
                type: DataTypes.ENUM('book', 'presentation', 'image', 'reference'),
                allowNull: false,
            },

            /**
             * File size in bytes
             * @type {number}
             */
            size: {
                type: DataTypes.BIGINT,
                allowNull: false,
            },

            /**
             * Unique hash of the file to prevent duplicates
             * @type {string}
             */
            file_hash: {
                type: DataTypes.STRING(128),
                allowNull: false,
                unique: true,
            },

            /**
             * ID of the account who uploaded the file
             * @type {string}
             */
            uploader_id: {
                type: DataTypes.UUID,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: "File",
            tableName: "files_tb",
            timestamps: true,
            underscored: true,
        }
    );

    return File;
}

module.exports = FileModel;