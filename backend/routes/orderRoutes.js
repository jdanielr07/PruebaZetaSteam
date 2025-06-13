const express = require('express');
const router = express.Router();
const sequelize = require('../config/db');
const OrderModel = require('../models/Order');
const OrderItemModel = require('../models/OrderItem');
const { Order } = require('../config/db');
const { OrderItem } = require('../config/db');
const { verifyToken } = require('../middleware/auth');

router.post('/', verifyToken, async (req, res) => {
  const { items, total_price } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ message: 'La orden no tiene productos.' });
  }

  try {
    // Crear la orden
    const order = await Order.create({
      user_id: req.user.id, // si estás usando verifyToken
      total_price,
    });

    // Crear los items de la orden
    const orderItems = items.map(item => ({
      order_id: order.id,
      book_id: item.id,
      quantity: item.quantity,
      price: item.price,
    }));

    await OrderItem.bulkCreate(orderItems);

    res.status(201).json({ message: 'Orden creada correctamente.', order_id: order.id });
  } catch (err) {
    console.error('Error al crear orden:', err);
    res.status(500).json({ message: 'Error al crear orden.' });
  }
});

module.exports = router;
