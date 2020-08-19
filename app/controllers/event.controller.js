const db = require("../models");
const Event = db.event;
const Club = db.club;
const Sport = db.sport;
const EventInvite = db.eventInvite;
const isBlob = require("is-blob");
const sendMail = require("../utils/email.utils.js");
const Op = require("sequelize");

exports.create = (req, res) => {
    //Check if club exists
    Club.findByPk(req.body.clubId)
        .then(data => {
            if (data == null) {
                return res.status(404).send("Club not found.");
            }
        })
        .catch(err => {
            return res.status(500).send({
                message: err.message
            });
        });

    //Validate date
    let date = req.body.date;
    if (date instanceof Date && !isNaN(date) && moment() > date) {
        return res.status(400).send({
            message: "Invalid date."
        });
    }

    //Validate time
    let time = req.body.time;
    if (moment(time, "LT", true).isValid() == false) {
        return res.status(400).send({
            message: "Invalid time."
        });
    }

    //Validate name
    let name = req.body.name.trim();
    if (name.length < 4) {
        return res.status(400).send({
            message: "Invalid name."
        });
    }

    //Validate description
    let description = req.body.description.trim();
    if (description.length < 4) {
        return res.status(400).send({
            message: "Invalid description."
        });
    }

    //Validate location
    let location = req.body.location.trim().split(',').forEach(element => Number(element));
    if (location.length != 2 || location.every(element => isNaN(element))) {
        return res.status(400).send({
            message: "Invalid location."
        });
    }

    //Validate radius
    let radius = req.body.radius;
    if (isNan(radius)) {
        return res.status(400).send({
            message: "Invalid radius."
        });
    } else if (radius == null) {
        radius = 1;
    }

    //Validate sportType
    let sportType = req.body.sportType.trim();
    let sport_type_id;
    Sport.findOne({
        where: {
            type: sportType
        }
    })
        .then(data => {
            if (data == null) {
                return res.status(404).send({
                    message: "sportType not found."
                });
            } else {
                sport_type_id = data.id;
            }
        })
        .catch(err => {
            return res.status(500).send({ message: err.message });
        });

    //Validate event_cover
    let event_cover = req.body.event_cover;
    if (event_cover.type != "image/png" && event_cover.type != "image/jpeg") {
        return res.status(400).send({
            message: "Invalid event_cover"
        });
    }

    //Create event
    const event = {
        name: name,
        date: date,
        time: time,
        description: description,
        location: location,
        club_id: req.body.clubId,
        radius: radius,
        sport_type_id: sport_type_id,
        event_cover: event_cover
    };

    Event.create(event)
        .then(data => {
            if (req.body.invite_emails != null) {
                //Send invite emails
                sendMail(req.body.invite_emails, `Invitation to ${name} event`,
                    `You have been invited to ${name} event. You may accept or decline the invitation.`);
                var regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                req.body.invite_emails.forEach(email => {
                    if (regex.test(email)) {
                        EventInvite.create({
                            email: email,
                            event_id: data.id
                        });
                    }
                });
            }
            return res.status(200).send(data);
        })
        .catch(err => {
            return res.status(500).send({ message: err.message });
        });
};

exports.update = (req, res) => {
    //Check if club exists
    Club.findByPk(req.body.clubId)
        .then(data => {
            if (data == null) {
                return res.status(404).send("Club not found.");
            }
        })
        .catch(err => {
            return res.status(500).send({
                message: err.message
            });
        });

    //Validate date
    let date = req.body.date;
    if (date instanceof Date && !isNaN(date) && moment() > date) {
        return res.status(400).send({
            message: "Invalid date."
        });
    }

    //Validate time
    let time = req.body.time;
    if (moment(time, "LT", true).isValid() == false) {
        return res.status(400).send({
            message: "Invalid time."
        });
    }

    //Validate name
    let name = req.body.name.trim();
    if (name.length < 4) {
        return res.status(400).send({
            message: "Invalid name."
        });
    }

    //Validate description
    let description = req.body.description.trim();
    if (description.length < 4) {
        return res.status(400).send({
            message: "Invalid description."
        });
    }

    //Validate location
    let location = req.body.location.trim();
    if (location.length < 3) {
        return res.status(400).send({
            message: "Invalid location."
        });
    }

    //Validate radius
    let radius = req.body.radius;
    if (isNan(radius)) {
        return res.status(400).send({
            message: "Invalid radius."
        });
    } else if (radius == null) {
        radius = 1;
    }

    //Validate sportType
    let sportType = req.body.sportType.trim();
    let sport_type_id;
    Sport.findOne({
        where: {
            type: sportType
        }
    })
        .then(data => {
            if (data == null) {
                return res.status(404).send({
                    message: "sportType not found."
                });
            } else {
                sport_type_id = data.id;
            }
        })
        .catch(err => {
            return res.status(500).send({ message: err.message });
        });

    //Validate event_cover
    let event_cover = req.body.event_cover;
    if (!isBlob(event_cover)) {
        return res.status(400).send({
            message: "Invalid event_cover"
        });
    }

    //Update event
    const id = req.params.eventId;

    const event = {
        name: name,
        date: date,
        time: time,
        description: description,
        location: location,
        club_id: req.body.clubId,
        radius: radius,
        sport_type_id: sport_type_id,
        event_cover: event_cover
    };

    Event.update(event, {
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                return res.status(200).send(event);
            } else {
                return res.status(404).send("Event not found.");
            }
        })
        .catch(err => {
            return res.status(500).send({ message: err.message });
        });
};

exports.get = (req, res) => {
    const id = req.params.eventId;

    Event.findByPk(id)
        .then(data => {
            if (data != null) {
                return res.status(200).send(data);
            } else {
                return res.status(404).send({
                    message: "Event not found."
                });
            }
        })
        .catch(err => {
            return res.status(404).send({ message: err.message });
        });
};

exports.search = (req, res) => {
    //May be added more filters
    Event.findAll({
        where: {
            name: {
                [Op.iLike]: `%${req.body.name}%`
            }
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

exports.delete = (req, res) => {
    const id = req.params.eventId;

    Event.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                return res.status(200);
            } else {
                return res.status(404).send({
                    message: "Event not found."
                });
            }
        })
        .catch(err => {
            return res.status(500).send({
                message: err.message
            });
        });
};