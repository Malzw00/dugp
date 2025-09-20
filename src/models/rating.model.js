const { DataTypes, Model } = require("sequelize");

/**
 * @class Rating
 * @extends Model
 * @classdesc Represents a rating given by an account to a project.
 * 
 * 🔑 **Notes:**
 * - Each account can rate a project only once.
 * - Rate value is between 1 and 5.
 */
class Rating extends Model {
    /**
     * Define associations for the Rating model.
     * @param {object} models - All sequelize models.
     */
    static associate(models) {
        // Rating belongs to an Account
        Rating.belongsTo(models.Account, { foreignKey: 'account_id' });

        // Rating belongs to a Project
        Rating.belongsTo(models.Project, { foreignKey: 'project_id' });
    }
}

/**
 * Initialize the Rating model.
 *
 * @param {import("sequelize").Sequelize} sequelize - Sequelize instance.
 * @returns {typeof Rating} Rating model.
 */
function RatingModel(sequelize) {
    Rating.init(
        {
            /**
             * Primary key for the rating
             * @type {number}
             */
            rate_id: { 
                type: DataTypes.INTEGER, 
                primaryKey: true, 
                autoIncrement: true 
            },

            /**
             * Foreign key to the Project
             * @type {number}
             */
            project_id: { 
                type: DataTypes.INTEGER, 
                allowNull: false,
            },

            /**
             * Foreign key to the Account
             * @type {string} UUID
             */
            account_id: { 
                type: DataTypes.UUID, 
                allowNull: false,
            },

            /**
             * Rating value (1 to 5)
             * @type {number}
             */
            rate: { 
                type: DataTypes.INTEGER, 
                allowNull: false, 
                validate: { min: 1, max: 5 } 
            },
        },
        {
            sequelize,
            modelName: 'Rating',
            tableName: 'ratings_tb',
            timestamps: true,
            underscored: true,
            indexes: [
                { unique: true, fields: ['project_id', 'account_id'] }
            ]
        }
    );

    return Rating;
}

module.exports = RatingModel;