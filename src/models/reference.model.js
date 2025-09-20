const { DataTypes, Model } = require("sequelize");

/**
 * @class Reference
 * @extends Model
 * @classdesc Represents a reference (e.g., book, article, or link) that can be associated with projects.
 * 
 * 🔑 **Notes:**
 * - Can be linked to multiple projects through ProjectReference.
 */
class Reference extends Model {
    /**
     * Define associations for the Reference model.
     * @param {object} models - All sequelize models.
     */
    static associate(models) {
        // Reference belongs to many Projects through ProjectReference
        Reference.belongsToMany(models.Project, {
            through: models.ProjectReference,
            as: 'Projects',
            onDelete: 'CASCADE',
            foreignKey: 'reference_id',
            otherKey: 'project_id',
            timestamps: false,
        });
    }
}

/**
 * Initialize the Reference model.
 *
 * @param {import("sequelize").Sequelize} sequelize - Sequelize instance.
 * @returns {typeof Reference} Reference model.
 */
function ReferenceModel(sequelize) {
    Reference.init(
        {
            /**
             * Primary key for the reference
             * @type {number}
             */
            reference_id: {
                type: DataTypes.INTEGER, 
                autoIncrement: true,
                primaryKey: true,
            },

            /**
             * Title of the reference
             * @type {string}
             */
            reference_title: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },

            /**
             * Author of the reference
             * @type {string|null}
             */
            reference_author: {
                type: DataTypes.STRING(150),
                allowNull: true,
            },

            /**
             * URL or link to the reference
             * @type {string|null}
             */
            reference_link: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
        },
        {
            sequelize,
            modelName: "Reference",
            tableName: "references_tb",
            timestamps: true,
            underscored: true,
        }
    );

    return Reference;
}

module.exports = ReferenceModel;