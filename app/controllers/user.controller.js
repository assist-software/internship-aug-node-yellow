const db = require("../models");
const controller = require("../middlewares/verifySignUp");
const { verifySignUp } = require("../middlewares");
const User = db.user;
const Sport = db.sport;
const Club = db.club;
const Promise = require("promise");
const { async, timeout } = require("q");
const { response } = require("express");
const { reject } = require("promise");
const await = require('await-promises');
const { request } = require("http");
const mail = require("../utils/email.utils.js");
var bcrypt = require("bcryptjs");
const regexPassword = /^[^\s@]+@[^\s@]+.[^\s@]+$/;

function hasNumbers(t) {
  var regex = /\d/g;
  return regex.test(t);
}

//generate a random password
function generatePassword() {
  var length = 8,
    charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
    retVal = "";
  for (var i = 0, n = charset.length; i < length; ++i) {
    retVal += charset.charAt(Math.floor(Math.random() * n));
  }
  return retVal;
}

exports.create = (req, res) => {
  let f_name = req.body.first_name;
  let l_name = req.body.last_name;
  let _gender = req.body.gender;
  let p_Sport = req.body.primarySport;
  let s_Sport = req.body.secondarySport;
  let _height = req.body.height;
  let _weight = req.body.weight;
  let password = req.body.password;
  let confirm_password = req.body.confirm_password;
  let p_photo = req.body.profile_photo;
  let _age = req.body.age;
  let primary_sport_id;
  let secondary_sport_id;
  if (f_name != null && (hasNumbers(f_name) || f_name.length < 3)) {
    return res.status(400).send({ message: "Invalid first name." });
  }
  if (l_name != null && (hasNumbers(l_name) || l_name.length < 3)) {
    return res.status(400).send({ message: "Invalid last name." });
  }
  if (_gender != null && (!(_gender === "male" || _gender === "female"))) {
    return res.status(400).send({ message: "Invalid gender." });
  }
  if (password == null) {
    return res.status(404).send({ message: "Password not found." });
  }
  if (confirm_password == null) {
    return res.status(404).send({ message: "Password not found." });
  }
  if (confirm_password != password) {
    return res.status(406).send({ message: "Password not acceptable." });
  }
  if (p_Sport != null) {
    Sport.findOne({
      where: {
        type: p_Sport
      }
    })
      .then(data => {
        if (data == null) {
          return res.status(404).send({
            message: "sportType not found."
          });
        } else {
          primary_sport_id = data.id;
        }
      })
      .catch(err => {
        return res.status(500).send({ message: err.message });
      });
  }
  if (s_Sport != null) {
    Sport.findOne({
      where: {
        type: s_Sport
      }
    })
      .then(data => {
        if (data == null) {
          return res.status(404).send({
            message: "sportType not found."
          });
        } else {
          secondary_sport_id = data.id;
        }
      })
      .catch(err => {
        return res.status(500).send({ message: err.message });
      });
  }
  if (_height != null && (isNaN(_height) || _height < 50 || _height > 300)) {
    return res.status(400).send({ message: "Invalid height." });
  }
  if (_weight != null && (isNaN(_weight) || _weight < 30 || _weight > 100)) {
    return res.status(400).send({ message: "Invalid weight." });
  }
  if (_age != null && (isNaN(_age) || _age < 5 || _age > 100)) {
    return res.status(400).send({ message: "Invalid age." });
  }
  if (p_photo != null && p_photo.type != "image/png" && p_photo.type != "image/jpg") {
    return res.status(400).send({ message: "Invalid image." });
  }
  User.findOne({
    where: {
      email: req.body.email
    }
  }).then(user => {
    if (user) {
      res.status(400).send({ message: "Failed! Email is already in use!" });
      return;
    }
    else {
      const user = {
        first_name: f_name,
        last_name: l_name,
        email: req.body.email,
        password: req.body.password,
        confirm_password: req.body.confirm_password,
        role_id: req.body.role,
        gender: _gender,
        primary_sport_id: primary_sport_id,
        secondary_sport_id: secondary_sport_id,
        height: _height,
        weight: _weight,
        age: _age,
        profile_photo: req.body.profile_photo
      };
      User.create(user)
        .then(data => {
          return res.status(200).send(data);
        })
        .catch(err => {
          return res.status(500).send({ message: err.message });
        });
    }
  });
}

exports.get = (req, res) => {
  if (req.authJwt == null) {
    return res.status(403).send({ message: "Permission denied. gsdfs" });
  } else {
    User.findByPk(req.params.userId)
      .then(data => {
        return res.status(200).send(data);
      })
      .catch(err => {
        return res.status(500).send({ message: err.message });
      });
  }
};

