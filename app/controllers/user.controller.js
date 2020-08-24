const db = require("../models");
const controller = require("../middlewares/verifySignUp");
const { verifySignUp } = require("../middlewares");
const User = db.user;
const Sport = db.sport;
const Club = db.club;
const EventMember = db.eventMember;
const ClubMember = db.clubMember;
const EventInvite = db.eventInvite;
const ClubInvite = db.clubInvite;
const Promise = require("promise");
const mail = require("../utils/email.utils.js");
var bcrypt = require("bcryptjs");
const { publicDecrypt } = require("crypto");
const regexPassword = /^[^\s@]+@[^\s@]+.[^\s@]+$/;

function generatePassword() {
  var length = 8,
    charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
    retVal = "";
  for (var i = 0, n = charset.length; i < length; ++i) {
    retVal += charset.charAt(Math.floor(Math.random() * n));
  }
  return retVal;
}

function hasNumbers(t) {
  var regex = /\d/g;
  return regex.test(t);
}
/*
exports.createCoach = (req, res) => {
  var regex = /^[^\s@]+@[^\s@]+.[^\s@]+$/;
  const user = {
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email,
    password: null,
    role_id: 2
  }
  if (regex.test(user.email)) {
    let pass = generatePassword();
    mail.sendMail(user.email, "Your password", "Dear "+user.first_name+" "+user.last_name+","+" this is your password: " + pass);
    user.password = bcrypt.hashSync(pass, 8);
    User.create(user)
      .then(data => {


        Club.update({owner_id:data.id}, { where: { id: req.body.clubs } })
        .then(num => {
          if (num == 1) {
            return Club.findByPk(id);
          } else {
            return res.status(404).send({
              message: "Club not found."
            });
          }
        }
        )
        .then(data => {
          res.status(200).send(data);
        })
        .catch(err => {
          res.status(500).send({ message: err.message });
        });




        res.status(200).send(data);
      })
      .catch(err => {
        return res.status(500).send({ message: err.message });
      });
  }
  else
    return res.status(400).send({ message: "Invalid email" });
  // Club.update(where:{
  //   id:req.body.club
  // })
  //const club=req.body.clubs;
}*/
exports.create = (req, res) => {


  let f_name = req.body.first_name;
  let l_name = req.body.last_name;
  let _gender = req.body.gender;
  //let p_Sport = req.body.primarySport;
  //let s_Sport = req.body.secondarySport;
  let _height = req.body.height;
  let _weight = req.body.weight;
  let _password = req.body.password;
  let _confirm_password = req.body.confirm_password;
  let p_photo = req.body.profile_photo;
  let _age = req.body.age;
  let _email = req.body.email;
  let primary_sport_id;
  let secondary_sport_id;
  const isAdmin = req.role_id === 1;


  if (f_name != null && (hasNumbers(f_name) || f_name.length < 3))//|| f_name.trim().length != f_name.length)
  {
    return res.status(400).send({ message: "Invalid first name." });
  }

  if (l_name != null && (hasNumbers(l_name) || l_name.length < 3)) {
    return res.status(400).send({ message: "Invalid last name." });
  }
  if (_gender != null && (!(_gender === "male" || _gender === "female"))) {
    return res.status(400).send({ message: "Invalid gender." });
  }
  if (_password == null) {
    return res.status(404).send({ message: "Password not found." });
  }
  if (_confirm_password == null) {
    return res.status(404).send({ message: "Password not found." });
  }
  if (_confirm_password != _password) {
    return res.status(406).send({ message: "Password not acceptable." });

  }/*
  if (p_Sport != null) {
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
  if (s_Sport != null) {
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
  }*/
  if (_height != null && (isNaN(_height) || _height < 50 || _height > 300)) {
    return res.status(400).send({ message: "Invalid height." });
  }
  if (_weight != null && (isNaN(_weight) || _weight < 30 || _weight > 100)) {
    return res.status(400).send({ message: "Invalid weight." });
  }
  if (_age != null && (isNaN(_age) || _age < 5 || _age > 100)) {
    return res.status(400).send({ message: "Invalid age." });
  }
  if (p_photo != null && p_photo.type != "image/png" && p_photo.type != "image/jpg") {
    return res.status(400).send({ message: "Invalid image." });
  }
  User.findOne({
    where: {
      email: _email
    }
  }).then(user => {
    if (user) {
      res.status(400).send({
        message: "Failed! Email is already in use!"
      }
      );
      return;
    }
    else {
      const user = {
        first_name: f_name,
        last_name: l_name,
        email: _email,
        password: bcrypt.hashSync(_password, 8),
        confirm_password: bcrypt.hashSync(_confirm_password, 8),
        role_id: isAdmin ? req.body.role_id : 3,
        gender: _gender,
        primary_sport_id: req.body.primary_sport_id,
        secondary_sport_id: req.body.secondary_sport_id,
        height: _height,
        weight: _weight,
        age: _age,
        profile_photo: "iVBORw0KGgoAAAANSUhEUgAAAH0AAAB9CAMAAAC4XpwXAAAAq1BMVEX///+13v/Z9v9dhLh6rfCHl6dKbZzp7e/j5+qKm6p0iZv19/jk8v+x3P/Q4flspu/1+v92p+iEhITIyMigoKDo6Oje+//p7vfi4uLS8f+wsLB8fHx/sPDw8PBfX1+Pj4/L7P+YmJhzc3O9vb3C5v9tksBVeqzZ2dlra2tCQkJUVFSVpLG31uqpyOJ6nsfF4/KXudiKrNCcu9Juj7VegKlPd7A+Y5Z5mbs1YpxuLwVKAAADbklEQVRoge3abXeaMBgG4ChdbZd164IwCAsRQgc63/oyu///y/YkoC2IHmii685yfyhCgCt5EjieUxGysbGxsbGxsbE5ZUbXH4znJ+uqX11fjQzn6uOou47fVrQjsbrVrf7u9dtPWtHVBzc60da1YnWrW93qVu+vZyFkktUP3gyyiTyewacT6VmWDbJhlbDmZ+H2eKZOM6nfyAFNdsDWuZEtaqxZoyks24zokwkUumlDQJ2otsF+WyjbYB509bKoLfgwDOvbtj7o6gdv3SUTXV0HHw7N677fGQ919Wbl/eF8Mezqa+sNO1wsHWc5b+FbS2JQ9/3V+s5RWa/qFtCrxWrfN6ZDye+dXe4Wr+3h6uHxcvO0PyWGdLCXTi3Laqg+zAbQl5DN07xRfxM6AGvnl9PIr3Xow2Q8PG4UrbJ5rpdfX5clv2vSVfkXz5fN3Ie+Ob1c5YfyYw+H8j+8TL+uvm4f9lH/cW5I/3bcbudfyn9yvX34m3tV/jPo7eNXT/9ZdMdp4TfPc/9M+oHpP5feOvzf59Nbhr85o77va+vfv+pEW7/QidWt/u/pF190oqnfftaKpm4sVre61d+rbvz/76Pu+il+e3DdWbexsbGxsbGxMR0vzxlCQXsjo/Vd018CaTrmCQqm7a0Bqe0mrlk8j442e3V9bFgX43KrSorx9tN2p9R39S51/OoYPrDtliAuf/yaIswpSQXjJPJgPlxKIlLqASFpvtODMSWFlxMi+4UTQhKsTiGCw53g6nEfXsTqzjFCM4pwGgVqMqg8KiKpsyJAOPZ2+jRHbEoworAgPQFrQSBcwNl0yhCB/TE96jXizbjScYGqiUgZomoEMQOdwh2RS7e6WiiqFnF1PVEdQahgrFDbPjr0nig92ipSVxPMA7g1J0mSEL7TuWqAPzOoPExWHCGiKpOyfAanJgcen4OBua90UdNTOXbuehDcqkculg+l2oWzA8Lg1M6/oq5S7OtqrDNZVvFqHhu6l8KGRmXl2ayqfI/kFKo7lrfC6VaHztCYenkcoAC6FAnPK0fX1HHhekIu/lR4AY9lpwNP9Fh1mHIiqwyXyNWVy+VEYUG7Lk+AYPIg5Un1xLmBWubIZeUlLOFCnoLl+zKCg3CV0H8b0/4vNZZqq2/TGVQJR+Jv6ZwQg3jv9Hu929j8B/kDFRGInFZFpMAAAAAASUVORK5CYII="
        //req.body.profile_photo
      };

      User.create(user)
        .then(data => {
          console.log(data);
          return res.status(200).send(data);
        })
        .catch(err => {
          return res.status(500).send({ message: err.message });
        });
    }

  });


};

