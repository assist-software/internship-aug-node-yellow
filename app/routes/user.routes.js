module.exports = app => {
    const users = require("../controllers/user.controller.js");

    var router = require("express").Router();

    router.post("/create", users.create);

    router.put("/update/:userId", users.update);

    router.get("/:userId", users.get);

    router.get("/search/:role_id", users.search);
    //router.get("/search/:roleId", users.search);


    router.delete("/:userId", users.delete);

    app.use('/api/user', router);
}