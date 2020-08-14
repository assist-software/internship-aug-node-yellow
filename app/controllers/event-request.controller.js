const db = require("../models");
const EventRequest = db.eventRequest;
const EventMember = db.eventMember;

exports.create = (req, res) => {
    if(!req.body.user_id || !req.body.event_id) {
        res.status(404).send({
            message: "Content cannot be empty!"
        });
        return;
    } 

    const eventRequest = {
        user_id: req.body.user_id,
        event_id: req.body.event_id
    };

    EventRequest.create(eventRequest)
    .then(data => {
        res.status(200).send(data);
    })
    .catch(err => {
        res.status(500).send({
            message: err.message || "Some error occured while creating the clubMember"
        })
    });
};

exports.accept = (req, res) => {
    const id = req.params.requestId;
    EventRequest.findByPk(id)
    .then(requestData => {
      if(requestData === null) {
          res.status(404).send({
              message: "EventRequest not found."
          });
          return;
      }
      return EventMember.create(requestData);
    })
    .then(memberData => {
        return ClubRequest.destroy({
            where: {id: id}
        });
    })
    .then(data => {
        res.status(200).send({
            message: "ClubRequest accepted successfully!"
        });
    })
    .catch(err => {
        res.status(500).send({
            message: err.message
        });
    });
};

exports.decline = (req, res) => {
    const id = req.params.requestId;

    EventRequest.destroy({
        where: {id: id}
    })
    .then(num => {
        if(num == 1) {
            res.status(200).send({
                message: "EventRequest deleted successfully!"
            });
        } else {
            res.status(404).send({
                message: `EventRequest with id: ${id} was not found.`
            });
        }
    })
    .catch(err => {
        res.status(500).send({
            message: "Could not delete EventMember with id: " + id
        });
    });
};

exports.list = (req, res) => {
    const eventId = req.params.eventId;

    EventRequest.findAll({
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
};