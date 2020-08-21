const db = require("../models");
const Op = require("sequelize").Op;
const Club = db.club;
const ClubInvite = db.clubInvite;
const ClubMember = db.clubMember;
const User = db.user;


exports.create = (req, res) => {
  //User-ul cu rol atlet nu are permisiune sa creeze un club
  // if (req.authJwt.role_id == 3) {
  //   return res.status(403).send({
  //     message: "Access denied."
  //   });
  //   //User-ul cu rol coach cand creaza un club devine owner
  // } else if (req.authJwt.role_id == 2) {
  //   req.body.ownerId = req.authJwt.user_id;
  // }

  const club = {
    name: req.body.name,
    owner_id: req.body.ownerId,
    sport_id: req.body.sport_id
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

  // //Nu se permite altetului sa modifice un club
  // if (req.authJwt.role_id == 3) {
  //   return res.status(403).send({
  //     message: "Access denied."
  //   });
  //   //Nu se permite unui coach sa modifice alt club decat unul propriu
  // } else if (req.authJwt.role_id == 2 && req.body.ownerId != req.authJwt.user_id) {
  //   return res.status(403).send({
  //     message: "Access denied."
  //   });
  // } else {
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
  //}
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
exports.listClubsOwnerNull = (req, res) => {
  Club.findAll({ where: { owner_id: null } })
    .then(data => { 
      console.log(data);
      return res.status(200).send(data) })
    .catch(err => {
      res.status(500).send({
        message: err.message
      });
    })
}

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
  function resolveMembers(membersData) {
    const rez = 
    membersData.map(async(member) => {
      const mem = await member;
      const user = await findMember(mem);
      // console.log(1);
      // console.log(user.dataValues);
      return user.dataValues;
    });
    return rez;
  }
 
  console.log(null);
  Club.findAll({
    where: {
      owner_id: {
        [Op.ne]: null
      }
    }
  })
    .then(data => {
      resClub = data.map(club => club.dataValues);
      return Promise.all(data.map(entry => getOwner(entry)));
    })
    .then(usersData => {
      for (let i = 0; i < resClub.length; i++) {
        resClub[i]["ownerFirstName"] = usersData[i].first_name;
        resClub[i]["ownerLastName"] = usersData[i].last_name;
      }
      return Promise.all(resClub.map(entry => getClubMembers(entry)));
    })
    .then((membersData) => {
      for (let i = 0; i < resClub.length; i++) {
        if (membersData[i] != null) {
          // resClub[i]["members"] = 
          Promise.all(resolveMembers(membersData[i]))
          .then(data => {
            resClub[i]["members"] = data;
            //console.log(2);
          //console.log(resClub[i]["members"]);
          if (i == resClub.length - 1) {
            res.status(200).send(resClub);
          }
          });
          
        } else {
          resClub[i]["members"] = [];
          if (i == resClub.length - 1) {
            res.status(200).send(resClub);
          }
        }
      }
    })
    .catch(err => {
      res.status(500).send({
        message: err.message
      });
    });
};