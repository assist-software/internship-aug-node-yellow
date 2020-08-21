const db = require("../models");
const Sport = db.sport;

exports.list = (req, res) => {

    Sport.findAll({})
        .then((data) => {
            return res.status(200).send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving the member list."
            });
        });
};