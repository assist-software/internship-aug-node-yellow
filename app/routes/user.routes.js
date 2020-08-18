module.exports = app => {
    const users = require("../controllers/user.controller.js");

    var router = require("express").Router();

    router.post("/create", users.create);

    router.put("/:userId", users.update);

    router.get("/:userId", users.get);

    router.post("/search", users.search);

    router.delete("/:userId", users.delete);

    app.use('/api/user', router);
}