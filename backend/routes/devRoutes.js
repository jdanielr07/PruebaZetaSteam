const express = require('express');
const Product = require('../models/Product');
const router = express.Router();

router.get('/seed', async (req, res) => {
  try {
    await Product.bulkCreate([
      {
        name: 'Libro 1',
        description: 'Una historia interesante',
        price: 12.99,
        image: 'https://picsum.photos/200/300',
      },
      {
        name: 'Libro 2',
        description: 'Otra historia épica',
        price: 18.50,
        image: 'https://picsum.photos/200/301',
      },
    ]);
    res.send('Productos insertados');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al insertar');
  }
});

module.exports = router;
