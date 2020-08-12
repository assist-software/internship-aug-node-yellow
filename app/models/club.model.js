const { DataTypes } = require("sequelize/types");

const Club = sequelize.define('club', {
    
    name: {
        type: DataTypes.STRING,
        allowNull: fase

    },
    owner_id:{
        type:DataTypes.INTEGER,
        allowNull:true,
        references: {
            model: User,
            key: 'id'
        }
        
    }
});