module.exports = (sequilize, Sequilize) => {
    const ClubInvite = sequilize.define("club_invite", {
        email: {
            type: Sequilize.STRING,
            allowNull: false
        }
    });
    return ClubInvite;
}