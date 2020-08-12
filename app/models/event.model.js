
module.exports = (sequelize, Sequelize) => {
    const Club = require("./club.model.js")(sequelize, Sequelize);
    const Sport = require("./sport.model.js")(sequelize, Sequelize);
    const Event = sequelize.define("event", {
        name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        date: {
            type: Sequelize.DATE,
            allowNull: false
        },
        time: {
            type: Sequelize.TIME,
            allowNull: false
        },
        description: {
            type: Sequelize.TEXT,
            allowNull: false
        },
        location: {
            type: Sequelize.STRING,
            allowNull: false
        },
        club_id: {
            type: Sequelize.INTEGER,
            references: {
                model: Club,
                key: 'id'
            },
            allowNull: false
        },
        radius: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        sport_type_id: {
            type: Sequelize.INTEGER,
            references: {
                model: Sport,
                key: 'id'
            },
            allowNull: false
        },
        event_cover: {
            type: Sequelize.BLOB,
            allowNull: false
        }
    });
    return Event;
}