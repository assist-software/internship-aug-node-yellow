const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('sqlite::memory:');
module.exports=(sequelize,Sequelize)=>{
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
return Role;}