// exports.searchById = (req, res) => {
//   User.findAll({
//     where: {
//       role_id: 2,
//       id: req.params.id
//     }
//   }).
//     then(async (data) => {
//       if (data === null)
//         return res.status(404).send({ message: "Not found " });
//       else {
//         var list = [];
//         data.map(async (obj, index) => {
//           var t = {
//             id: obj.id,
//             first_name: obj.first_name,
//             last_name: obj.last_name,
//             email: obj.email,
//             _clubs: null,
//             unused_clubs:null
//           }
//           var a = await Club.findAll({ where: { owner_id: obj.id } })
//             .then((clubs) => {

//               if (clubs != null) {
//                 t._clubs = clubs.map(o => {
//                   const clubs_u={
//                     c_id:null,
//                     c_name:null
//                   }

//                   clubs_u.c_id=o.id;
//                   clubs_u.c_name=o.name;
//                   return clubs_u;
//                 });
//               }
//               return t;
//             }).catch(err => {
//               res.status(500).send({
//                 message: err.message
//               });
//             })
//           var b = await Club.findAll({ where: { owner_id: null } })
//             .then(async(data) => {

//               t.unused_clubs=await data.map(o=>{
//                 const clubs_u={
//                   c_id:null,
//                   c_name:null
//                 }

