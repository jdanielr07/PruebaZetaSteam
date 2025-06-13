const express = require('express');
const { verifyToken, isAdmin } = require('../middleware/auth');
const sequelize = require('../config/db');
const BookModel = require('../models/Book');
const { Book } = require('../config/db');
const { Op } = require('sequelize');
const router = express.Router();

// Obtener todos los libros
router.get('/', async (req, res) => {
    console.log('Request query parameters:', req.query); // Ver todos los parámetros que llegan en la solicitud
  const search = req.query.search?.trim() || '';
  console.log('Search term received in backend:', search);

    try {
      let whereCondition = {};
  
      if (search.length >= 2) {
        whereCondition = {
          [Op.or]: [
            { title: { [Op.iLike]: `%${search}%` } },
            { author: { [Op.iLike]: `%${search}%` } },
            { genre: { [Op.iLike]: `%${search}%` } },
            { isbn: { [Op.iLike]: `%${search}%` } },
          ],
        };
      }
  
      const books = await Book.findAll({
        where: whereCondition,
      });
  
      console.log('Search:', search);
      console.log('Results count:', books.length);
  
      res.json(books);
    } catch (err) {
      console.error('Error al buscar libros:', err);
      res.status(500).json({ message: 'Error al obtener libros' });
    }
  });

// Obtener un libro por id
router.get('/:id', async (req, res) => {
    try {
      const book = await Book.findByPk(req.params.id);
  
      if (!book) {
        return res.status(404).json({ message: 'Libro no encontrado' });
      }
  
      res.json(book);
    } catch (err) {
      console.error('Error al obtener libro por id:', err);
      res.status(500).json({ message: 'Error al obtener libro' });
    }
});

// Crear libro (solo admin)
router.post('/', verifyToken, isAdmin, async (req, res) => {
  try {
    const book = await Book.create(req.body);
    res.json(book);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al crear libro' });
  }
});

// Editar libro
router.put('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    await Book.update(req.body, { where: { id: req.params.id } });
    res.json({ message: 'Libro actualizado' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al actualizar libro' });
  }
});

// Eliminar libro
router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    await Book.destroy({ where: { id: req.params.id } });
    res.json({ message: 'Libro eliminado' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al eliminar libro' });
  }
});

module.exports = router;
