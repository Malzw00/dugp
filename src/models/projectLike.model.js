const { Model, DataTypes } = require("sequelize");

/**
 * @class ProjectLike
 * @extends Model
 * @classdesc Represents a like made by an Account on a Project.
 * 
 * 🔑 **Notes:**
 * - Ensures uniqueness of each (account_id, project_id) pair.
 * - Supports many-to-one relations to Account and Project.
 */
class ProjectLike extends Model {
    /**
     * Define associations for the ProjectLike model.
     * @param {object} models - All sequelize models.
     */
    static associate(models) {
        ProjectLike.belongsTo(models.Account, { foreignKey: 'account_id' });
        ProjectLike.belongsTo(models.Project, { foreignKey: 'project_id' });
    }
}

/**
 * Initialize the ProjectLike model.
 *
 * @param {import("sequelize").Sequelize} sequelize - Sequelize instance.
 * @returns {typeof ProjectLike} ProjectLike model.
 */
function ProjectLikeModel(sequelize) {
    ProjectLike.init(
        {
            /**
             * Primary key for the ProjectLike
             * @type {number}
             */
            project_like_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },

            /**
             * Foreign key to Account
             * @type {string}
             */
            account_id: { type: DataTypes.UUID, allowNull: false },

            /**
             * Foreign key to Project
             * @type {number}
             */
            project_id: { type: DataTypes.INTEGER, allowNull: false },
        },
        {
            sequelize,
            modelName: "ProjectLike",
            tableName: "project_likes_tb",
            timestamps: true,
            underscored: true,
            indexes: [
                { unique: 'unique_accountid_projectid', fields: ['account_id', 'project_id'] }
            ]
        }
    );

    return ProjectLike;
}

module.exports = ProjectLikeModel;