module.exports = app => {
    const users = require("../controllers/user.controller.js");

    var router = require("express").Router();

    router.post("/create", users.create);

    router.post("/create/coach", users.createCoach);

    router.put("/update/:userId", users.update);

    router.put("/update/coach/up", users.updateCoach);

    router.get("/:userId", users.get);

    router.get("/search/:role_id", users.search);
    
    router.get("/search/byid/:id", users.searchById);

    router.post("/create/coach", users.createCoach);

    router.delete("/delete/all", users.deleteAll);

    router.delete("/:userId", users.delete);

    router.post("/delete/all", users.deleteAll);

    router.get("/search/byid/:id", users.searchById);

    app.use('/api/user', router);
}