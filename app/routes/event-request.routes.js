module.exports = app => {
    const event_requests = require("../controllers/event-request.controller.js");

    var router = require("express").Router();

    router.post("/create", event_requests.create);

    router.post("/accept/:requestId", event_requests.accept);

    router.delete("/decline/:requestId", event_requests.decline);

    router.get("/:eventId", event_requests.list);

    app.use('/api/event/request', router);
}