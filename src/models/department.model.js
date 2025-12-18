const { Model, DataTypes } = require("sequelize");

/**
 * @class Department
 * @extends Model
 * @classdesc Represents academic departments within a collage.  
 * Each department can have students, projects, and supervisors.
 * 
 * 🔑 **Notes:**
 * - Each department has a unique name within its collage.
 * - Supports relations with Collage, Students, Projects, and Supervisors.
 */
class Department extends Model {
    /**
     * Define associations for the Department model.
     * @param {object} models - All sequelize models.
     */
    static associate(models) {
        // Department belongs to a collage
        Department.belongsTo(models.Collage, { foreignKey: 'collage_id', as: 'Collage' });

        // Department has many students
        Department.hasMany(models.Student, { foreignKey: 'department_id', onDelete: 'CASCADE' });

        // Department has many projects
        Department.hasMany(models.Project, { foreignKey: 'department_id', onDelete: 'CASCADE' });

        // Department has many supervisors
        Department.hasMany(models.Supervisor, { foreignKey: 'department_id', onDelete: 'CASCADE' });
    }
}

/**
 * Initialize the Department model.
 *
 * @param {import("sequelize").Sequelize} sequelize - Sequelize instance.
 * @returns {typeof Department} Department model.
 */
function DepartmentModel(sequelize) {
    Department.init(
        {
            /**
             * Primary key for the department
             * @type {number}
             */
            department_id: { 
                type: DataTypes.INTEGER, 
                autoIncrement: true, 
                primaryKey: true 
            },

            /**
             * Name of the department
             * @type {string}
             */
            department_name: { 
                type: DataTypes.STRING(255), 
                allowNull: false 
            },

            /**
             * ID of the collage to which the department belongs
             * @type {number}
             */
            collage_id: { 
                type: DataTypes.INTEGER, 
                allowNull: false 
            },
        },
        {
            sequelize,
            modelName: "Department",
            tableName: "departments_tb",
            timestamps: true,
            underscored: true,
            indexes: [
                { 
                    name: 'unique_collageid_department_name', 
                    unique: true, 
                    fields: ['collage_id', 'department_name'] 
                }
            ],
        }
    );

    return Department;
}

module.exports = DepartmentModel;