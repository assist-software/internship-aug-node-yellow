module.exports = app => {
    const clubs = required("../controllers/club.controller.js");

    var router = require("express").Router();

    router.post("/create", clubs.create);

    router.post("/search", clubs.search);

    router.get("/:clubId", clubs.get);

    router.put("/:clubId", clubs.update);

    router.delete("/:clubId", clubs.delete);

    app.use('api/club', router);
}