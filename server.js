const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("./app/models");

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
db.sequelize.sync({ force: true });
//db.sequelize.sync();

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Hello world!" });
});

require("./app/routes/club-member.routes.js")(app);
require("./app/routes/club-request.routes.js")(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Yellow team server is running on port ${PORT}.`);
});