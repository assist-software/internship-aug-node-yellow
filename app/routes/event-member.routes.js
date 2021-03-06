module.exports = app => {
    const event_members = require("../controllers/event-member.controller.js");
  
    var router = require("express").Router();
  
    router.post("/create", event_members.create);
  
    router.delete("/remove/:inviteId", event_members.remove);
  
    router.get("/:eventId", event_members.list);
  
    app.use('/api/event/member', router);
  }
  