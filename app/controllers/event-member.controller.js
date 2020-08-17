const db = require("../models");
const EventMember = db.eventMember;
//const Op = db.Op;

exports.create = (req, res) => {
  //Validate request
  if(!req.body.user_id || !req.body.event_id) {
      res.status(404).send({
          message: "Content cannot be empty!"
      });
      return;
  }
   //Create EventMember
   const clubMemeber = {
       user_id: req.body.user_id,
       event_id: req.body.event_id
   };

   //Save eventMember in the db
   EventMember.create(eventbMemeber)
   .then(data => {
       res.status(200).send(data);
   })
   .catch(err => {
       res.status(500).send({
           message: err.message || "Some error occured while creating the clubMember"
       })
   });
};

exports.remove = (req, res) => {
    const id = req.params.memberId;

    EventMember.destroy({
        where: {id: id}
    })
    .then(num => {
        if(num == 1) {
            res.status(200).send({
                message: "EventMember deleted successfully!"
            });
        } else {
            res.status(404).send({
                message: `EventMember with id: ${id} was not found.`
            });
        }
    })
    .catch(err => {
        res.status(500).send({
            message: "Could not delete EventMember with id: " + id
        });
    });
}

exports.list = (req, res) => {
    const eventId = req.params.eventId;

    ClubMember.findAll({
        where: {event_id: eventId}
    })
    .then(data => {
        res.status(200).send(data);
    })
    .catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving the member list."
        });
    });
}

