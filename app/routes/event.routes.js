module.exports = app => {
    const events = require("../controllers/event.controller.js");

    var router = require("express").Router();

    router.post("/create", events.create);

    router.post("/search", events.search);

    router.get("/:eventId", events.get);

    router.get("/all/:club_id", events.getAll);
    
    router.get("/", events.list);

    router.put("/:eventId", events.update);

    router.delete("/:eventId", events.delete);

    app.use('/api/event', router);
};