module.exports = (app) => {
    const sport = require("../controllers/sport.controller.js");

    var router = require("express").Router();

    router.get("/all", sport.list);

    app.use('/api/sport', router);
};