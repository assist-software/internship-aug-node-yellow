const { Sequelize, DataTypes } = require('sequelize');
//const sequelize = new Sequelize('sqlite::memory:');

module.exports = (sequelize, Sequelize) => {
    const Sport = sequelize.define('sport', {

        type: {
            type: DataTypes.STRING,
            allowNull: false

        }
    });
    return Sport
}


