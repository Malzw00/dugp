const { Model, DataTypes } = require("sequelize");

/**
 * @class ProjectKeyword
 * @extends Model
 * @classdesc Junction table linking Projects with Keywords.
 * 
 * 🔑 **Notes:**
 * - Represents a many-to-many relationship between Project and Keyword.
 * - Ensures uniqueness of each (keyword_id, project_id) pair.
 */
class ProjectKeyword extends Model {
    /**
     * Define associations for the ProjectKeyword model.
     * @param {object} models - All sequelize models.
     */
    static associate(models) {
        // Associations are handled via belongsToMany in Project and Keyword
    }
}

/**
 * Initialize the ProjectKeyword model.
 *
 * @param {import("sequelize").Sequelize} sequelize - Sequelize instance.
 * @returns {typeof ProjectKeyword} ProjectKeyword model.
 */
function ProjectKeywordModel(sequelize) {
    ProjectKeyword.init(
        {
            /**
             * Foreign key to Keyword
             * @type {number}
             */
            keyword_id: { type: DataTypes.INTEGER, allowNull: false },

            /**
             * Foreign key to Project
             * @type {number}
             */
            project_id: { type: DataTypes.INTEGER, allowNull: false },
        },
        {
            sequelize,
            modelName: "ProjectKeyword",
            tableName: "project_keywords_tb",
            timestamps: true,
            underscored: true,
            indexes: [
                { fields: ['keyword_id', 'project_id'], unique: true }
            ]
        }
    );

    return ProjectKeyword;
}

module.exports = ProjectKeywordModel;