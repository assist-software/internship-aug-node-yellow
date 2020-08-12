module.exports = (sequelize, Sequelize) => {
    const ClubRequest = sequelize.define("club_request", { //cu _ sau fara?
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