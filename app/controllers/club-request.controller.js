const db = require("../models");
const ClubRequest = db.clubRequest;
const ClubMember = db.clubMember;

exports.create = (req, res) => {
    if(!req.body.user_id || !req.body.club_id) {
        res.status(404).send({
            message: "Content cannot be empty!"
        });
        return;
    } 

    const clubRequest = {
        user_id: req.body.user_id,
        club_id: req.body.club_id
    };

    ClubRequest.create(clubRequest)
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
    ClubRequest.findByPk(id)
    .then(requestData => {
      if(requestData === null) {
          res.status(404).send({
              message: "ClubRequest not found."
          });
          return;
      }
      console.log(requestData);
      return ClubMember.create(requestData.dataValues);
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

    ClubRequest.destroy({
        where: {id: id}
    })
    .then(num => {
        if(num >= 1) {
            res.status(200).send({
                message: "ClubRequest deleted successfully!"
            });
        } else {
            res.status(404).send({
                message: `ClubRequest with id: ${id} was not found.`
            });
        }
    })
    .catch(err => {
        res.status(500).send({
            message: "Could not delete ClubMember with id: " + id
        });
    });
};

exports.list = (req, res) => {
    const clubId = req.params.clubId;

    ClubRequest.findAll({
        where: {club_id: clubId}
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