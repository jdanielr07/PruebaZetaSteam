const express = require('express');
const router = express.Router();
const { Cart, CartItem, Book } = require('../config/db');
const { verifyToken } = require('../middleware/auth');

// Obtener carrito del usuario
router.get('/', verifyToken, async (req, res) => {
  try {
    console.log('GET /api/cart for user_id:', req.user.id);

    const cart = await Cart.findOrCreate({
      where: { user_id: req.user.id },
      include: { model: CartItem, include: Book },
    });

    console.log('Cart result:', cart);

    res.json(cart[0]);
  } catch (err) {
    console.error('Error al obtener carrito:', err);
    res.status(500).json({ message: 'Error al obtener carrito' });
  }
});

// Agregar o actualizar un item
router.post('/', verifyToken, async (req, res) => {
  const { book_id, quantity } = req.body;

  try {
    const cart = await Cart.findOrCreate({
      where: { user_id: req.user.id },
    });

    const cart_id = cart[0].id;

    const [item, created] = await CartItem.findOrCreate({
      where: { cart_id, book_id },
      defaults: { quantity },
    });

    if (!created) {
      item.quantity = quantity;
      await item.save();
    }

    res.json({ message: 'Item actualizado en el carrito' });
  } catch (err) {
    console.error('Error al agregar item al carrito:', err);
    res.status(500).json({ message: 'Error al agregar item al carrito' });
  }
});

// Eliminar un item
router.delete('/:book_id', verifyToken, async (req, res) => {
  const book_id = req.params.book_id;

  try {
    const cart = await Cart.findOne({ where: { user_id: req.user.id } });
    if (!cart) return res.status(404).json({ message: 'Carrito no encontrado' });

    await CartItem.destroy({
      where: {
        cart_id: cart.id,
        book_id,
      },
    });

    res.json({ message: 'Item eliminado del carrito' });
  } catch (err) {
    console.error('Error al eliminar item del carrito:', err);
    res.status(500).json({ message: 'Error al eliminar item del carrito' });
  }
});

// Vaciar carrito
router.delete('/', verifyToken, async (req, res) => {
  try {
    const cart = await Cart.findOne({ where: { user_id: req.user.id } });
    if (!cart) return res.status(404).json({ message: 'Carrito no encontrado' });

    await CartItem.destroy({ where: { cart_id: cart.id } });

    res.json({ message: 'Carrito vaciado' });
  } catch (err) {
    console.error('Error al vaciar carrito:', err);
    res.status(500).json({ message: 'Error al vaciar carrito' });
  }
});

module.exports = router;