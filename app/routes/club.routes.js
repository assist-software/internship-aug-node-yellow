module.exports = app => {
    const clubs = require("../controllers/club.controller.js");

    var router = require("express").Router();

    router.post("/create", clubs.create);

    router.post("/search/sport_id", clubs.search);

    router.get("/:clubId", clubs.get);
    
    router.get("/", clubs.list);

    router.put("/:clubId", clubs.update);

    router.delete("/:clubId", clubs.delete);

    router.get("/owner/null",clubs.listClubsOwnerNull);

    app.use('/api/club', router);
};