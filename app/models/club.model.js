const { USER } = require("../config/db.config");

module.exports = (sequelize, Sequelize) => {
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
            }
        }
    });
    return Club;
}