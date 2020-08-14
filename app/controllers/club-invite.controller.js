const db = require("../models");
const sm = require("../utils");
const ClubInvite = db.club_invites;
const ClubMember = db.club_members;
const User = db.users;
const Role = db.roles;

exports.create = (req, res) => {
    //Validate request
    var regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!req.body.club_id || !regex.test(req.body.email)) {
        res.status(404).send({
            message: "Content cannot be empty!"
        });
        return;
    }
    const clubInvite = {
        email: req.body.email,
        club_id: req.body.club_id
    };

    //Save clubMember in the db
    ClubInvite.create(clubInvite)
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

    if (req.body.email == User.email) {
        const clubMember = {
            club_id: req.body.club_id,
            user_id: User.id

        };

        //Save clubMember in the db
        ClubMember.create(clubMember)
            .then(data => {
                res.status(200).send(data);
            })
            .catch(err => {
                res.status(500).send({
                    message: err.message || "Some error occured while creating the clubMember"
                })
            });
    }

    const id = req.params.inviteId;

    ClubInvite.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.status(200).send({
                    message: "ClubInvite deleted successfully!"
                });
            } else {
                res.status(404).send({
                    message: `ClubInvite with id:${id} was not found.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete ClubInvite with id:" + id
            });
        });

};


exports.decline = (req, res) => {


    
    const id = req.params.inviteId;

    ClubInvite.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.status(200).send({
                    message: "ClubInvite deleted successfully!"
                });
            } else {
                res.status(404).send({
                    message: `ClubInvite with id:${id} was not found.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete ClubInvite with id:" + id
            });
        });

};

exports.list = (req, res) => {
    const clubId = req.params.id;


    ClubInvite.findAll({
        where: { club_id: clubId }
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
