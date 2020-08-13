const db = require("../models");
const ClubMember = db.clubMember;
//const Op = db.Op;

exports.create = (req, res) => {
  //Validate request
  if(!req.body.user_id || !req.body.club_id) {
      res.status(404).send({
          message: "Content cannot be empty!"
      });
      return;
  }
   //Create ClubMember
   const clubMemeber = {
       user_id: req.body.user_id,
       club_id: req.body.club_id
   };

   //Save clubMember in the db
   ClubMember.create(clubMemeber)
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
    const id = req.params.inviteId;

    ClubMember.destroy({
        where: {id: id}
    })
    .then(num => {
        if(num == 1) {
            res.status(200).send({
                message: "ClubMember deleted successfully!"
            });
        } else {
            res.status(404).send({
                message: `ClubMember with id: ${id} was not found.`
            });
        }
    })
    .catch(err => {
        res.status(500).send({
            message: "Could not delete ClubMember with id: " + id
        });
    });
}

exports.list = (req, res) => {
    const clubId = req.params.clubId;

    ClubMember.findAll({
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
}

