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
    
    static associate(models) {
        ProjectKeyword.belongsTo(models.Project, {
            foreignKey: 'project_id',
            as: 'Project',
            onDelete: 'CASCADE'
        });
        
        ProjectKeyword.belongsTo(models.Keyword, {
            foreignKey: 'keyword_id',
            as: 'Keyword',
            onDelete: 'CASCADE'
        });
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
        }
    );

    return ProjectKeyword;
}

module.exports = ProjectKeywordModel;