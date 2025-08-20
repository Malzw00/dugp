const { DataTypes } = require("sequelize");


/** @param {import('sequelize').Sequelize} sequelize */
module.exports = function (sequelize) {

    const Keyword = sequelize.define('Keyword', {
        keyword_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true, },
        keyword: { type: DataTypes.STRING(64), allowNull: false, unique: true },
    }, {
        tableName: 'keywords_tb',
        timestamps: true,
        underscored: true,
    });

    Keyword.associate = function (models) {
        Keyword.belongsToMany(models.Project, { 
            through: models.ProjectKeyword, 
            foreignKey: 'keyword_id',
            onDelete: 'CASCADE',
        });
    }

    return Keyword;
}