//                 clubs_u.c_id=o.id;
//                 clubs_u.c_name=o.name;
//                 return clubs_u;
//               })
//               return t;
//             })
//             .catch(err => {
//               res.status(500).send({
//                 message: err.message
//               });
//             })
//           list.push(b);
//           if (index === data.length - 1)
//             return res.status(200).send(list);
//         })
//       }
//     })
//     .catch(err => {
//       return res.status(500).send({ message: err.message });
//     })

// };


/*exports.update = (req, res) => {

  //let f_name = req.body.first_name;
  //let l_name = req.body.last_name;
  let _gender = req.body.gender;
  let p_Sport = req.body.primarySport;
  let s_Sport = req.body.secondarySport;
  let _height = req.body.height;
  let _weight = req.body.weight;
  let _age = req.body.age;
  let primary_sport_id = null;
  let secondary_sport_id = null;
  var p1 = new Promise((ress, rej) => {
    if (p_Sport != null) {
      Sport.findOne({
        where: {
          type: p_Sport
        }
      })
        .then(data => {
          if (data == null) {
            rej("");
            return res.status(404).send({
              message: "sportType not found."

            });
          } else {
            primary_sport_id = data.id;
            ress("");

          }
        })
        .catch(err => {
          return res.status(500).send({ message: err.message });
        });
    } else ress("");
  });
  var p2 = new Promise((ress, rej) => {
    if (s_Sport != null) {
      Sport.findOne({
        where: {
          type: s_Sport
        }
      })
        .then(data => {
          if (data == null) {
            rej("");
            return res.status(404).send({
              message: "sportType not found."
            });
          } else {
            secondary_sport_id = data.id;
            ress("");

          }
        })
        .catch(err => {
          return res.status(500).send({ message: err.message });
        });
    }
    else rej("");
  });

  Promise.all([p1, p2]).then(v => {
    if (_gender != null && (!(_gender === "male" || _gender === "female"))) {
      return res.status(400).send({ message: "Invalid gender." });
    }
    if (_height != null && (isNaN(_height) || _height < 150 || _height > 300)) {
      return res.status(400).send({ message: "Invalid height." });
    }
    if (_weight != null && (isNaN(_weight) || _weight < 30 || _weight > 100)) {
      return res.status(400).send({ message: "Invalid weight." });
    }
    if (_age != null && (isNaN(_age) || _age < 5 || _age > 100)) {
      return res.status(400).send({ message: "Invalid age." });
    }

    const user = {
      //first_name:f_name,
      //last_name: l_name,
      gender: _gender,
      primary_sport_id: primary_sport_id,
      secondary_sport_id: secondary_sport_id,
      height: _height,
      weight: _weight,
      age: _age
    };
    User.update(user, {
      where: {
        id: req.params.userId
      }
    })
      .then(num => {
        if (num == 1) {
          res.status(200).send({message:"User updated successfully !"});
        }
        else {
          res.status(404).send({message:"User not found."})
        }
      })

  }).catch(error => console.log(`Error in promises ${error}`))
};
*/
exports.get = (req, res) => {
  if (req.authJwt == null) {
    return res.status(403).send({ message: "Permission denied. gsdfs" });
  } else {
    User.findByPk(req.params.userId)
      .then(data => {
        return res.status(200).send(data);
      })
      .catch(err => {
        return res.status(500).send({ message: err.message });
      });
  }
};
/*
exports.deleteAll = async (req, res) => {
  const id = req.body.user_id;
console.log(id);
  await Club.update({owner_id:null}, { where: { owner_id: id } })


  User.destroy({
    where: { id: id }
  })
    .then(num => {
      console.log (num);
      if (num >=1) {

        return res.status(200).send({
          message: "User deleted successfully!"
        });
      } else {
        return res.status(404).send({
          message: "User not found."
        });
      }
    })
    .catch(err => {
      return res.status(500).send({
        message: err.message
      });
    });

  }*/
