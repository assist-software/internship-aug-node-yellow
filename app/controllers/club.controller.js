const db = require("../models");
const jwt = require("jsonwebtoken");
const config = require("../config/auth.config");
const Op = require("sequelize");
const Club = db.club;
const User = db.user;
const Role = db.role;
const ClubInvite = db.clubInvite;
const authJwt = require("../middlewares/authJwt.js");

exports.create = (req, res) => {
  //require middleware instead

  if (authJwt.role_id == 3) {
    return res.status(403).send({
      message: "Access denied."
    });
  } else if (authJwt.role_id == 2) {
    req.body.ownerId = authJwt.user_id;
  }
  const club = {
    name: req.body.name,
    owner_id: req.body.ownerId
  };

  var regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  Club.create(club)
    .then(data => {
      //invite members here
      req.body.invite_members.forEach(email => {
        if (regex.test(email)) {
          ClubInvite.create({
            email: email,
            club_id: data.id
          });
        }
      });
      return res.status(200).send("Club added successfully!");
    })
    .catch(err => {
      return res.status(500).send({ message: err.message });
    });
}

exports.update = (req, res) => {
  const id = req.params.clubId;
  if(authJwt.role_id == 3) {
    return res.status(403).send({
      message: "Access denied."
    });
  } else if(authJwt.role_id == 2 && req.body.ownerId != authJwt.user_id) {
    return res.status(403).send({
      message: "Access denied."
    });
  }
  Club.update(req.body, { where: { id: id } })
    .then(num => {
      if (num >= 1) {
        return Club.findByPk(id);
      } else {
        return res.status(404);
      }
    })
    .then(data => {
      return res.status(200).send(data);
    })
    .catch(err => {
      return req.status(500).send({ message: err.message });
    });


};
exports.get = (req, res) => {
  if (req.session.user == null) {
    return res.status(403).send({ message: "Permission denied." });
  } else {
    Club.findByPk(req.params.clubId)
      .then(data => {
        return res.status(200).send(data);
      })
      .catch(err => {
        return res.status(500).send({ message: err.message });
      });
  }
};

exports.search = (req, res) => {
  if (req.session.user == null) {
    return res.status(403).send({ message: "Permission denied." });
  } else {
    Club.findAll({
      where: {
        name: {
          [Op.ilike]: `%${req.body.name}%`
        },
        owner_id: {
          [Op.ilike]: `%${req.body.ownerId}%`
        }
      }
    }).
      then(data => {
        return res.status(200).send(data);
      })
      .catch(err => {
        return res.status(500).send({ message: err.message });
      })
  }
};


exports.delete = (req, res) => {
  const id = req.params.clubId;

  Club.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
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

