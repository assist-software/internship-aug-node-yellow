module.exports = (app) => {
    const event_invites = require("../controllers/event-invite.controller.js");

    var router = require("express").Router();

    router.post("/create", event_invites.create);

    router.post("/accept/:inviteId", event_invites.accept);

    router.delete("/decline/:inviteId", event_invites.decline);

    router.get("/:eventId", event_invites.list);

    app.use('/api/event/invite', router);
}