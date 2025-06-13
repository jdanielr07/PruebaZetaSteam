module.exports = (sequelize, DataTypes) => {
  const Book = sequelize.define('Book', {
    title: { type: DataTypes.STRING, allowNull: false },
    author: { type: DataTypes.STRING, allowNull: false },
    isbn: { type: DataTypes.STRING, allowNull: false, unique: true },
    genre: DataTypes.STRING,
    publication_date: DataTypes.DATE,
    stock: { type: DataTypes.INTEGER, defaultValue: 0 },
    price: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
    image: DataTypes.STRING,
    description: DataTypes.TEXT
  }, {
    timestamps: true,
    underscored: true
  });

  return Book;
};