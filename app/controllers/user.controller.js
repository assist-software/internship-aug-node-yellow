  const db = require("../models");



  const User= db.user;
  const Sport = db.sport;

  function hasNumbers(t)
  {
  var regex = /\d/g;
  return regex.test(t);
  }  
  exports.create = (req, res) => {


let f_name = req.body.first_name;
let l_name = req.body.last_name;
let _gender = req.body.gender;
let p_Sport = req.body.primarySport;
let s_Sport = req.body.secondarySport;
let _height = req.body.height;
let _weight = req.body.weight;
let password = req.body.password;
let confirm_password = req.body.confirm_password;

let _age = req.body.age;
let primary_sport_id;
let secondary_sport_id;



if(f_name != null && (hasNumbers(f_name) || f_name.length < 3 ))//|| f_name.trim().length != f_name.length)
{
return res.status(400).send({  message: "Invalid first name."});
}

if(l_name != null && (hasNumbers(l_name) || l_name.length < 3 ))
{
return res.status(400).send({  message: "Invalid last name."});
}
if(_gender != null && (!(_gender === "male" || _gender === "female")))
{
  return res.status(400).send({  message: "Invalid gender."});
}
if(password == null)
{
  return res.status(404).send({  message: "Password not found."});
}
if(confirm_password == null)
{
  return res.status(404).send({  message: "Password not found."});
}
if(confirm_password != password)
{
  return res.status(406).send({  message: "Password not acceptable."});

}
if(p_Sport != null)
{
  Sport.findOne({
    where: {
        type: p_Sport
    }
})
    .then(data => {
        if (data == null) {
            return res.status(404).send({
                message: "sportType not found."
            });
        } else {
            primary_sport_id = data.id;
        }
    })
    .catch(err => {
        return res.status(500).send({ message: err.message });
    });
  }
  if(s_Sport != null)
  {
    Sport.findOne({
      where: {
          type: s_Sport
      }
  })
      .then(data => {
          if (data == null) {
              return res.status(404).send({
                  message: "sportType not found."
              });
          } else {
              secondary_sport_id = data.id;
          }
      })
      .catch(err => {
          return res.status(500).send({ message: err.message });
      });
    }
if(_height != null && ( isNaN(_height) || _height<150 || _height >300))
{
  return res.status(400).send({  message: "Invalid height."});
}
if(_weight != null && (isNaN(_weight) || _weight <30 || _weight > 100))
{
  return res.status(400).send({  message: "Invalid weight."});
}
if(_age != null && (isNaN(_age) || _age < 5 || _age > 100))
{
  return res.status(400).send({  message: "Invalid age."});
}

const user = {
 first_name: f_name,
 last_name: l_name,
 email: req.body.email,
 password: req.body.password,
 confirm_password: req.body.confirm_password,
 role_id: req.body.role,
 gender: _gender,
 primarySport: p_Sport,
 secondarySport: s_Sport,
 height: _height,
 weight: _weight,
 age: _age,
 profile_photo: req.body.profile_photo
        };

         User.create(user)
          .then(data => {
            
            return res.status(200).send(data);
          })
         .catch(err => {
            return res.status(500).send({message: err.message});
          });
       
  }
  
  exports.update = (req, res) => {
    
let f_name = req.body.first_name;
let l_name = req.body.last_name;
let _gender = req.body.gender;
let p_Sport = req.body.primarySport;
let s_Sport = req.body.secondarySport;
let _height = req.body.height;
let _weight = req.body.weight;
let password = req.body.password;
let confirm_password = req.body.confirm_password;

let _age = req.body.age;
let primary_sport_id;
let secondary_sport_id;



if(f_name != null && (hasNumbers(f_name) || f_name.length < 3 ))//|| f_name.trim().length != f_name.length)
{
return res.status(400).send({  message: "Invalid first name."});
}

if(l_name != null && (hasNumbers(l_name) || l_name.length < 3 ))
{
return res.status(400).send({  message: "Invalid last name."});
}
if(_gender != null && (!(_gender === "male" || _gender === "female")))
{
  return res.status(400).send({  message: "Invalid gender."});
}
if(password == null)
{
  return res.status(404).send({  message: "Password not found."});
}
if(confirm_password == null)
{
  return res.status(404).send({  message: "Password not found."});
}
if(confirm_password != password)
{
  return res.status(406).send({  message: "Password not acceptable."});

}
if(p_Sport != null)
{
  Sport.findOne({
    where: {
        type: p_Sport
    }
})
    .then(data => {
        if (data == null) {
            return res.status(404).send({
                message: "sportType not found."
            });
        } else {
            primary_sport_id = data.id;
        }
    })
    .catch(err => {
        return res.status(500).send({ message: err.message });
    });
  }
  if(s_Sport != null)
  {
    Sport.findOne({
      where: {
          type: s_Sport
      }
  })
      .then(data => {
          if (data == null) {
              return res.status(404).send({
                  message: "sportType not found."
              });
          } else {
              secondary_sport_id = data.id;
          }
      })
      .catch(err => {
          return res.status(500).send({ message: err.message });
      });
    }
if(_height != null && ( isNaN(_height) || _height<150 || _height >300))
{
  return res.status(400).send({  message: "Invalid height."});
}
if(_weight != null && (isNaN(_weight) || _weight <30 || _weight > 100))
{
  return res.status(400).send({  message: "Invalid weight."});
}
if(_age != null && (isNaN(_age) || _age < 5 || _age > 100))
{
  return res.status(400).send({  message: "Invalid age."});
}

const user = {
 first_name: f_name,
 last_name: l_name,
 email: req.body.email,
 password: req.body.password,
 confirm_password: req.body.confirm_password,
 role_id: req.body.role,
 gender: _gender,
 primarySport: p_Sport,
 secondarySport: s_Sport,
 height: _height,
 weight: _weight,
 age: _age,
 profile_photo: req.body.profile_photo
        };
User.update(user,{
  where:{
    id: req.params.userId
  }
})
.then(num=>{
  if(num == 1)
  {
    res.status(200).send("User updated successfully !");
  }
  else
  {
    res.status(404).send("User not found.")
  }
})
  };/*
  exports.get = (req, res) => {
    if(req.session.user == null) {
      return res.status(403).send({message: "Permission denied."});
    } else {
      Club.findByPk(req.params.clubId)
      .then(data => {
        return res.status(200).send(data);
      })
      .catch(err => {
        return res.status(500).send({message: err.message});
      });
    }
  };
  
  exports.search = (req, res) => {
    if(req.session.user == null) {
      return res.status(403).send({message: "Permission denied."});
    } else {
      Club.findAll({
        where: {
          name: {
            [Op.ilike]: req.body.name
          },
          owner_id: {
            [Op.ilike]: req.body.ownerId
          }
        }
      }).
      then(data => {
        return res.status(200).send(data);
      })
      .catch(err => {
        return res.status(500).send({message: err.message});
      })
    }
  };
  
  
  exports.delete = (req, res) => {
    const id = req.params.clubId;
  
    Club.destroy({
      where: {id: id}
    })
    .then(num => {
      if(num == 1) {
        return res.status(200).send({
          message: "Club deleted successfully!"
        });
      } else {
        return res.status(404).send({
          message: "Club not found."
        });
      }
    })
    .catch(err => {
      return res.status(500).send({
        message: err.message
      });
    });
  };
  */
 