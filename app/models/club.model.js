const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('sqlite::memory:');

module.exports = (sequelize, Sequelize) => {
    const User = require("./user.model.js")(sequelize, Sequelize);
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
