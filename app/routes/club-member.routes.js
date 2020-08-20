module.exports = app => {
  const club_members = require("../controllers/club-member.controller.js");

  var router = require("express").Router();

  router.post("/create", club_members.create);

  router.delete("/remove/:inviteId", club_members.remove);

  router.get("/:clubId", club_members.list);

  app.use('/api/club/member', router);
};
