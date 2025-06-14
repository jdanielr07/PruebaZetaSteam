module.exports = (sequelize, DataTypes) => {
    const CartItem = sequelize.define('CartItem', {
      cart_id: { type: DataTypes.INTEGER, allowNull: false },
      book_id: { type: DataTypes.INTEGER, allowNull: false },
      quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
    }, {
      timestamps: true,
      underscored: true,
      indexes: [
        {
          unique: true,
          fields: ['cart_id', 'book_id'],
        },
      ],
    });
  
    return CartItem;
  };
  