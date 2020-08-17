  const db = require("../models");
  const jwt = require("jsonwebtoken");
  const config = require("../config/auth.config");
  const Op = require("sequelize");
  const Club = db.club;
  const User= db.user;
  const Role=db.role;
  const ClubInvite = db.clubInvite;
  function hasNumbers(t)
  {
  var regex = /\d/g;
  return regex.test(t);
  }  
  exports.create = (req, res) => {

//mai am de scris aici validarile si de implementat functiile: update, get, search si delete
let f_name = req.body.first_name;
let l_name = req.body.last_name;
let _gender = req.body.gender;
let p_Sport = req.body.primarySport;
let s_Sport = req.body.secondarySport;


if(hasNumbers(f_name) || f_name.length < 3 )//|| f_name.trim().length != f_name.length)
{
return res.status(400).send({  message: "Invalid first name."});
}

if(hasNumbers(l_name) || l_name.length < 3 )
{
return res.status(400).send({  message: "Invalid last name."});
}
if(!(_gender === "male" || _gender === "female"))
{
  return res.status(400).send({  message: "Invalid gender."});
}
if(hasNumbers(p_Sport) || p_Sport.length < 3 )
{
  return res.status(400).send({  message: "Invalid Primary Sport."});
}
if(hasNumbers(s_Sport) || s_Sport.length < 3 )
{
  return res.status(400).send({  message: "Invalid Secondary Sport."});
}
if(isNaN(_height) || _height<150 || _height >300)
{
  return res.status(400).send({  message: "Invalid height."});
}
if(isNaN(_weight) || _weight <30 || _weight > 100)
{
  return res.status(400).send({  message: "Invalid weight."});
}
if(isNaN(_age) || _age < 5 || _age > 100)
{
  return res.status(400).send({  message: "Invalid age."});
}

const user = {
 first_name: f_name,
 last_name: l_name,
 email: req.body.email,
 password: req.body.password,
 confirm_password: req.body.confirm_password,
 role: req.body.role,
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
            return res.status(500).send({message: err.message});
          });
       
  }
  /*
  exports.update = (req, res) => {
    const id = req.params.clubId;
    var token = req.headers['x-access-token'];
    if(!token) {
      return res.status(401).send({
        message: "No token provided."
      });
    }
  
    jwt.verify(token, config.secret, function(err, decoded) {
      if(err) {
        return res.status(500).send({
          message: "Failed to authenticate token."
        });
      }
      User.findById(decoded.id, function(err, user) {
        if(err) {
          return res.status(500).send({
            message: "There was a problem finding the user."
          });
        }
        if(!user) {
          return res.status(404).send({
            message: "No user found."
          });
        }
  
        Role.findOne({
          where: {id: user.role_id}
        })
        .then(roleData => {
          if(roleData == null) {
            return res.status(404);
          }
          if(roleData.isAdmin == false && req.body.owner_id != decoded.id) {
            return res.status(403).send({message: "Permission denied."});
          }
  
          return Club.update(req.body, {where: {id: id}});
        })
        .then(num => {
            if(num >= 1) {
              return Club.findByPk(id);
            } else {
              return res.status(404);
            }
          })
        .then(data => {
          return res.status(200).send(data);
        })
        .catch(err => {
          return req.status(500).send({message: err.message});
        });
      });
    });
  };
  exports.get = (req, res) => {
    if(req.session.user == null) {
      return res.status(403).send({message: "Permission denied."});
    } else {
      Club.findByPk(req.params.clubId)
      .then(data => {
        return res.status(200).send(data);
      })
      .catch(err => {
        return res.status(500).send({message: err.message});
      });
    }
  };
  
  exports.search = (req, res) => {
    if(req.session.user == null) {
      return res.status(403).send({message: "Permission denied."});
    } else {
      Club.findAll({
        where: {
          name: {
            [Op.ilike]: req.body.name
          },
          owner_id: {
            [Op.ilike]: req.body.ownerId
          }
        }
      }).
      then(data => {
        return res.status(200).send(data);
      })
      .catch(err => {
        return res.status(500).send({message: err.message});
      })
    }
  };
  
  
  exports.delete = (req, res) => {
    const id = req.params.clubId;
  
    Club.destroy({
      where: {id: id}
    })
    .then(num => {
      if(num == 1) {
        return res.status(200).send({
          message: "Club deleted successfully!"
        });
      } else {
        return res.status(404).send({
          message: "Club not found."
        });
      }
    })
    .catch(err => {
      return res.status(500).send({
        message: err.message
      });
    });
  };
  */
 //////////////////////////////////////////////////
  /*
  exports.allAccess = (req, res) => {
    res.status(200).send("Public Content.");
  };
  
  exports.adminBoard = (req, res) => {
    res.status(200).send("Admin Content.");
  };
  
  exports.coachBoard = (req, res) => {
    res.status(200).send("Coach Content.");
  };

  exports.athleteBoard = (req, res) => {
    res.status(200).send("Athlete Content.");
  };

  */