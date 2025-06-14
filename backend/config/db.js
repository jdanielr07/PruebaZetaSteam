const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'postgres',
  }
);

const User = require('../models/User')(sequelize, Sequelize.DataTypes);
const Book = require('../models/Book')(sequelize, Sequelize.DataTypes);
const Genre = require('../models/Genre')(sequelize, Sequelize.DataTypes);
const Cart = require('../models/Cart')(sequelize, Sequelize.DataTypes);
const CartItem = require('../models/CartItem')(sequelize, Sequelize.DataTypes);
const Order = require('../models/Order')(sequelize, Sequelize.DataTypes);
const OrderItem = require('../models/OrderItem')(sequelize, Sequelize.DataTypes);


// User - Cart
User.hasOne(Cart, { foreignKey: 'user_id' });
Cart.belongsTo(User, { foreignKey: 'user_id' });

// Cart - CartItem
Cart.hasMany(CartItem, { foreignKey: 'cart_id' });
CartItem.belongsTo(Cart, { foreignKey: 'cart_id' });

// Book - CartItem
Book.hasMany(CartItem, { foreignKey: 'book_id' });
CartItem.belongsTo(Book, { foreignKey: 'book_id' });

// User - Order
User.hasMany(Order, { foreignKey: 'user_id' });
Order.belongsTo(User, { foreignKey: 'user_id' });

// Order - OrderItem
Order.hasMany(OrderItem, { foreignKey: 'order_id' });
OrderItem.belongsTo(Order, { foreignKey: 'order_id' });

// Book - OrderItem
Book.hasMany(OrderItem, { foreignKey: 'book_id' });
OrderItem.belongsTo(Book, { foreignKey: 'book_id' });

Genre.hasMany(Book, { foreignKey: 'genre_id' });
Book.belongsTo(Genre, { foreignKey: 'genre_id' });

module.exports = {
  sequelize,
  User,
  Book,
  Genre,
  Cart,
  CartItem,
  Order,
  OrderItem,
};
