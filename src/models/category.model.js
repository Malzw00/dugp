const { DataTypes } = require("sequelize");


/**
 * 
 * @param {import('sequelize').Sequelize} sequelize 
 */
module.exports = function (sequelize) {

    const Category = sequelize.define('Category', {
        category_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true, },
        category_name: { type: DataTypes.STRING(255), allowNull: false },
        collage_id: { type: DataTypes.INTEGER, allowNull: false }
    }, {
        tableName: 'categories_tb',
        timestamps: true,
        underscored: true,
        indexes: [{
            unique: true,
            fields: ['collage_id', 'category_name'] // تركيبة فريدة
        }]
    });

    Category.associate = function (models) {
        
        Category.belongsToMany(models.Project, { 
            through: models.ProjectCategory, 
            foreignKey: 'category_id',
            onDelete: 'CASCADE',
        });

        Category.belongsTo(models.Collage, {
            foreignKey: 'collage_id',
        });
    }

    return Category;
}