/*
exports.search = (req, res) => {
  User.findAll({
    where: {
      role_id: req.params.role_id
    }
  }).
    then(async(data) => {
      if (data === null)
        return res.status(404).send({ message: "Not found " });
      else {
        var list=[];
         data.map(async (obj,index) => {
          var t = {
            id: obj.id,
            first_name: obj.first_name,
            last_name: obj.last_name,
            email: obj.email,
            gender: obj.gender,
            age: obj.age,
            height: obj.height,
            weight: obj.weight,
            primarySport: obj.primary_sport_id,
            secondarySport: obj.secondary_sport_id,
            profile_photo: obj.profile_photo,
            // password: publicDecrypt(user.password),
            _clubs: null
          }
          var a = await Club.findAll({ where: { owner_id: obj.id } })
            .then((clubs) => {

              if (clubs != null) {
                t._clubs = clubs.map(o => {
                  return o.name;
                });
              }
              return t;
            });
           //console.log(a);
           list.push(a);
          if(index===data.length-1)
            return res.status(200).send(list) ;
        })
      }
    })
    .catch(err => {
      return res.status(500).send({ message: err.message });
    })

};*//*
exports.updateCoach = async(req, res) => {
  const clubs = req.body.clubs;
  const id = req.body.user_id;
  console.log("am ajuns");

  await Club.update({ owner_id: null }, { where: { owner_id: id } })
  await Club.update({owner_id:id}, { where: { id: clubs } })
  const user = {
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email
  };
  User.update(user, {
    where: {
      id: id
    }
  })
    .then(num => {
      if (num == 1) {
        res.status(200).send("User updated successfully !");
      }
      else {
        res.status(404).send("User not found.")
      }
    }).catch(res.status(500).send("Error"))

};*/


exports.delete = (req, res) => {
  const id = req.params.userId;
  EventMember.destroy({
    where: {
      user_id: id
    }
  })
  ClubMember.destroy({
    where: {
      user_id: id
    }
  })
  User.findByPk(id)
    .then(
      user => {
        EventInvite.destroy({
          where: {
            email: user.email
          }
        })
        ClubInvite.destroy({
          where: {
            email: user.email
          }
        })
      }
    )
  User.destroy({
    where: {
      id: id
    }
  })
    .then(num => {
      if (num == 1) {

        return res.status(200).send({
          message: "User deleted successfully!"
        });
      } else {
        return res.status(404).send({
          message: "User not found."
        });
      }
    })
    .catch(err => {
      return res.status(500).send({
        message: err.message
      });
    });
};
/*
exports.delete = function (req, resp, reqBody) { 

  try {
      if (!reqBody) throw new Error("Input is nod valid");
      var data = JSON.parse(reqBody);
      if (data) {
          if (!data.idRegisterIssueContract) throw new Error("No such number");
          var sql = "DELETE FROM registerissuecontract ";
          sql += " WHERE idRegisterIssueContract =" + data.idRegisterIssueContract;
          db.executeSQL(sql, function (data, err) {
              if (err) {
                  httpMsgs.show500(req, resp, err);
              }
              else {
                  httpMsgs.send200(req, resp);
              }
  
          });
      }
      else {
          throw new Error("Input is nod valid");
      }
  }
  catch (ex) {
      httpMsgs.show500(req, resp, ex);
  }
  };*/
