const dbConfig = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: 0,

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
db.user = require("./user.model.js")(sequelize, Sequelize);

db.sport = require("./sport.model.js")(sequelize, Sequelize);
db.role = require("./role.model.js")(sequelize, Sequelize);

//db.workout = require("./workout.model.js")(sequelize, Sequelize);
//db.club = require("./club.model.js")(sequelize, Sequelize);

module.exports = db;