const db = require("../models");
const config = require("../config/auth.config");
const authJwt = require("../middlewares/authJwt");

const User = db.user;
const Role = db.role;
const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.register = (req, res) => {
 
  var regex = /^[^\s@]+@[^\s@]+.[^\s@]+$/;
//console.log(authJwt.role_id);
if(!regex.test(req.body.email)){
return res.status(400).send({ message: "Invalid email" });
}
/*const authRoleId = req.authJwt.user_id;
if((authRoleId == 3 || authRoleId == 2) && (req.body.role_id != 3))
{
  return res.status(403).send({ message: "Permission denied !" });
}*/
let f_name = req.body.first_name;
let l_name = req.body.last_name;
let _email = req.body.email;
let _password = req.body.password;
let _confirm_password = req.body.confirm_password;
  const isAdmin = req.role_id === 1;

  function hasNumbers(t) {
    var regex = /\d/g;
    return regex.test(t);
  }

  if (f_name != null && (hasNumbers(f_name) || f_name.length < 3))//|| f_name.trim().length != f_name.length)
  {
    return res.status(400).send({ message: "Invalid first name." });
  }

  if (l_name != null && (hasNumbers(l_name) || l_name.length < 3)) {
    return res.status(400).send({ message: "Invalid last name." });
  }
  if (_password == null) {
    return res.status(404).send({ message: "Password not found." });
  }
  if (_confirm_password == null) {
    return res.status(404).send({ message: "Password not found." });
  }
  if (_confirm_password != _password) {
    return res.status(406).send({ message: "Password not acceptable." });

  }
  User.findOne({
    where: {
      email: _email
    }
  }).then(user => {
    if (user) {
      res.status(400).send({
        message: "Failed! Email is already in use!"
      }
      );
      return;
    }
    else {
  const newUser = {
    first_name: f_name,
    last_name: l_name,
    email: _email,
    password: bcrypt.hashSync(_password, 8),
    confirm_password: bcrypt.hashSync(_confirm_password, 8),
    role_id: isAdmin ? req.body.role_id : 3,
    profile_photo:10011101100100
  }
  // Save User to Database
  User.create(newUser)
    .then(data => {
      res.status(200).send(data);
    })
    .catch(err => {
      res.status(500).send({ message: err.message});
    });
  }

});


}
// Blob.toString();
exports.login = (req, res) => {
  User.findOne({
    where: {
     email: req.body.email
    }
  })
    .then(user => {
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );
      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!"
        });
      }

      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 86400 // 24 hours
      });
        res.status(200).send({
          id: user.id,
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          role_id: user.role_id,
          gender: user.gender,
          primarySport: user.primary_sport_id,
          secondarySport: user.secondary_sport_id,
          height: user.height,
          weight:user.weight,
          age: user.age,
          profile_photo: user.profile_photo,
          accessToken: token
          

        });
      });
    
};
