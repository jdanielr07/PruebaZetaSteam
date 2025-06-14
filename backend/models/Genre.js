module.exports = (sequelize, DataTypes) => {
    const Genre = sequelize.define('Genre', {
      name: {
        type: DataTypes.STRING,
        allowNull: false
      }
    }, {
      tableName: 'genres',
      timestamps: false
    });
  
    return Genre;
  };  