module.exports = (sequelize, DataTypes) => {
    const Cart = sequelize.define('Cart', {
      user_id: { type: DataTypes.INTEGER, allowNull: false },
    }, {
      timestamps: true,
      underscored: true
    });
  
    return Cart;
  };
  