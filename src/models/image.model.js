const { DataTypes } = require('sequelize');

/**
 * 
 * @param {import('sequelize').Sequelize} sequelize 
 */
module.exports = function (sequelize) {

    const Image = sequelize.define('Image', {
        image_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        image_path: { type: DataTypes.TEXT, allowNull: false },
    }, {
        tableName: 'images_tb',
        timestamps: true,
        underscored: true,
    });

    return Image;
}