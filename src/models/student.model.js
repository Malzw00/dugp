const { DataTypes } = require("sequelize");


/**
 * 
 * @param {import('sequelize').Sequelize} sequelize 
 */
module.exports = function (sequelize) {

    const Student = sequelize.define('Student', {
        student_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true, },
        student_name: { type: DataTypes.STRING(50), allowNull: false },
        student_father_name: { type: DataTypes.STRING(50), allowNull: false },
        student_grandfather_name: { type: DataTypes.STRING(50), allowNull: false },
        student_family_name: { type: DataTypes.STRING(50), allowNull: false },
        student_full_name: { type: DataTypes.STRING(200), allowNull: false },
        student_email: { type: DataTypes.STRING(255), allowNull: false },
        department_id: { 
            type: DataTypes.INTEGER, 
            allowNull: false,
        },
        account_id: { 
            type: DataTypes.INTEGER, 
            allowNull: true, 
            defaultValue: null,
        },
        profile_image_id: { 
            type: DataTypes.INTEGER, 
            allowNull: true, 
            defaultValue: null,
        },
    }, {
        tableName: 'students_tb',
        timestamps: true,
        underscored: true,
    });

    Student.beforeSave((student, options) => {
        student.full_name = [
            student.student_name,
            student.student_father_name,
            student.student_grandfather_name,
            student.student_family_name
        ].filter(Boolean).join(' ');
    });


    Student.associate = function(models) {

        Student.belongsTo(models.Department, { foreignKey: 'department_id' });
        Student.belongsTo(models.Image, { foreignKey: 'profile_image_id' });
        Student.belongsTo(models.Account, { foreignKey: 'account_id' });
        Student.belongsToMany(models.Project, { 
            through: models.ProjectStudent, 
            foreignKey: 'student_id', 
            onDelete: 'CASCADE'
        });
    }

    return Student;
}