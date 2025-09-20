const { Model, DataTypes } = require("sequelize");

/**
 * @class Collage
 * @extends Model
 * @classdesc Represents a university collage.  
 * Each collage can have multiple departments, categories, and permission scopes.
 * 
 * 🔑 **Notes:**
 * - `collage_name` is unique across all collages.
 * - Relations:
 *   - One-to-Many with Department (onDelete: RESTRICT)
 *   - One-to-Many with Category (onDelete: CASCADE)
 *   - One-to-Many with PermissionScope (onDelete: CASCADE)
 */
class Collage extends Model {
    /**
     * Define associations for the Collage model.
     * @param {object} models - All sequelize models.
     */
    static associate(models) {
        // One-to-Many: Collage ↔ Departments
        Collage.hasMany(models.Department, { 
            foreignKey: 'collage_id', 
            onDelete: 'RESTRICT' 
        });

        // One-to-Many: Collage ↔ Categories
        Collage.hasMany(models.Category, { 
            foreignKey: 'collage_id', 
            onDelete: 'CASCADE' 
        });

        // One-to-Many: Collage ↔ PermissionScopes
        Collage.hasMany(models.PermissionScope, { 
            foreignKey: 'collage_id', 
            onDelete: 'CASCADE' 
        });
    }
}

/**
 * Initialize the Collage model.
 *
 * @param {import("sequelize").Sequelize} sequelize - Sequelize instance.
 * @returns {typeof Collage} Collage model.
 */
function CollageModel(sequelize) {
    Collage.init(
        {
            /**
             * Primary key for Collage
             * @type {number}
             */
            collage_id: { 
                type: DataTypes.INTEGER, 
                autoIncrement: true, 
                primaryKey: true 
            },
            /**
             * Collage Name
             * @type {string}
             */
            collage_name: { 
                type: DataTypes.STRING(255), 
                allowNull: false, 
                unique: true 
            },
        },
        {
            sequelize,
            modelName: "Collage",
            tableName: "collages_tb",
            timestamps: true,
            underscored: true,
        }
    );

    return Collage;
}

module.exports = CollageModel;