const db = require("../models");
const validator = require("validator");
const EventInvite = db.eventInvite;
const Event = db.event;
const User = db.user;
const EventMember = db.eventMember;

exports.create = (req, res) => {
  //Check if eventId exists
  Event.findByPk(req.body.eventId)
  .then(data => {
      if(data == null) {
          res.status(404).send({
              message: "Event not found."
          });
      }
  })
  .catch(err => {
      res.status(500).send({
          message: err.message
        });
  });
  
  //Validate email
  var regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if(regex.test(req.body.email) == false) {
      res.status(400).send({
          message: "Invalid email."
      });
  }

  //Insert new invite in EventInvite
  const eventInvite = {
      email: req.body.email,
      event_id: req.body.eventId
  }

  EventInvite.create(eventInvite)
  .then(data => {
      res.status(200).send(data);
  })
  .catch(err => {
      res.status(500).send({
          message: err.message
      });
  });
};

exports.accept = (req, res) => {
  let event_id;
  //Get email from inviteId
  EventInvite.findByPk(req.params.inviteId)
  .then(data => {
      if(data == null) {
          res.status(404).send({
              message: "Invitation not found."
          });
      } else { 
          event_id = data.event_id;

          //check if user with email exists
          return User.findOne({
              where: {
                  email: data.email
              }
          });
      }
  })
  .then(userData => {
      if(userData ==  null) {
          res.status(404).send({
              message: "User not found."
          });
      } else {
        const eventMember = {
            user_id: userData.id,
            event_id: event_id
        };
        //Add new entry to EventMember
        return EventMember.create(eventMember);
      }
  })
  .then(eventMemberData => {
    return EventInvite.destroy({
        where: {id: req.params.inviteId}
    });
  })
  .then(num => {
        res.status(200).send({
            message: "Invitation accepted successfully!"
        });
  })
  .catch(err => {
      res.status(500).send({
          message: err.message
      });
  });
};

exports.decline = (req, res) => {
  const id = req.params.inviteId;
  //Check if inviteId exists
  EventInvite.findByPk(id)
  .then(eventInviteData => {
      if(eventInviteData == null) {
          res.status(404).send({
              message: "Invitation not found."
          });
      } else {
          return EventInvite.destroy({
              where: {id: id}
          });
      }
  })  
  .then(num => {
        res.status(200).send({
            message: "Invitation declined successfully!"
        });
  })
  .catch(err => {
      res.status(500).send({
          message: err.message
      });
  });
};

exports.list = (req, res) => {
    EventInvite.findAll({
        where: {
            event_id: req.params.eventId
        }
    })
    .then(data => {
        return res.status(200).send(data);
    })
    .catch(err => {
        return res.status(500).send({
            message: err.message
        });
    });
};