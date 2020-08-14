module.exports = app => {
    const club_invites = require("../controllers/club-invites.controller.js");
  
    var router = require("express").Router();
  
    router.post("/create", club_invites.create);

    router.post("/accept/:inviteId", club_invites.create);
  
    router.delete("/decline/:inviteId", club_invites.remove);
  
    router.get("/:clubId", club_invites.list);

    app.use('/api/club/invite', router);
}