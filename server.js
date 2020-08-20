const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
//const db = require("./app/models");
const db = require("./app/models/index");
var bcrypt = require("bcryptjs");
//const User = db.user;
//const Sport = db.sport;
//const Role = db.role;
const app = express();

const corsOptions = {
  origin: "http://localhost:3000"
  //origin: "http://278ebb25ae31.ngrok.io"
  //optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));
// parse requests of content-type - application/json
app.use(bodyParser.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
// if you need to drop the existing table and resync database use {force: true}
db.sequelize.sync({ force: true });
//db.sequelize.sync(); 

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
/*
////////////////////////////////

const User = db.sequelize.define('user', {
  email: { type: db.Sequelize.STRING },
  password: { type: db.Sequelize.STRING },
  role_id: { type: db.Sequelize.INTEGER }

});
User.sync().then(() => {
  User.create({
    email: 'andrei.seby45@yahoo.com',
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
    type: 'Running',
  });

  Sport.create({
    type: 'Cycling',
  });

  Sport.create({
    type: 'Tennis',
  });
  Sport.create({
    type: 'Football',
  });
});
/*
//////////////////////////
const Club = db.sequelize.define('club', {
  name: { type: db.Sequelize.STRING },
  owner_id: { type: db.Sequelize.INTEGER }

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
///////////////////////////////////////////

const Event = db.sequelize.define("event", {
  name: { type: db.Sequelize.STRING },
  date: { type: db.Sequelize.DATE },
  time: { type: db.Sequelize.TIME },
  description: { type: db.Sequelize.TEXT },
  location: { type: db.Sequelize.STRING },
  club_id: { type: db.Sequelize.INTEGER },
  radius: { type: db.Sequelize.INTEGER },
  sport_type_id:{type: db.Sequelize.INTEGER},
  event_cover: {type: db.Sequelize.BLOB}
});

Event.sync().then(()=>{
  Event.create({
    name:'First event',
    date:'2015-03-25',
    time:'00:00:00',
    description:'stai acasa',
    location:'la tine acasa',
    club_id:2,
    radius:3,
    sport_type_id:1,
    event_cover:0
  });
});

/*
const ClubInvite = db.sequelize.define("clubInvite", {
  email: { type: db.Sequelize.STRING },
  club_id: { type: db.Sequelize.INTEGER }
  
});

ClubInvite.sync().then(()=>{
  ClubInvite.create({
    email:'test1@test.com',
    club_id:2
  });
});*/
// const User = db.sequelize.define('user', {
//   first_name:{type: db.Sequelize.STRING},
//   last_name:{type: db.Sequelize.STRING},
//   email: { type: db.Sequelize.STRING },
//   password: { type: db.Sequelize.STRING },
//   role_id: { type: db.Sequelize.INTEGER },
//   gender:{type: db.Sequelize.STRING},
  
//  });
//  User.sync().then(() => {
//   User.create({
//   first_name:"Admin",
//   last_name:"Yellow",
//   email: 'admin@test.com',
//   password: bcrypt.hashSync('asd123', 8),
//   role_id: 1,
//   gender:"male",
//   primary_sport_id: null,
//   secondary_sport_id: null,
//   height:null,
//   weight:null,
//   age: null,
//   profile_photo: null

  
  
//   });
//   User.create({
//   first_name:"Coach",
//   last_name:"Yellow",
//   email: 'coach@test.com',
//   password: bcrypt.hashSync('asd123', 8),
//   role_id: 2,
//   gender:"male",
//   primary_sport_id: null,
//   secondary_sport_id: null,
//   height:null,
//   weight:null,
//   age: null,
//   profile_photo: null
  
//   });
//  });
// simple route
app.get("/", (req, res) => {
  res.json({ message: "Hello world!" });
});

require('./app/routes/auth.routes.js')(app);

require("./app/routes/club.routes.js")(app);
require("./app/routes/club-invite.routes.js")(app);
require("./app/routes/club-member.routes.js")(app);
require("./app/routes/club-request.routes.js")(app);
require("./app/routes/event-request.routes.js")(app);
require("./app/routes/event-member.routes.js")(app);
require("./app/routes/event.routes.js")(app);
require("./app/routes/event-invite.routes.js")(app);
require("./app/routes/workout.routes.js")(app);
require("./app/routes/user.routes.js")(app);


// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Yellow team server is running on port ${PORT}.`);
});
