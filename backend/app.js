const express = require('express');
const cors = require('cors');
require('dotenv').config();
const sequelize = require('./config/db');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/dev', require('./routes/devRoutes'));

sequelize.sync().then(() => {
  console.log('Base de datos conectada');
  app.listen(process.env.PORT, () => console.log(`Servidor corriendo en puerto ${process.env.PORT}`));
}).catch(err => console.error('Error al conectar DB:', err));