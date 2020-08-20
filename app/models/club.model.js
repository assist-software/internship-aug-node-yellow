const { sport } = require("./index.js");

module.exports = (sequelize, Sequelize) => {
    const User = require("./user.model.js")(sequelize, Sequelize);
    const Sport = require("./sport.model.js")(sequelize, Sequelize);
    const Club = sequelize.define("club", {
        name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        owner_id: {
            type: Sequelize.INTEGER,
            references: {
                model: User,
                key: 'id'
            },
            allowNull: true
        },
        sport_id:{
            type:Sequelize.INTEGER,
            references:{
                model:Sport,
                key:'id'
            },
            allowNull:false
        }
    });
    return Club;
}