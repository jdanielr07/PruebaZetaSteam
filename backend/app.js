const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { sequelize } = require('./config/db');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/books', require('./routes/bookRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/cart', require('./routes/cartRoutes'));

sequelize.sync().then(() => {
  console.log('Base de datos conectada');
  app.listen(process.env.PORT, () => console.log(`Servidor corriendo en puerto ${process.env.PORT}`));
}).catch(err => console.error('Error al conectar DB:', err));