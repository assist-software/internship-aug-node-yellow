const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('sqlite::memory:');

module.exports=(sequelize,Sequelize)=>{

    const Role =require("./role.model.js")(sequelize, Sequelize);
    const Sport =require("./sport.model.js")(sequelize, Sequelize);

const User = sequelize.define('user', {
    first_name: {
        type: DataTypes.STRING,
        allowNull: true

    },
    last_name: {
        type: DataTypes.STRING,
        allowNull: true

    },
    email: {
        type: DataTypes.STRING,
        allowNull: false

    },
    password: {
        type: DataTypes.STRING,
        allowNull: false

    },
    role_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Role,
            key: 'id'
        }

    },
    gender: {
        type: DataTypes.STRING,
        allowNull: true

    },

    primary_sport_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Sport,
            key: 'id'
        }

    },
    secondary_sport_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Sport,
            key: 'id'
        }

    },
    height: {
        type: DataTypes.INTEGER,
        allowNull: true

    },
    weight: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    age: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    profile_photo: {
        type: DataTypes.BLOB,
        allowNull: true

    }
});


return User;}
