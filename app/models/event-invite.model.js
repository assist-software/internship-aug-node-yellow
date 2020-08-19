const { Sequelize, DataTypes } = require('sequelize');
module.exports = (sequelize, Sequelize) => {
  const Event = require("./event.model.js")(sequelize, Sequelize);
  const EventInvite = sequelize.define('event_invite', {
    // Model attributes are defined here

    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    event_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references:
      {
        model: Event,
        key: 'id'
      }
    }
  });
  return EventInvite;
}