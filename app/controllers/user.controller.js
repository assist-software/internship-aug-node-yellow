  const db = require("../models");
  const jwt = require("jsonwebtoken");
  const config = require("../config/auth.config");
  const Op = require("sequelize");
  const Club = db.club;
  const User= db.user;
  const Role=db.role;
  const ClubInvite = db.clubInvite;
  
  exports.create = (req, res) => {

//mai am de scris aici validarile si de implementat functiile: update, get, search si delete

const user = {
 first_name: req.body.first_name,
 last_name: req.body.last_name,
 email: req.body.email,
 password: req.body.password,
 confirm_password: req.body.confirm_password,
 role: req.body.role,
 gender: req.body.gender,
 primarySport: req.body.primarySport,
 secondarySport: req.body.secondarySport,
 height: req.body.height,
 weight: req.body.weight,
 age: req.body.age,
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