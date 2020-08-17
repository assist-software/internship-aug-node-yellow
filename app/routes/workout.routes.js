module.exports = (app) => {
    const workouts = require("../controllers/workout.controller.js");

    var router = require("express").Router();

    router.post("/create", workouts.create);

    router.post("/search", workouts.search);

    router.get("/:workoutId", workouts.get);

    router.put("/:workoutId", workouts.update)

    router.delete("/:workoutId", workouts.delete);

    app.use('/api/workout', router);
}