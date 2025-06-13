module.exports = (sequelize, DataTypes) => {
    const Order = sequelize.define('Order', {
      user_id: { type: DataTypes.INTEGER, allowNull: true }, // puede ser null si no tenés login de user
      total_price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    }, {
      timestamps: true,
      underscored: true
    });
  
    return Order;
  };  