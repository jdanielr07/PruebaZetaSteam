# 📚 ZetaLibrary - Librería Online

ZetaLibrary es una aplicación web que simula una tienda de libros. Los usuarios pueden explorar libros, filtrarlos por género, agregarlos al carrito y realizar pedidos. También cuenta con un panel de administración para gestionar el catálogo.

## 🚀 Tecnologías utilizadas

### Frontend
- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- Axios, Lucide-react, Context API

### Backend
- [Express.js](https://expressjs.com/)
- [Sequelize](https://sequelize.org/)
- [PostgreSQL](https://www.postgresql.org/)
- JSON Web Tokens (JWT)
- Dotenv

---

## ⚙️ Instrucciones para ejecutar el proyecto

### 🔧 Requisitos
- Node.js >= 16
- PostgreSQL >= 13

---

### 📁 Clonar el repositorio

```bash
git clone https://github.com/jdanielr07/PruebaZetaSteam.git
cd PruebaZetaSteam
```

### Backend

```bash
cd backend
npm install
```

### Frontend

```bash
cd frontend
npm install
```

Crea un archivo .env dentro de la carpeta backend
```bash
PORT=4000
JWT_SECRET=d8e1348e2580faf790f65a31c1c6a0d3
DB_NAME=zetalibrary
DB_USER=postgres
DB_PASSWORD=1234
DB_HOST=localhost
```
🗃️ Base de datos

1. Crea una base de datos llamada zetasteam.

2. Ejecuta los siguientes scripts en PostgreSQL:

```bash
CREATE TABLE genres (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL
);

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'user'
);

CREATE TABLE books (
  id SERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  author VARCHAR(150),
  isbn VARCHAR(50),
  genre_id INTEGER REFERENCES genres(id),
  image TEXT,
  stock INTEGER DEFAULT 0,
  price NUMERIC(10,2),
  publication_date DATE,
  description TEXT,
  active BOOLEAN DEFAULT TRUE
);

CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id),
  book_id INTEGER REFERENCES books(id),
  quantity INTEGER,
  price NUMERIC(10,2)
);

CREATE TABLE cart_items (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  book_id INTEGER REFERENCES books(id),
  quantity INTEGER
);

```
### ▶️ Ejecutar backend

```bash
npm run dev
```
Servidor disponible en: http://localhost:4000

Desarrollado por Daniel Rojas 🚀