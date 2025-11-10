const { DataTypes, Model } = require("sequelize");

/**
 * @class ProjectReference
 * @extends Model
 * @classdesc Represents the association between a Project and a Reference (File).
 * 
 * 🔑 **Notes:**
 * - Ensures uniqueness of each (reference_id, project_id) pair.
 * - Serves as a junction table linking Projects and References.
 */
class ProjectReference extends Model {
    /**
     * Define associations for the ProjectReference model.
     * @param {object} models - All sequelize models.
     */
    static associate(models) {
        // Example associations (can be uncommented if needed):
        ProjectReference.belongsTo(models.Project, { foreignKey: 'project_id', onDelete: 'CASCADE' });
        ProjectReference.belongsTo(models.Reference, { foreignKey: 'reference_id', onDelete: 'CASCADE' });
    }
}

/**
 * Initialize the ProjectReference model.
 *
 * @param {import("sequelize").Sequelize} sequelize - Sequelize instance.
 * @returns {typeof ProjectReference} ProjectReference model.
 */
function ProjectReferenceModel(sequelize) {
    ProjectReference.init(
        {
            /**
             * Primary key for the ProjectReference
             * @type {number}
             */
            project_reference_id: { 
                type: DataTypes.INTEGER, 
                autoIncrement: true, 
                primaryKey: true, 
            },

            /**
             * Foreign key to Reference (File)
             * @type {number}
             */
            reference_id: { 
                type: DataTypes.INTEGER, 
                allowNull: false,
            },

            /**
             * Foreign key to Project
             * @type {number}
             */
            project_id: { 
                type: DataTypes.INTEGER, 
                allowNull: false,
            },
        }, 
        {
            sequelize,
            modelName: 'ProjectReference',
            tableName: 'project_references_tb',
            timestamps: true,
            underscored: true,
            indexes: [
                {
                    unique: true,
                    fields: ['reference_id', 'project_id']
                }
            ]
        }
    );

    return ProjectReference;
}

module.exports = ProjectReferenceModel;