exports.delete = (req, res) => {
  const id = req.params.userId;
  User.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        return res.status(200).send({
          message: "User deleted successfully!"
        });
      } else {
        return res.status(404).send({
          message: "User not found."
        });
      }
    })
    .catch(err => {
      return res.status(500).send({
        message: err.message
      });
    });
};

// search a coach by id and return an objec with data about coach 
//and 2 arrays with clubs
exports.searchById = (req, res) => {
  User.findOne({
    where: {
      role_id: 2,
      id: req.params.id
    }
  }).
    then(async (data) => {
      if (data === null)
        return res.status(404).send({ message: "Not found " });
      else {
        var t = {
          id: data.id,
          first_name: data.first_name,
          last_name: data.last_name,
          email: data.email,
          _clubs: null,
          unused_clubs: null
        }
        await Club.findAll({ where: { owner_id: data.id } })
          .then((clubs) => {
            if (clubs != null) {
              t._clubs = clubs.map(o => {
                const clubs_u = {
                  c_id: null,
                  c_name: null
                }
                clubs_u.c_id = o.id;
                clubs_u.c_name = o.name;
                return clubs_u;
              });
            }
            return t;
          }).catch(err => { res.status(500).send({ message: err.messag }) })
        await Club.findAll({ where: { owner_id: null } })
          .then(async (data) => {
            if (data != null) {
              t.unused_clubs = await data.map(o => {
                const clubs_u = {
                  c_id: null,
                  c_name: null
                }
                clubs_u.c_id = o.id;
                clubs_u.c_name = o.name;
                return clubs_u;
              })
            }
            return t;
          })
          .catch(err => { res.status(500).send({ message: err.message }) })
        return res.status(200).send(t);
      }
    })
    .catch(err => {
      return res.status(500).send({ message: err.message });
    })
};

//after register we need to add data about athlete
exports.update = (req, res) => {
  let _gender = req.body.gender;
  let p_Sport = req.body.primarySport;
  let s_Sport = req.body.secondarySport;
  let _height = req.body.height;
  let _weight = req.body.weight;
  let _age = req.body.age;
  let primary_sport_id = null;
  let secondary_sport_id = null;
  var p1 = new Promise((ress, rej) => {
    if (p_Sport != null) {
      Sport.findOne({
        where: {
          type: p_Sport
        }
      })
        .then(data => {
          if (data == null) {
            rej("");
            return res.status(404).send({
              message: "sportType not found."

            });
          } else {
            primary_sport_id = data.id;
            ress("");

          }
        })
        .catch(err => {
          return res.status(500).send({ message: err.message });
        });
    } else ress("");
  });
  var p2 = new Promise((ress, rej) => {
    if (s_Sport != null) {
      Sport.findOne({
        where: {
          type: s_Sport
        }
      })
        .then(data => {
          if (data == null) {
            rej("");
            return res.status(404).send({
              message: "sportType not found."
            });
          } else {
            secondary_sport_id = data.id;
            ress("");

          }
        })
        .catch(err => {
          return res.status(500).send({ message: err.message });
        });
    }
    else rej("");
  });
  Promise.all([p1, p2]).then(v => {
    if (_gender != null && (!(_gender === "male" || _gender === "female"))) {
      return res.status(400).send({ message: "Invalid gender." });
    }
    if (_height != null && (isNaN(_height) || _height < 150 || _height > 300)) {
      return res.status(400).send({ message: "Invalid height." });
    }
    if (_weight != null && (isNaN(_weight) || _weight < 30 || _weight > 100)) {
      return res.status(400).send({ message: "Invalid weight." });
    }
    if (_age != null && (isNaN(_age) || _age < 5 || _age > 100)) {
      return res.status(400).send({ message: "Invalid age." });
    }
    const user = {
      gender: _gender,
      primary_sport_id: primary_sport_id,
      secondary_sport_id: secondary_sport_id,
      height: _height,
      weight: _weight,
      age: _age
    };
    User.update(user, {
      where: {
        id: req.params.userId
      }
    })
      .then(num => {
        if (num == 1) {
          res.status(200).send("User updated successfully !");
        }
        else {
          res.status(404).send("User not found.")
        }
      })
  }).catch(error => console.log(`Error in promises ${error}`))
};

