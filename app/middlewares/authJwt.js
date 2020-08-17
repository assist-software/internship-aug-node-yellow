const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const User = db.user;
let userId ;
const authJwt = {
  verifyToken: null,
  role_id: null
};
authJwt.verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({
      message: "No token provided!"
    });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "Unauthorized!"
      });
    }
    userId = decoded.id;
    next();
  });



  User.findByPk(userId).then(user=>{
    authJwt.role_id = user.role_id;
  }
  ).catch(err=>{
    return res.status(500).send({message: err.message });
  });
};
module.exports = authJwt;