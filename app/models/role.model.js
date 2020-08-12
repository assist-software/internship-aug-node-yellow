const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('sqlite::memory:');

const Role = sequelize.define('role', {
   
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  isAdmin: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  }
});
module.exports= (sequelize, Sequelize) => {

  return Role
}