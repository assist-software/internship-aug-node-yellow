const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('sqlite::memory:');

const Sport = sequelize.define('sport', {
  
    type: {
        type: DataTypes.STRING,
        allowNull: false

    }
});

module.exports= (sequelize, Sequelize) => {
    return Sport
  }


