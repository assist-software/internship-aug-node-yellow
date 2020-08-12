const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('sqlite::memory:');

const User = require("./user.model.js")(sequelize, Sequelize);
const Club = require("./club.model.js")(sequelize, Sequelize);

const ClubMember = sequelize.define('club_member', {
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
  club_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references:
    {
      model: Club,
      key:'id'
    }
  }

});

// `sequelize.define` also returns the model
console.log(ClubMember === sequelize.models.ClubMember); // true