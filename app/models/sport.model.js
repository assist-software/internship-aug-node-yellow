const Sport = sequelize.define('sport', {
  
    type: {
        type: DataTypes.STRING,
        allowNull: fase

    }
});

Sport.sync().then(() => {
    Sport.create({
      type: 'Running'
    });
    Sport.create({
      type: 'Clicling'
    });
  });
