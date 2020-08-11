const { USER } = require("../config/db.config");

module.exports = (sequilize, Sequilize) => {
    const Club = sequilize.define("club", {
        name: {
            type: Sequilize.STRING,
            allowNull: false
        },
        owner_id: {
            type: Sequilize.INTEGER,
            references: {
                model: User,
                key: 'id'
            }
        }
    });
    return Club;
}