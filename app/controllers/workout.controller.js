const db = require("../models");
const Workout = db.workout;
const Event = db.event;
const Op = require("sequelize");

exports.create = (req, res) => {
  //Check if event exists
  const event_id = req.body.eventId;
  Event.findByPk(event_id)
  .then(eventData => {
      if(eventData == null) {
          res.status(404).send({
              message: "Event not found."
          });
      }
  })
  .check(err => {
      res.status(500).send({
          message: err.message
      });
  });

  //Validate duration
  const duration = req.body.duration;
  if(isNaN(duration) || duration < 0) {
      res.status(400).send({
          message: "Invalid duration."
      });
  }

  //Validate heart_rate
  const heart_rate = req.body.heart_rate;
  if(isNaN(heart_rate) || heart_rate < 0) {
      res.status(400).send({
          message: "Invalid heart rate."
      });
  }

  //Validate calories
  const calories = req.body.calories;
  if(isNaN(calories) || calories < 0) {
      res.status(400).send({
          message: "Invalid calories."
      });
  }

  //Validate avg_speed
  const avg_speed = req.body.avg_speed;
  if(isNaN(avg_speed) || avg_speed < 0) {
      res.status(400).send({
          message: "Invalid avg speed."
      });
  }

  //Validate distance
  const distance = req.body.distance;
  if(isNaN(distance) || distance < 0) {
      res.status(400).send({
          message: "Invalid distance."
      });
  }

  //Validate workout_effectiveness
  const workout_effectiveness = req.body.workout_effectiveness.trim();
  if(workout_effectiveness.length < 3) {
    res.status(400).send({
        message: "Invalid workout effectiveness."
    });
  }

  //Create new entry in Workout
  const workout = {
    user_id: req.authJwt.user_id,
    duration: duration,
    hearth_rate: heart_rate,
    calories: calories,
    avg_speed: avg_speed,
    distance: distance,
    workout_effectiveness: workout_effectiveness,
    event_id: event_id
  };

  Workout.create(workout)
  .then(data => {
      res.status(200).send(data);
  })
  .catch(err => {
      res.status(500).send({
          message: err.message
      });
  });
};

exports.update = (req, res) => {
   //Check if event exists
   const event_id = req.body.eventId;
   Event.findByPk(event_id)
   .then(eventData => {
       if(eventData == null) {
           res.status(404).send({
               message: "Event not found."
           });
       }
   })
   .check(err => {
       res.status(500).send({
           message: err.message
       });
   });
 
   //Validate duration
   const duration = req.body.duration;
   if(isNaN(duration) || duration < 0) {
       res.status(400).send({
           message: "Invalid duration."
       });
   }
 
   //Validate heart_rate
   const heart_rate = req.body.heart_rate;
   if(isNaN(heart_rate) || heart_rate < 0) {
       res.status(400).send({
           message: "Invalid heart rate."
       });
   }
 
   //Validate calories
   const calories = req.body.calories;
   if(isNaN(calories) || calories < 0) {
       res.status(400).send({
           message: "Invalid calories."
       });
   }
 
   //Validate avg_speed
   const avg_speed = req.body.avg_speed;
   if(isNaN(avg_speed) || avg_speed < 0) {
       res.status(400).send({
           message: "Invalid avg speed."
       });
   }
 
   //Validate distance
   const distance = req.body.distance;
   if(isNaN(distance) || distance < 0) {
       res.status(400).send({
           message: "Invalid distance."
       });
   }
 
   //Validate workout_effectiveness
   const workout_effectiveness = req.body.workout_effectiveness.trim();
   if(workout_effectiveness.length < 3) {
     res.status(400).send({
         message: "Invalid workout effectiveness."
     });
   }
 
   //Update workout
   const workout = {
     user_id: req.authJwt.user_id,
     duration: duration,
     hearth_rate: heart_rate,
     calories: calories,
     avg_speed: avg_speed,
     distance: distance,
     workout_effectiveness: workout_effectiveness,
     event_id: event_id
   };
   
   Workout.update(workout, { where: { id: req.params.workoutId } })
   .then(num => {
     if(num == 1) {
        return Workout.findByPk(req.params.workoutId);
     } else {
       res.status(404).send({
           message: "Workout not found"
       });
     }
   })
   .then(data => {
       res.status(200).send(data);
   })
   .catch(err => {
       res.status(500).send({
           message: err.message
       });
   });
};

exports.get = (req, res) => {
  Workout.findByPk(req.params.workoutId)
  .then(data => {
      if(data == null) {
          res.status(404).send({
              message: "Workout not found."
          });
      }
      res.status(200).send(data);
  })
  .catch(err => {
      res.status(500).send({
          message: err.message
      });
  });
};

exports.search = (req, res) => {
  Workout.findAll({
      where: {
          workout_effectiveness: {
            [Op.ilike]: `%${req.body.workout_effectiveness}%`
          }
      }
  })
  .then(data => {
      res.status(200).send(data);
  })
  .catch(err => {
      res.status(500).send({
          message: err.message
      });
  });
};

exports.delete = (req, res) => {
  Workout.destroy({
      where: {id: req.params.workoutId}
  })
  .then(num => {
      if(num == 1) {
          res.status(200).send({
              message: "Workout deleted successfully!"
          });
      } else {
          res.status(404).send({
              message: "Workout not found."
          });
      }
  })
  .catch(err => {
      res.status(500).send({
          message: err.message
      });
  });
};