///////////////////////////////////////////////////////////////



//search a user by role_id and return 
//an object with data about users and an array with clubs(for coaches) 
exports.search = (req, res) => {
  User.findAll({
    where: {
      role_id: req.params.role_id
    }
  }).
    then(async (data) => {
      if (data === null)
        return res.status(404).send({ message: "Not found " });
      else {
        var list = [];
        data.map(async (obj, index) => {
          var t = {
            id: obj.id,
            first_name: obj.first_name,
            last_name: obj.last_name,
            email: obj.email,
            gender: obj.gender,
            age: obj.age,
            height: obj.height,
            weight: obj.weight,
            primarySport: obj.primary_sport_id,
            secondarySport: obj.secondary_sport_id,
            profile_photo: obj.profile_photo,
            // password: publicDecrypt(user.password),
            _clubs: null
          }
          var a = await Club.findAll({ where: { owner_id: obj.id } })
            .then((clubs) => {
              if (clubs != null) {
                t._clubs = clubs.map(o => {
                  const c = {
                    c_id: o.id,
                    c_name: o.name
                  }
                  return c;
                });
              }
              return t;
            });
          list.push(a);
          if (index === data.length - 1)
            return res.status(200).send(list);
        })
      }
    })
    .catch(err => {
      return res.status(500).send({ message: err.message });
    })
};

//create a coach and send his password on email
exports.createCoach = async (req, res) => {
  var f_name = req.body.first_name;
  var l_name = req.body.last_name;
  var _email = req.body.email;
  if (!regexPassword.test(_email)) {
    return res.status(400).send({ message: "Invalid email" });
  }
  else {
    await User.findOne({ where: { email: _email } })
      .then(data => {
        if (data != null)
          _email = null;
        return;
      })
  }
  if (_email === null) {
    return res.status(400).send({ message: "Email already exist." });
  }
  if (f_name != null && (hasNumbers(f_name) || f_name.length < 3)) {
    return res.status(400).send({ message: "Invalid first name." });
  }
  if (l_name != null && (hasNumbers(l_name) || l_name.length < 3)) {
    return res.status(400).send({ message: "Invalid last name." });
  }
  const user = {
    first_name: f_name,
    last_name: l_name,
    email: _email,
    password: null,
    role_id: 2
  }
  let pass = generatePassword();
  mail.sendMail(user.email, "Your password", "Dear " + user.first_name + " " + user.last_name + "," + " this is your password: " + pass);
  user.password = bcrypt.hashSync(pass, 8);
  User.create(user)
    .then(data => {
      Club.update({ owner_id: data.id }, { where: { id: req.body.clubs } })
        .then(num => {
          if (num == 1) {
            return Club.findByPk(id);
          } else {
            return res.status(404).send({
              message: "Club not found."
            });
          }
        })
        .then(data => {
          res.status(200).send(data);
        })
        .catch(err => {
          res.status(500).send({ message: err.message });
        });
      res.status(200).send(data);
    })
    .catch(err => {
      return res.status(500).send({ message: err.message });
    });

}
// delete all users with role_id=2(coach)=>owner_id (clubs)=null
exports.deleteAll = async (req, res) => {
  const id = req.body.user_id;
  await Club.update({ owner_id: null }, { where: { owner_id: id } })
  User.destroy({
    where: {
      id: id,
      role_id: 2
    }
  })
    .then(num => {
      if (num >= 1) {
        return res.status(200).send({ message: "Deleted successfully!" });
      } else {
        return res.status(404).send({ message: "Coach not found." });
      }
    })
    .catch(err => {
      return res.status(500).send({ message: err.message });
    });
}

