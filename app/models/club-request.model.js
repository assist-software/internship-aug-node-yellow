module.exports = (sequelize, Sequelize) => {
    const User = require("./user.model.js")(sequelize, Sequelize);
    const Club = require("./club.model.js")(sequelize, Sequelize);
    const ClubRequest = sequelize.define("club_request", {
        user_id: {
          type: Sequelize.INTEGER,
          references: {
              model: User,
              key: 'id'
          },
          allowNull: false
        },
        club_id: {
            type: Sequelize.INTEGER,
            references: {
                model: Club,
                key: 'id'
            },
            allowNull: false
        }
    });
    return ClubRequest;
}