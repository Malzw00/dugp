const { Model, DataTypes } = require("sequelize");

/**
 * @class Project
 * @extends Model
 * @classdesc Represents a university graduation project.  
 * 
 * 🔑 **Notes:**
 * - Stores details like title, description, date, semester, grade, and availability.
 * - Links to Department, Supervisor, Files (Book, Presentation, Cover), Categories, Keywords, Students, References, Comments, Likes, Ratings, and Reports.
 */
class Project extends Model {
    /**
     * Define associations for the Project model.
     * @param {object} models - All sequelize models.
     */
    static associate(models) {
        // Many-to-Many: Project ↔ Categories
        Project.belongsToMany(models.Category, { 
            through: models.ProjectCategory, 
            foreignKey: 'project_id', 
            onDelete: 'CASCADE' 
        });

        // Many-to-Many: Project ↔ Keywords
        Project.belongsToMany(models.Keyword, { 
            through: models.ProjectKeyword, 
            foreignKey: 'project_id', 
            onDelete: 'CASCADE' 
        });

        // One-to-One: Project ↔ Book File
        Project.belongsTo(models.File, { 
            foreignKey: 'book_id', 
            as: 'Book',
        });

        // One-to-One: Project ↔ Presentation File
        Project.belongsTo(models.File, { 
            foreignKey: 'presentation_id', 
            as: 'Presentation',
        });

        // Many-to-Many: Project ↔ References
        Project.belongsToMany(models.Reference, {
            through: models.ProjectReference,
            as: 'References',
            onDelete: 'CASCADE',
            foreignKey: 'project_id',
            otherKey: 'reference_id',
            timestamps: false,
        });

        // Many-to-Many: Project ↔ Students
        Project.belongsToMany(models.Student, { 
            through: models.ProjectStudent, 
            foreignKey: 'project_id', 
            onDelete: 'CASCADE',
            timestamps: false,
        });

        // One-to-One: Project ↔ Supervisor
        Project.belongsTo(models.Supervisor, { 
            foreignKey: 'supervisor_id',
        });

        // One-to-One: Project ↔ Cover Image
        Project.belongsTo(models.File, { 
            foreignKey: 'cover_image_id', 
            as: 'Cover',
        });

        // One-to-Many: Project ↔ Comments
        Project.hasMany(models.Comment, { 
            foreignKey: 'project_id', 
            onDelete: 'CASCADE',
        });

        // One-to-Many: Project ↔ Likes
        Project.hasMany(models.ProjectLike, { 
            foreignKey: 'project_id', 
            onDelete: 'CASCADE',
        });

        // One-to-Many: Project ↔ Ratings
        Project.hasMany(models.Rating, { 
            foreignKey: 'project_id', 
            onDelete: 'CASCADE',
        });

        // One-to-Many: Project ↔ Project Reports
        Project.hasMany(models.ProjectReport, { 
            foreignKey: 'project_id', 
            onDelete: 'CASCADE',
        });

        // Project belongs to Department
        Project.belongsTo(models.Department, { 
            foreignKey: 'department_id',
        });
    }
}

/**
 * Initialize the Project model.
 *
 * @param {import("sequelize").Sequelize} sequelize - Sequelize instance.
 * @returns {typeof Project} Project model.
 */
function ProjectModel(sequelize) {
    Project.init(
        {
            /**
             * Primary key for the project
             * @type {number}
             */
            project_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },

            /**
             * Project title
             * @type {string}
             */
            project_title: { type: DataTypes.STRING(255), allowNull: false, unique: true },

            /**
             * Project description
             * @type {string}
             */
            project_description: { type: DataTypes.STRING(512), allowNull: true },

            /**
             * Project date
             * @type {string} - Date only (YYYY-MM-DD)
             */
            project_date: { type: DataTypes.DATEONLY, allowNull: false },

            /**
             * Project semester
             * @type {'Winter'|'Spring'|'Summer'|'Autumn'}
             */
            project_semester: { 
                type: DataTypes.ENUM('Winter', 'Spring', 'Summer', 'Autumn'), 
                allowNull: false 
            },

            /**
             * Project grade (0.00 - 100.00)
             * @type {number}
             */
            project_grade: { 
                type: DataTypes.DECIMAL(5, 2), 
                allowNull: true, 
                validate: { min: 0.00, max: 100.00 } 
            },

            /**
             * Foreign key to Department
             * @type {number}
             */
            department_id: { type: DataTypes.INTEGER, allowNull: false },

            /**
             * Foreign key to Cover Image File
             * @type {number|null}
             */
            cover_image_id: { type: DataTypes.INTEGER, allowNull: true, defaultValue: null },

            /**
             * Foreign key to Supervisor Account
             * @type {string|null}
             */
            supervisor_id: { type: DataTypes.UUID, allowNull: true },

            /**
             * Foreign key to Book File
             * @type {number}
             */
            book_id: { type: DataTypes.INTEGER, allowNull: false },

            /**
             * Foreign key to Presentation File
             * @type {number}
             */
            presentation_id: { type: DataTypes.INTEGER, allowNull: false },

            /**
             * Project availability status
             * @type {boolean}
             */
            available: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
        },
        {
            sequelize,
            modelName: "Project",
            tableName: "projects_tb",
            timestamps: true,
            underscored: true,
            indexes: [
                {
                    name: 'ft_project_title_description',
                    type: 'FULLTEXT',
                    fields: ['project_title', 'project_description']
                }
            ]
        }
    );

    return Project;
}

module.exports = ProjectModel;