const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('sqlite::memory:');

const User = require("./user.model.js")(sequelize, Sequelize);
const Event = require("./event.model.js")(sequelize, Sequelize);
const EventRequest = sequelize.define('event_request', {
  // Model attributes are defined here
  
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references:
    {
        model: User,
        key:'id'
    }
  },
  event_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references:
    {
      model: Event,
      key:'id'
    }
  }

});

// `sequelize.define` also returns the model
console.log(EventRequest === sequelize.models.EventRequest); // true