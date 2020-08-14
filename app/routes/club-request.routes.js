module.exports = (app) => {
    const club_requests = require("../controllers/club-request.controller.js");

    var router = require("express").Router();

    router.post("/create", club_requests.create);

    router.post("/accept/:requestId", club_requests.accept);

    router.delete("/decline/:requestId", club_requests.decline);

    router.get("/:clubId", club_requests.list);

    app.use('/api/club/request', router);
}