module.exports = (sequilize, Sequilize) => {
    const Event = sequilize.define("event", {
        name: {
            type: Sequilize.STRING,
            allowNull: false
        },
        date: {
            type: Sequilize.DATE,
            allowNull: false
        },
        time: {
            type: Sequilize.TIME,
            allowNull: false
        },
        description: {
            type: Sequilize.TEXT,
            allowNull: false
        },
        location: {
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
        },
        radius: {
            type: Sequilize.INTEGER,
            allowNull: false
        },
        sport_type_id: {
            type: Sequilize.INTEGER,
            references: {
                model: Sport,
                key: 'id'
            },
            allowNull: false
        },
        event_cover: {
            type: Sequilize.BLOB,
            allowNull: false
        }
    });
    //Event.belongsTo(Club);
    //Event.belongsTo(Sport);
    return Event;
}