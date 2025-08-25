const { DataTypes } = require("sequelize");


/**
 * 
 * @param {import('sequelize').Sequelize} sequelize 
 */
module.exports = function (sequelize) {

    const Rating = sequelize.define('Rating', {
        project_id: { 
            type: DataTypes.INTEGER, 
            allowNull: false,
        },
        account_id: { 
            type: DataTypes.INTEGER, 
            allowNull: false,
        },
        rate: { type: DataTypes.INTEGER, allowNull: false, validate: { min: 1, max: 5 } },
    }, {
        tableName: 'ratings_tb',
        timestamps: true,
        underscored: true,
        indexes: [
            { unique: true, fields: ['project_id', 'account_id'] }
        ]
    });

    Rating.associate = function(models) {
        Rating.belongsTo(models.Account, { foreignKey: 'account_id' });
        Rating.belongsTo(models.Project, { foreignKey: 'project_id' });
    }

    return Rating;
}