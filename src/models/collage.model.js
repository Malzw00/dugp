const { DataTypes } = require("sequelize");


/**
 * 
 * @param {import('sequelize').Sequelize} sequelize 
 */
module.exports = function (sequelize) {

    const Collage = sequelize.define('Collage', {
        collage_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        collage_name: { type: DataTypes.STRING(255), allowNull: false, unique: true }
    }, {
        tableName: 'collages_tb',
        timestamps: true,
        underscored: true,
    });

    Collage.associate = function(models) {
        Collage.hasMany(models.Department, { foreignKey: 'collage_id', onDelete: 'RESTRICT' });
        Collage.hasMany(models.Category, { foreignKey: 'collage_id', onDelete: 'CASCADE' });
        Collage.hasMany(models.PermissionScope, { foreignKey: 'collage_id', onDelete: 'CASCADE' });
    }

    return Collage;
}