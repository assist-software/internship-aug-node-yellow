const dbConfig = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Define all models here like this:
// db.tutorials = require("./tutorial.model.js")(sequelize, Sequelize);
db.clubMember = require("./club-member.model.js")(sequelize, Sequelize);
db.eventInvite = require("./event-invite.model.js")(sequelize, Sequelize);
db.eventRequest = require("./event-request.model.js")(sequelize, Sequelize);
db.role = require("./role.model.js")(sequelize, Sequelize);

module.exports = db;