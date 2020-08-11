module.exports = (sequilize, Sequilize) => {
    const ClubInvite = sequilize.define("club_invite", {
        email: {
            type: Sequilize.STRING,
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
    return ClubInvite;
}