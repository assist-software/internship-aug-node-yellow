const db = require("../models");
const ClubInvite = db.club_invites;
const User= db.users;
const Role=db.roles;

exports.create = (req, res) => {
    //Validate request
    var regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!req.body.club_id || !regex.test(req.body.email)) {
        res.status(404).send({
            message: "Content cannot be empty!"
        });
        return;
    }
     const clubInvites = {
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
exports.update = (req, res) => {

};
exports.get = (req, res) => {

};

exports.search = (req, res) => {

};


exports.delete = (req, res) => {

};
