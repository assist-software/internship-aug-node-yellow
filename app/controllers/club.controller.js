const db = require("../models");
const userRoutes = require("../routes/user.routes");
const { club, clubInvite } = require("../models");
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
  // if (req.authJwt == null) {
  //   return res.status(403).send({ message: "Permission denied." });
  // } else {
    const id = req.params.clubId;
    let resClub = null;

    Club.findByPk(id)
      .then(data => {
        if(data != null) {
          resClub = data;
          return ClubMember.findAll({
            where: {
              club_id: id
            }
          });
        } else {
          return res.status(400).send({
            message: "Club not found."
          });
        }
      }).then(result => {
        const membersId = result.map(member => member.dataValues.user_id);
        if(membersId.length == 0) {
          return [];
        }
        return User.findAll({
          where: {
            id: membersId
          }
        });
      }).then(clubMembers => {
        resClub.dataValues.members = clubMembers;
        return ClubInvite.findAll({
          where: {
            club_id: id
          }
        });
      }).then(result => {
        const invitesEmails = result.map(invite => invite.dataValues.email);
        if(invitesEmails.length == 0) {
          return [];
        }
        User.findAll({
          where: {
            email: invitesEmails
          }
        });
      }).then(clubInvites => {
        resClub.dataValues.pending = clubInvites;
        res.status(200).send(resClub);
      })
      .catch(err => {
        res.status(500).send({ message: err.message });
      });
  // }
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

exports.listAll = (req, res) => {
  let resClub = null;

  Club.findAll({
    where: {
      owner_id: {
        [Op.ne]: null
      }
    }
  }).then(result => {
    resClub = result;
    const ownersId = resClub.map(x => x.owner_id);
    return User.findAll({
      where: {
        id: ownersId
      }
    });
  }).then(result => {
    resClub = resClub.map(res => {
      res.dataValues.owner = result.filter(user => user.dataValues.id === res.dataValues.owner_id)[0];
      return res;
    })
    const clubIds = resClub.map(club => club.dataValues.id);
    return ClubMember.findAll({
      where: {
        club_id: clubIds
      }
    });
  }).then(result => {
    const membersId = result.map(clubMember => clubMember.dataValues.user_id);
    resClub = resClub.map(res => {
      res.dataValues.members = result.filter(club => club.dataValues.club_id === res.dataValues.id);
      return res;
    })
    if(membersId.length == 0) {
      return [];
    }
    return User.findAll({
      where: {
        id: membersId
      }
    })
  }).then(clubMembers => {
    resClub = resClub.map(res => {
      res.dataValues.members = res.dataValues.members.map(members => clubMembers.filter(user => user.dataValues.id === members.dataValues.user_id)[0]);
      return res;
    });
    const clubIds = resClub.map(club => club.dataValues.id);
    return ClubInvite.findAll({
      where: {
        club_id: clubIds
      }
    })
  }).then(result => {
    const invitesEmails = result.map(invite => invite.dataValues.email);
    resClub = resClub.map(res => {
      res.dataValues.pending = result.filter(club => club.dataValues.club_id === res.dataValues.id);
      return res;
    });
    if(invitesEmails.length == 0) {
      return [];
    }
    return User.findAll({
      where: {
        email: {
          [Op.like]: {[Op.any]: invitesEmails}
      }
    }});
  }).then(clubInvites => {
    resClub = resClub.map(res => {
      res.dataValues.pending = res.dataValues.pending.map(invites => clubInvites.filter(user => user.dataValues.email === invites.dataValues.email)[0]);
      return res;
    })
    return res.status(200).send(resClub);
  })
  .catch(err => {
    res.status(500).send({
      message: err.message
    });
  });

};

exports.list = (req, res) => {
  const condition = (req.body.role_id == 2) ? { owner_id: req.body.user_id } : null;

  Club.findAll({
    where: condition
  })
    .then(data => {
      res.status(200).send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message
      });
    });
};