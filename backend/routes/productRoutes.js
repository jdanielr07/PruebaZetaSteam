const express = require('express');
const { verifyToken, isAdmin } = require('../middleware/auth');
const Product = require('../models/Product');
const router = express.Router();

// público
router.get('/', async (_, res) => {
  const products = await Product.findAll();
  res.json(products);
});

// admin
router.post('/', verifyToken, isAdmin, async (req, res) => {
  const { name, description, price, image } = req.body;
  const product = await Product.create({ name, description, price, image });
  res.json(product);
});

router.put('/:id', verifyToken, isAdmin, async (req, res) => {
  const { id } = req.params;
  const updated = await Product.update(req.body, { where: { id } });
  res.json(updated);
});

router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
  await Product.destroy({ where: { id: req.params.id } });
  res.json({ message: 'Producto eliminado' });
});

module.exports = router;
