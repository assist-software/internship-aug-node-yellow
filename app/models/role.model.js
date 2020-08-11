const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('sqlite::memory:');

const Role = sequelize.define('role', {
  // Model attributes are defined here
  /*role_id: {
    type: DataTypes.INTEGER, 
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },*/
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  isAdmin: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  }

});

// `sequelize.define` also returns the model
console.log(Role === sequelize.models.Role); // true

/*Role.sync().then(() => {
    Role.create({
      name: 'Admin',
      isAdmin: true
    });
    Role.create({
        name: 'Athlete',
        isAdmin: false
      });
      Role.create({
        name: 'Coach',
        isAdmin: false
      });
  });
  */