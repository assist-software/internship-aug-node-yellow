const db = require("../models");
const Op = require("sequelize");
const Club = db.club;
const ClubInvite = db.clubInvite;
const ClubMember = db.clubMember;
const User = db.user;
const PromiseAll = require("promises-all");

exports.create = (req, res) => {
  //User-ul cu rol atlet nu are permisiune sa creeze un club
  /*if (req.authJwt.role_id == 3) {
    return res.status(403).send({
      message: "Access denied."
    });
    //User-ul cu rol coach cand creaza un club devine owner
  } else if (req.authJwt.role_id == 2) {
    req.body.ownerId = req.authJwt.user_id;
  }*/

  const club = {
    name: req.body.name,
    owner_id: req.body.ownerId
  };

  var regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  Club.create(club)
    .then(data => {
      //Verify email and invite members
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
};

exports.update = (req, res) => {
  const id = req.params.clubId;

  //Nu se permite altetului sa modifice un club
  if (req.authJwt.role_id == 3) {
    return res.status(403).send({
      message: "Access denied."
    });
    //Nu se permite unui coach sa modifice alt club decat unul propriu
  } else if (req.authJwt.role_id == 2 && req.body.ownerId != req.authJwt.user_id) {
    return res.status(403).send({
      message: "Access denied."
    });
  } else {
    Club.update(req.body, { where: { id: id } })
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
  }
};

exports.get = (req, res) => {
  if (req.authJwt == null) {
    return res.status(403).send({ message: "Permission denied." });
  } else {
    Club.findByPk(req.params.clubId)
      .then(data => {
        res.status(200).send(data);
      })
      .catch(err => {
        res.status(500).send({ message: err.message });
      });
  }
};

exports.search = (req, res) => {
  if (req.authJwt == null) {
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
    })
      .then(data => {
        res.status(200).send(data);
      })
      .catch(err => {
        res.status(500).send({ message: err.message });
      });
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

exports.list = (req, res) => {
  let resClub = null;
  function getOwner(club) {
    return User.findByPk(club.owner_id);
  }
  function getClubMembers(club) {
    return ClubMember.findAll({
      where: { club_id: club.id }
    });
  }
  function findMember(user) {
    return User.findByPk(user.user_id);
  }

  Club.findAll({
    where: null
  })
    .then(data => {
      resClub = data;
      return Promise.all(data.map(entry => getOwner(entry)));
    })
    .then(usersData => {
      for (let i = 0; i < resClub.length; i++) {
        resClub[i].dataValues["ownerFirstName"] = usersData[i].first_name;
        resClub[i].dataValues["ownerLastName"] = usersData[i].last_name;
      }
      return Promise.all(resClub.map(entry => getClubMembers(entry)));
    })
    .then(clubsMembers => {
      return Promise.all(clubsMembers.map(entry => findMember(entry)));
    })
    .then(membersData => {
      for (let i = 0; i < resClub.length; i++) {
        if(membersData[i] != null) {
          resClub[i].dataValues["members"] = membersData[i].dataValues;
        } else {
          resClub[i].dataValues["members"] = [];
        }
      }
      
      res.status(200).send(resClub);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message
      });
    });
};