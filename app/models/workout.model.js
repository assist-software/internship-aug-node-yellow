const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('sqlite::memory:');

const Workout=sequelize.define('workout',{
    duration:{
        type: DataTypes.DOUBLE,
        allowNull:false
    },
    hearth_rate:{
        type: DataTypes.DOUBLE,
        allowNull:false
    },
    calories:{
        type: DataTypes.DOUBLE,
        allowNull:false
    },
    avg_speed:{
        type: DataTypes.DOUBLE,
        allowNull:false
    },
    distance:{
        type: DataTypes.DOUBLE,
        allowNull:false
    },
    workout_effectiveness:{
        type: DataTypes.STRING,
        allowNull:false
    }


});
Workout.belongsTo(User);
//Workout.belongsTo(Event);