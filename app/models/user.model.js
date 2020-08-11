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
        type: DataTypes.STRING,
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