const express = require('express');
const { verifyToken, isAdmin } = require('../middleware/auth');
const verifyTokenOptional = require('../middleware/verifyTokenOptional');
const sequelize = require('../config/db');
const BookModel = require('../models/Book');
const { Book, Genre } = require('../config/db');
const { Op } = require('sequelize');
const router = express.Router();

// Obtener todos los libros
router.get('/', verifyTokenOptional, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const userIsAdmin = req.user?.role === 'admin';

    const whereClause = userIsAdmin ? {} : { active: true };
    if (req.query.genre) {
      whereClause.genre_id = parseInt(req.query.genre);
    }

    const { count, rows } = await Book.findAndCountAll({
      where: whereClause,
      limit,
      offset,
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: Genre,
          attributes: ['id', 'name']
        },
      ],
    });

    res.json({
      total: count,
      page,
      pages: Math.ceil(count / limit),
      books: rows,
    });
  } catch (err) {
    console.error('Error al obtener libros:', err);
    res.status(500).json({ message: 'Error al obtener libros' });
  }
});

router.get('/genres', async (req, res) => {
  try {
    const genres = await Genre.findAll({ order: [['name', 'ASC']] });
    res.json(genres);
  } catch (err) {
    console.error('Error al obtener géneros', err);
    res.status(500).json({ message: 'Error al obtener géneros' });
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
    await Book.update({ active: false }, { where: { id: req.params.id } });
    res.json({ message: 'Libro marcado como inactivo' });
  } catch (err) {
    console.error('Error al marcar libro como inactivo:', err);
    res.status(500).json({ message: 'Error al eliminar libro' });
  }
});

module.exports = router;
