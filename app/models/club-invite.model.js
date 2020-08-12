

module.exports = (sequelize, Sequelize) => {
    const Club = require("./club.model.js")(sequelize, Sequelize);
    const ClubInvite = sequelize.define("club_invite", {
        email: {
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
        }
    });
    return ClubInvite;
}