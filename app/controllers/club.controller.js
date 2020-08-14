const db = require("../models");
const jwt = require("jsonwebtoken");
const config = require("../config/auth.config");
const { role } = require("../models");
const Club = db.club;
const User= db.user;
const Role=db.role;

exports.create = (req, res) => {
  var token = req.headers['x-access-token'];
  if(!token) {
    return res.status(401).send({
      message: "No token provided."
    });
  }

  jwt.verify(token, config.secret, function(err, decoded) {
    if(err) {
      return res.status(500).send({
        message: "Failed to authenticate token."
      });
    }
    User.findById(decoded.id, function(err, user) {
      if(err) {
        return res.status(500).send({
          message: "There was a problem finding the user."
        });
      }
      if(!user) {
        return res.status(404).send({
          message: "No user found."
        });
      }

      Role.findOne({
        where: {id: user.role_id}
      })
      .then(roleData => {
        if(roleData == null) {
          return res.status(404);
        }
        if(roleData.isAdmin == false) {
          req.body.owner_id = decoded.id;
        }
        //invite_members here i think..
        
        const club = {
          name: req.body.name,
          owner_id:req.body.owner_id
        };
        Club.create(club)
        .then(data => {
          return res.status(200).send("Club added successfully!");
        })
        .catch(err => {
          return res.status(500).send({message: err.message});
        });
      })
      .catch(err => {
        return req.status(500).send({message: err.message});
      });
    });
  });


}

exports.update = (req, res) => {
  const id = req.params.clubId;
  var token = req.headers['x-access-token'];
  if(!token) {
    return res.status(401).send({
      message: "No token provided."
    });
  }

  jwt.verify(token, config.secret, function(err, decoded) {
    if(err) {
      return res.status(500).send({
        message: "Failed to authenticate token."
      });
    }
    User.findById(decoded.id, function(err, user) {
      if(err) {
        return res.status(500).send({
          message: "There was a problem finding the user."
        });
      }
      if(!user) {
        return res.status(404).send({
          message: "No user found."
        });
      }

      Role.findOne({
        where: {id: user.role_id}
      })
      .then(roleData => {
        if(roleData == null) {
          return res.status(404);
        }
        if(roleData.isAdmin == false && req.body.owner_id != decoded.id) {
          return res.status(403).send({message: "Permission denied."});
        }

        Club.update(req.body, {
          where: {id: id}
        })
        .then(num => {
          if(num == 1) {
            res.status(200)
          }
        })
        .catch(err => {
          return res.status(500).send({message: err.message});
        });
      })
      .catch(err => {
        return req.status(500).send({message: err.message});
      });
    });
  });
};
exports.get = (req, res) => {

};

exports.search = (req, res) => {

};


exports.delete = (req, res) => {

};