//update a coach and his clubs
exports.updateCoach = async (req, res) => {
  const clubs = req.body.clubs;
  const id = req.body.user_id;

  var f_name = req.body.first_name;
  var l_name = req.body.last_name;
  var _email = req.body.email;

  if (!regexPassword.test(_email)) {
    return res.status(400).send({ message: "Invalid email" });
  }
  else {
    await User.findOne({ where: { email: _email } })
      .then(data => {
        if (data != null && data.id != id) {
          _email = null;
        }
        return;
      })
  }
  if (_email === null) {
    return res.status(400).send({ message: "Email already exist." });
  }
  if (f_name != null && (hasNumbers(f_name) || f_name.length < 3)) {
    return res.status(400).send({ message: "Invalid first name." });
  }
  if (l_name != null && (hasNumbers(l_name) || l_name.length < 3)) {
    return res.status(400).send({ message: "Invalid last name." });
  }
  const user = {
    first_name: f_name,
    last_name: l_name,
    email: _email
  };
  await User.update(user, {
    where: {
      id: id
    }
  })
    .then(num => {
      if (num == 1) {
        res.status(200).send("User updated successfully !");
      }
      else {
        res.status(404).send("User not found.")
      }
    }).catch(error => console.log(`Error in promises ${error}`))

  await Club.update({ owner_id: null }, { where: { owner_id: id } })
  await Club.update({ owner_id: id }, { where: { id: clubs } })

};

//after register we need to add data about athlete
exports.update = (req, res) => {
  let _gender = req.body.gender;
  let p_Sport = req.body.primarySport;
  let s_Sport = req.body.secondarySport;
  let _height = req.body.height;
  let _weight = req.body.weight;
  let _age = req.body.age;
  let primary_sport_id = null;
  let secondary_sport_id = null;
  var p1 = new Promise((ress, rej) => {
    if (p_Sport != null) {
      Sport.findOne({
        where: {
          type: p_Sport
        }
      })
        .then(data => {
          if (data == null) {
            rej("");
            return res.status(404).send({
              message: "sportType not found."

            });
          } else {
            primary_sport_id = data.id;
            ress("");

          }
        })
        .catch(err => {
          return res.status(500).send({ message: err.message });
        });
    } else ress("");
  });
  var p2 = new Promise((ress, rej) => {
    if (s_Sport != null) {
      Sport.findOne({
        where: {
          type: s_Sport
        }
      })
        .then(data => {
          if (data == null) {
            rej("");
            return res.status(404).send({
              message: "sportType not found."
            });
          } else {
            secondary_sport_id = data.id;
            ress("");

          }
        })
        .catch(err => {
          return res.status(500).send({ message: err.message });
        });
    }
    else rej("");
  });
  Promise.all([p1, p2]).then(v => {
    if (_gender != null && (!(_gender === "male" || _gender === "female"))) {
      return res.status(400).send({ message: "Invalid gender." });
    }
    if (_height != null && (isNaN(_height) || _height < 150 || _height > 300)) {
      return res.status(400).send({ message: "Invalid height." });
    }
    if (_weight != null && (isNaN(_weight) || _weight < 30 || _weight > 100)) {
      return res.status(400).send({ message: "Invalid weight." });
    }
    if (_age != null && (isNaN(_age) || _age < 5 || _age > 100)) {
      return res.status(400).send({ message: "Invalid age." });
    }
    const user = {
      gender: _gender,
      primary_sport_id: primary_sport_id,
      secondary_sport_id: secondary_sport_id,
      height: _height,
      weight: _weight,
      age: _age
    };
    User.update(user, {
      where: {
        id: req.params.userId
      }
    })
      .then(num => {
        if (num == 1) {
          res.status(200).send({ message: "User updated successfully !" });
        }
        else {
          res.status(404).send({ message: "User not found." })
        }
      })
  }).catch(error => console.log(`Error in promises ${error}`))
};
exports.updateAthlete = (req, res) => {
  let f_name = req.body.first_name;
  let l_name = req.body.last_name;
  let _gender = req.body.gender;
  let p_Sport = req.body.primarySport;
  let s_Sport = req.body.secondarySport;
  let _height = req.body.height;
  let _weight = req.body.weight;
  let _age = req.body.age;
  let primary_sport_id = null;
  let secondary_sport_id = null;
  var p1 = new Promise((ress, rej) => {
    if (p_Sport != null) {
      Sport.findOne({
        where: {
          type: p_Sport
        }
      })
        .then(data => {
          if (data == null) {
            rej("");
            return res.status(404).send({
              message: "sportType not found."

            });
          } else {
            primary_sport_id = data.id;
            ress("");

          }
        })
        .catch(err => {
          return res.status(500).send({ message: err.message });
        });
    } else ress("");
  });
  var p2 = new Promise((ress, rej) => {
    if (s_Sport != null) {
      Sport.findOne({
        where: {
          type: s_Sport
        }
      })
        .then(data => {
          if (data == null) {
            rej("");
            return res.status(404).send({
              message: "sportType not found."
            });
          } else {
            secondary_sport_id = data.id;
            ress("");

          }
        })
        .catch(err => {
          return res.status(500).send({ message: err.message });
        });
    }
    else rej("");
  });
  Promise.all([p1, p2]).then(v => {
    if (_gender != null && (!(_gender === "male" || _gender === "female"))) {
      return res.status(400).send({ message: "Invalid gender." });
    }
    if (_height != null && (isNaN(_height) || _height < 150 || _height > 300)) {
      return res.status(400).send({ message: "Invalid height." });
    }
    if (_weight != null && (isNaN(_weight) || _weight < 30 || _weight > 100)) {
      return res.status(400).send({ message: "Invalid weight." });
    }
    if (_age != null && (isNaN(_age) || _age < 5 || _age > 100)) {
      return res.status(400).send({ message: "Invalid age." });
    }
    const user = {
      first_name: f_name,
      last_name: l_name,
      gender: _gender,
      primary_sport_id: primary_sport_id,
      secondary_sport_id: secondary_sport_id,
      height: _height,
      weight: _weight,
      age: _age
    };
    User.update(user, {
      where: {
        id: req.params.userId
      }
    })
      .then(num => {
        if (num == 1) {
          res.status(200).send({ message: "User updated successfully !" });
        }
        else {
          res.status(404).send({ message: "User not found." })
        }
      })
  }).catch(error => console.log(`Error in promises ${error}`))
};


