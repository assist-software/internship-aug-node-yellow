module.exports = (sequilize, Sequilize) => {
    const ClubRequest = sequilize.define("club_request", { //cu _ sau fara?
        user_id: {
          type: Sequilize.INTEGER,
          references: {
              model: User,
              key: 'id'
          },
          allowNull: false
        },
        club_id: {
            type: Sequilize.INTEGER,
            references: {
                model: Club,
                key: 'id'
            },
            allowNull: false
        }
    });
    return ClubRequest;
}