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
console.log(authJwt.role_id);
if(!regex.test(req.body.email)){
return res.status(400).send({ message: "Invalid email" });
}
/*const authRoleId = req.authJwt.user_id;
if((authRoleId == 3 || authRoleId == 2) && (req.body.role_id != 3))
{
  return res.status(403).send({ message: "Permission denied !" });
}*/
  const isAdmin = req.role_id === 1;
  const newUser = {
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
    role_id: isAdmin ? req.body.role_id : 3
  }
  // Save User to Database
  User.create(newUser)
    .then(user => {
      //console.log("Aici ==>"+req.body.roles);
      if (req.body.roles) {
        Role.findAll({
          where: {
            name : {//
              [Op.or]: req.body.roles
            }

          }
        }).then(roles => {
          // console.log(roles);
          user.setRoles(roles).then(() => {
            res.send({ message: "User was registered successfully!" });
          });
        });
      } else {
        // user role = 1
        user.setRoles([3]).then(() => {
          res.send({ message: "User was registered successfully!" });
        });
      }
    })
    .catch(err => {
      res.status(500).send({ message: err.message + " Aici"});
    });
};

exports.login = (req, res) => {
  User.findOne({
    where: {
     // username: req.body.username
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
          email: user.email,
          roles: user.role_id,
          accessToken: token
        });
      });
    
};