// search a coach by id and return an objec with data about coach 
//and 2 arrays with clubs
exports.searchById = (req, res) => {
  User.findOne({
    where: {
      role_id: 2,
      id: req.params.id
    }
  }).
    then(async (data) => {
      if (data === null)
        return res.status(404).send({ message: "Not found " });
      else {
        var t = {
          id: data.id,
          first_name: data.first_name,
          last_name: data.last_name,
          email: data.email,
          _clubs: null,
          unused_clubs: null
        }
        await Club.findAll({ where: { owner_id: data.id } })
          .then((clubs) => {
            if (clubs != null) {
              t._clubs = clubs.map(o => {
                const clubs_u = {
                  c_id: null,
                  c_name: null
                }
                clubs_u.c_id = o.id;
                clubs_u.c_name = o.name;
                return clubs_u;
              });
            }
            return t;
          }).catch(err => { res.status(500).send({ message: err.messag }) })
        await Club.findAll({ where: { owner_id: null } })
          .then(async (data) => {
            if (data != null) {
              t.unused_clubs = await data.map(o => {
                const clubs_u = {
                  c_id: null,
                  c_name: null
                }
                clubs_u.c_id = o.id;
                clubs_u.c_name = o.name;
                return clubs_u;
              })
            }
            return t;
          })
          .catch(err => { res.status(500).send({ message: err.message }) })
        return res.status(200).send(t);
      }
    })
    .catch(err => {
      return res.status(500).send({ message: err.message });
    })
};
//return all coaches
exports.allCoaches = ((req, res) => {
  User.findAll({ where: { role_id: 2 } })
    .then(data => {
      var list = data.map(o => {
        const obj = {
          coach_id: o.id,
          last_name: o.last_name,
          first_name: o.first_name
        }
        return obj
      })
      return res.status(200).send(list)
    }).catch(err => {
      return res.status(500).send({ message: err.message });
    })
})