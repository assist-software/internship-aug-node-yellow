const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
//const db = require("./app/models");
const db = require("./app/models/index");


const app = express();

const corsOptions = {
  origin: "http://localhost:8081"
};

app.use(cors(corsOptions));
// parse requests of content-type - application/json
app.use(bodyParser.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
// if you need to drop the existing table and resync database use {force: true}
//db.sequelize.sync({ force: true });
db.sequelize.sync(); 

const Role = db.sequelize.define('role', {
  name: { type: db.Sequelize.STRING },
  isAdmin: { type: db.Sequelize.BOOLEAN }
});
Role.sync().then(() => {
  Role.create({
    name: 'Admin',
    isAdmin: true
  });
  Role.create({
    name: 'Coach',
    isAdmin: false
  });
  Role.create({
    name: 'Athlete',
    isAdmin: false
  });
});
////////////////////////////////

const User = db.sequelize.define('user', {
  email: { type: db.Sequelize.STRING },
  password: { type: db.Sequelize.STRING },
  role_id: { type: db.Sequelize.INTEGER }

});
User.sync().then(() => {
  User.create({
    email: 'test1@test.com',
    password: 'true',
    role_id: 1
  });
  User.create({
    email: 'test2@test.com',
    password: 'asd',
    role_id: 2
  });
  User.create({
    email: 'test3@test.com',
    password: '123',
    role_id: 3
  });
});
/////////////////////////////
const Sport = db.sequelize.define('sport', {
  type: { type: db.Sequelize.STRING }
});
Sport.sync().then(() => {
  Sport.create({
    type: 'fotbal american',
  });
  
    Sport.create({
      type: 'fotbal feminin',
    });

      Sport.create({
        type: 'fotbal masculin',
      });
    });
    //////////////////////////
    const Club = db.sequelize.define('club', {
      name: {type: db.Sequelize.STRING},
      owner_id: {type: db.Sequelize.INTEGER}
    
    });
    Club.sync().then(() => {
      Club.create(
        {
        name: 'forta',
        owner_id: 2
      });
      Club.create({
        name: 'lavie',
        owner_id: 1
      });
    });
    // simple route
    app.get("/", (req, res) => {
      res.json({ message: "Hello world!" });
    });

    require('./app/routes/auth.routes.js')(app);

require("./app/routes/club-member.routes.js")(app);
require("./app/routes/club-request.routes.js")(app);
require("./app/routes/club.routes.js")(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Yellow team server is running on port ${PORT}.`);
});