//update a coach and his clubs
exports.updateCoach = async (req, res) => {
  const clubs = req.body.clubs;
  const id = req.body.user_id;

  var f_name = req.body.first_name;
  var l_name = req.body.last_name;
  var _email = req.body.email;


  if (!regexPassword.test(_email)) {
    return res.status(400).send({ message: "Invalid email" });
  }
  else {
    await User.findOne({ where: { email: _email } })
      .then(data => {
        if (data != null && data.id != id) {
          _email = null;
        }
        return;
      })
  }
  if (_email === null) {
    return res.status(400).send({ message: "Email already exist." });
  }
  if (f_name != null && (hasNumbers(f_name) || f_name.length < 3)) {
    return res.status(400).send({ message: "Invalid first name." });
  }
  if (l_name != null && (hasNumbers(l_name) || l_name.length < 3)) {
    return res.status(400).send({ message: "Invalid last name." });
  }
  const user = {
    first_name: f_name,
    last_name: l_name,
    email: _email
  };
  await User.update(user, {
    where: {
      id: id
    }
  })
    .then(num => {
      if (num == 1) {
        res.status(200).send("User updated successfully !");
      }
      else {
        res.status(404).send("User not found.")
      }
    }).catch(error => console.log(`Error in promises ${error}`))

  await Club.update({ owner_id: null }, { where: { owner_id: id } })
  await Club.update({ owner_id: id }, { where: { id: clubs } })

};

// delete all users with role_id=2(coach)=>owner_id (clubs)=null
exports.deleteAll = async (req, res) => {
  const id = req.body.user_id;
  await Club.update({ owner_id: null }, { where: { owner_id: id } })
  User.destroy({
    where: {
      id: id,
      role_id: 2
    }
  })
    .then(num => {
      if (num >= 1) {
        return res.status(200).send({ message: "Deleted successfully!" });
      } else {
        return res.status(404).send({ message: "Coach not found." });
      }
    })
    .catch(err => {
      return res.status(500).send({ message: err.message });
    });
}

//create a coach and send his password on email
exports.createCoach = async (req, res) => {
  var f_name = req.body.first_name;
  var l_name = req.body.last_name;
  var _email = req.body.email;
  andrei

  if (!regexPassword.test(_email)) {
    return res.status(400).send({ message: "Invalid email" });
  }
  else {
    await User.findOne({ where: { email: _email } })
      .then(data => {
        if (data != null)
          _email = null;
        return;
      })
  }
  if (_email === null) {
    return res.status(400).send({ message: "Email already exist." });
  }
  if (f_name != null && (hasNumbers(f_name) || f_name.length < 3)) {
    return res.status(400).send({ message: "Invalid first name." });
  }
  if (l_name != null && (hasNumbers(l_name) || l_name.length < 3)) {
    return res.status(400).send({ message: "Invalid last name." });
  }
  const user = {
    first_name: f_name,
    last_name: l_name,
    email: _email,
    password: null,
    role_id: 2
  }
  let pass = generatePassword();
  mail.sendMail(user.email, "Your password", "Dear " + user.first_name + " " + user.last_name + "," + " this is your password: " + pass);
  user.password = bcrypt.hashSync(pass, 8);
  User.create(user)
    .then(data => {
      Club.update({ owner_id: data.id }, { where: { id: req.body.clubs } })
        .then(num => {
          if (num == 1) {
            return Club.findByPk(id);
          } else {
            return res.status(404).send({
              message: "Club not found."
            });
          }
        })
        .then(data => {
          res.status(200).send(data);
        })
        .catch(err => {
          res.status(500).send({ message: err.message });
        });
      res.status(200).send(data);
    })
    .catch(err => {
      return res.status(500).send({ message: err.message });
    });

}

//search a user by role_id and return 
//an object with data about users and an array with clubs(for coaches) 
exports.search = (req, res) => {
  User.findAll({
    where: {
      role_id: req.params.role_id
    }
  }).
    then(async (data) => {
      if (data === null)
        return res.status(404).send({ message: "Not found " });
      else {
        var list = [];
        data.map(async (obj, index) => {
          var t = {
            id: obj.id,
            first_name: obj.first_name,
            last_name: obj.last_name,
            email: obj.email,
            _clubs: null
          }
          var a = await Club.findAll({ where: { owner_id: obj.id } })
            .then((clubs) => {
              if (clubs != null) {
                t._clubs = clubs.map(o => {
                  const c = {
                    c_id: o.id,
                    c_name: o.name
                  }
                  return c;
                });
              }
              return t;
            });
          list.push(a);
          if (index === data.length - 1)
            return res.status(200).send(list);
        })
      }
    })
    .catch(err => {
      return res.status(500).send({ message: err.message });
    })
};

//return all coaches
exports.allCoaches = ((req, res) => {
  User.findAll({ where: { role_id: 2 } })
    .then(data => {
      var list = data.map(o => {
        const obj = {
          coach_id: o.id,
          last_name: o.last_name,
          first_name: o.first_name
        }
        return obj
      })
      return res.status(200).send(list)
    }).catch(err => {
      return res.status(500).send({ message: err.message });
    })
})



