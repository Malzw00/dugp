const { Model, DataTypes } = require("sequelize");

/**
 * @class Category
 * @extends Model
 * @classdesc Represents categories of graduation projects.  
 * Each category belongs to a collage and can be associated with multiple projects.
 * 
 * 🔑 **Notes:**
 * - Unique constraint on `(collage_id, category_name)`.
 * - Supports relations with `Project` (many-to-many) and `Collage` (many-to-one).
 */
class Category extends Model {
    /**
     * Define associations for the Category model.
     * @param {object} models - All sequelize models.
     */
    static associate(models) {
        // Many-to-Many: Categories ↔ Projects
        Category.belongsToMany(models.Project, {
            through: models.ProjectCategory,
            foreignKey: "category_id",
            onDelete: "CASCADE",
        });

        // Many-to-One: Category ↔ Collage
        Category.belongsTo(models.Collage, {
            foreignKey: "collage_id",
            onDelete: "CASCADE",
        });
    }
}

/**
 * Initialize the Category model.
 *
 * @param {import("sequelize").Sequelize} sequelize - Sequelize instance.
 * @returns {typeof Category} Category model.
 */
function CategoryModel(sequelize) {
    Category.init(
        {
            category_id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            category_name: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },
            collage_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: "Category",
            tableName: "categories_tb",
            timestamps: true,
            underscored: true,
            indexes: [
                {
                    unique: true,
                    fields: ["collage_id", "category_name"],
                },
            ],
        }
    );

    return Category;
}

module.exports = CategoryModel;
