const db = require("../models");
const ClubInvite = db.clubInvite;
const ClubMember = db.clubMember;
const User = db.user;
const sendMail=require("../utils/email.utils.js");
const { remove } = require("./event-member.controller");

function deleteI(id){
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

}
exports.create = (req, res) => {
    //Validate request
    var regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!req.body.club_id || !regex.test(req.body.email)) {
        res.status(404).send({
            message: "Content cannot be empty or email invalid!"
        });
        return;
    }
    const clubInvite = {
        email: req.body.email,
        club_id: req.body.club_id
    };

    
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
    const id = req.params.inviteId;
    ClubInvite.findByPk(id)
    .then(data=>{
        const mail=data.email;
        sendMail.sendMail([mail],'Accepted','You was accepted in club');
        User.findOne({
            where: { email: mail }})
            .then(date=>{
                if(date===null)
                    {
                        deleteI(id);
                        res.status(404).send({
                                          message: `User with email:${mail} doesn't exist.`})
                        
                    }
                    else
                    {
                        const clubMember = {
                            club_id: req.body.club_id,
                            user_id: date.id
                
                        };
                
                        //Save clubMember in the db
                        ClubMember.create(clubMember)
                            .then(data => {
                                res.status(200).send(data);
                                
                            })
                            deleteI(id);
                    }
                    
            });
    }).catch(err=>{
        res.status(500).send({
            message: err.message || "Some error occured while creating the clubMember"
        })})
    
    

        
   
 
};


exports.remove = (req, res) => {


    
    const id = req.params.inviteId;

    deleteI(id);

};

exports.list = (req, res) => {
    const id = req.params.clubId;
    ClubInvite.findAll({
        where: { club_id: id }
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
