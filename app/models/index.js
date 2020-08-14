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
db.club = require("./club.model.js")(sequelize, Sequelize);
db.event = require("./event.model.js")(sequelize, Sequelize);
db.clubInvite = require("./club-invite.model.js")(sequelize, Sequelize);
db.clubRequest = require("./club-request.model.js")(sequelize, Sequelize);
db.user = require("./user.model.js")(sequelize, Sequelize);
db.sport = require("./sport.model.js")(sequelize, Sequelize);
db.clubMember = require("./club-member.model.js")(sequelize, Sequelize);
db.eventInvite = require("./event-invite.model.js")(sequelize, Sequelize);
db.eventRequest = require("./event-request.model.js")(sequelize, Sequelize);
db.role = require("./role.model.js")(sequelize, Sequelize);
db.workout = require("./workout.model.js")(sequelize, Sequelize);
db.eventMember = require("./event-member.model.js")(sequelize, Sequelize);

db.role.belongsToMany(db.user, {
  through: "user_roles",
  foreignKey: "roleId",
  otherKey: "userId"
});
db.user.belongsToMany(db.role, {
  through: "user_roles",
  foreignKey: "userId",
  otherKey: "roleId"
});

module.exports = db;