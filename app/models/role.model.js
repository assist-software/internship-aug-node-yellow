const { Sequelize, DataTypes } = require('sequelize');
module.exports= (sequelize, Sequelize) => {
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
  return Role;
}