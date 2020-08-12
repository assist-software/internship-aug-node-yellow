const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('sqlite::memory:');
module.exports = (sequelize, Sequelize) => {

    const Event = require("./event.model.js")(sequelize, Sequelize);
    const User = require("./user.model.js")(sequelize, Sequelize);
    const Workout = sequelize.define('workout', {
        user_id:{
            type: DataTypes.INTEGER,
            allowNull:false,
            references:{
                model:User,
                key:'id'
            }
        },
        duration: {
            type: DataTypes.DOUBLE,
            allowNull: false
        },
        hearth_rate: {
            type: DataTypes.DOUBLE,
            allowNull: false
        },
        calories: {
            type: DataTypes.DOUBLE,
            allowNull: false
        },
        avg_speed: {
            type: DataTypes.DOUBLE,
            allowNull: false
        },
        distance: {
            type: DataTypes.DOUBLE,
            allowNull: false
        },
        workout_effectiveness: {
            type: DataTypes.STRING,
            allowNull: false
        },
        event_id:{
            type: DataTypes.INTEGER,
            allowNull:false,
            references:{
                model:Event,
                key:'id'
            }
        },


    });
    return Workout;
}