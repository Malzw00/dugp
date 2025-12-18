const { Model, DataTypes } = require("sequelize");

/**
 * @class Keyword
 * @extends Model
 * @classdesc Represents keywords associated with projects.  
 * Used for searching and categorizing projects.
 * 
 * 🔑 **Notes:**
 * - Each keyword is unique.
 * - Supports many-to-many relation with projects via ProjectKeyword.
 */
class Keyword extends Model {
    /**
     * Define associations for the Keyword model.
     * @param {object} models - All sequelize models.
     */
    static associate(models) {
        // Keyword can belong to many projects
        Keyword.belongsToMany(models.Project, {
            through: models.ProjectKeyword,
            foreignKey: 'keyword_id',
            onDelete: 'CASCADE',
            as: 'Projects'
        });
    }
}

/**
 * Initialize the Keyword model.
 *
 * @param {import("sequelize").Sequelize} sequelize - Sequelize instance.
 * @returns {typeof Keyword} Keyword model.
 */
function KeywordModel(sequelize) {
    Keyword.init(
        {
            /**
             * Primary key for the keyword
             * @type {number}
             */
            keyword_id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },

            /**
             * The keyword text
             * @type {string}
             */
            keyword: {
                type: DataTypes.STRING(64),
                allowNull: false,
                unique: 'unique_keyword',
            },
        },
        {
            sequelize,
            modelName: "Keyword",
            tableName: "keywords_tb",
            timestamps: true,
            underscored: true,
            indexes: [
                {
                    name: 'ft_keyword',
                    type: 'FULLTEXT',
                    fields: ['keyword']
                }
            ],
        }
    );

    return Keyword;
}

module.exports = KeywordModel;