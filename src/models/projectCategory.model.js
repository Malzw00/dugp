const { Model, DataTypes } = require("sequelize");

/**
 * @class ProjectCategory
 * @extends Model
 * @classdesc Junction table linking Projects with Categories.
 * 
 * 🔑 **Notes:**
 * - Represents a many-to-many relationship between Project and Category.
 */
class ProjectCategory extends Model {
    /**
     * Define associations for the ProjectCategory model.
     * @param {object} models - All sequelize models.
     */
    static associate(models) {
        // Associations are handled via belongsToMany in Project and Category
    }
}

/**
 * Initialize the ProjectCategory model.
 *
 * @param {import("sequelize").Sequelize} sequelize - Sequelize instance.
 * @returns {typeof ProjectCategory} ProjectCategory model.
 */
function ProjectCategoryModel(sequelize) {
    ProjectCategory.init(
        {
            /**
             * Foreign key to Project
             * @type {number}
             */
            project_id: { type: DataTypes.INTEGER, allowNull: false },

            /**
             * Foreign key to Category
             * @type {number}
             */
            category_id: { type: DataTypes.INTEGER, allowNull: false },
        },
        {
            sequelize,
            modelName: "ProjectCategory",
            tableName: "project_categories_tb",
            timestamps: true,
            underscored: true,
        }
    );

    return ProjectCategory;
}

module.exports = ProjectCategoryModel;
