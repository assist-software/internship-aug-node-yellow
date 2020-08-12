const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('sqlite::memory:');
module.exports=(sequelize,Sequelize)=>{

const Event =require("./event.model.js")(sequelize, Sequelize);
const EventInvite = sequelize.define('event_invite', {
  // Model attributes are defined here
 
  email: {
    type: DataTypes.STRING,
    allowNull:false
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
console.log(EventInvite === sequelize.models.EventInvite); // true

/*
 // It is possible to create foreign keys:
  bar_id: {
    type: DataTypes.INTEGER,

    references: {
      // This is a reference to another model
      model: Bar,

      // This is the column name of the referenced model
      key: 'id',

      // With PostgreSQL, it is optionally possible to declare when to check the foreign key constraint, passing the Deferrable type.
      deferrable: Deferrable.INITIALLY_IMMEDIATE
      // Options:
      // - `Deferrable.INITIALLY_IMMEDIATE` - Immediately check the foreign key constraints
      // - `Deferrable.INITIALLY_DEFERRED` - Defer all foreign key constraint check to the end of a transaction
      // - `Deferrable.NOT` - Don't defer the checks at all (default) - This won't allow you to dynamically change the rule in a transaction
    }
  }
*/