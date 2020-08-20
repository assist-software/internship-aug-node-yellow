const db = require("../models");
const controller = require("../middlewares/verifySignUp");
const { verifySignUp } = require("../middlewares");
const User = db.user;
const Sport = db.sport;
const Club = db.club;
const Promise = require("promise");

function hasNumbers(t) {
  var regex = /\d/g;
  return regex.test(t);
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



  if (f_name != null && (hasNumbers(f_name) || f_name.length < 3))//|| f_name.trim().length != f_name.length)
  {
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
      res.status(400).send({
        message: "Failed! Email is already in use!"
      }
      );
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
        primarySport: p_Sport,
        secondarySport: s_Sport,
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



exports.update = (req, res) => {

  //let f_name = req.body.first_name;
  //let l_name = req.body.last_name;
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
      //first_name:f_name,
      //last_name: l_name,
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



exports.search = (req, res) => {

  // if (req.authJwt == null) {
  // return res.status(403).send({ message: "Permission denied ." });
  // } else {
  //const c
  const t = {
    _user: null,
    _clubs: null
  }
  User.findAll({
    where: {
      role_id: req.params.role_id
    }
  }).
    then(data => {
      if (data == null)
        return res.status(404).send({ message: "Not found " });
      else {
        var list = data.map(obj => {
          t._user = obj;
          Club.findAll({ where: { owner_id: obj.id } })
            .then(clubs => {
              t._clubs = clubs;
            })

          return t
        })

        console.log(data);
        return res.status(200).send(list);
      }
    })
    .catch(err => {
      return res.status(500).send({ message: err.message });
    })
  //}
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

