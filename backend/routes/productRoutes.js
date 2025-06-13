const express = require('express');
const { verifyToken, isAdmin } = require('../middleware/auth');
const Product = require('../models/Product');
const router = express.Router();
const { Op } = require('sequelize');

// público
router.get('/', async (_, res) => {
  const products = await Product.findAll();
  res.json(products);
});

router.get('/search', async (req, res) => {
    try {
      const { q } = req.query;
      
      if (!q || q.trim().length === 0) {
        return res.status(400).json({ 
          message: 'Parámetro de búsqueda requerido',
          products: [] 
        });
      }
  
      const searchTerm = q.trim();
      
      // Búsqueda con Sequelize (case insensitive)
      const searchQuery = {
        where: {
          [Op.or]: [
            { name: { [Op.iLike]: `%${searchTerm}%` } },
            { description: { [Op.iLike]: `%${searchTerm}%` } },
            // Añade más campos según tu modelo
            // { author: { [Op.iLike]: `%${searchTerm}%` } },
            // { category: { [Op.iLike]: `%${searchTerm}%` } },
          ]
        },
        limit: 50
      };
  
      const products = await Product.findAll(searchQuery);
      
      res.json({ 
        products,
        query: searchTerm,
        total: products.length 
      });
    } catch (error) {
      console.error('Error en búsqueda:', error);
      res.status(500).json({ 
        message: 'Error al buscar productos', 
        error: error.message,
        products: []
      });
    }
  });

router.get('/:id', async (req, res) => {
try {
    const product = await Product.findById(req.params.id);
    if (!product) {
    return res.status(404).json({ message: 'Producto no encontrado' });
    }
    res.json({ product });
} catch (error) {
    res.status(500).json({ message: 'Error al obtener producto', error: error.message });
}
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
