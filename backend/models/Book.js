module.exports = (sequelize, DataTypes) => {
  const Book = sequelize.define('Book', {
    title: { type: DataTypes.STRING, allowNull: false },
    author: { type: DataTypes.STRING, allowNull: false },
    isbn: { type: DataTypes.STRING, allowNull: false, unique: true },
    genre_id: { type: DataTypes.INTEGER,references: { model: 'Genres',key: 'id' },allowNull: false },
    publication_date: DataTypes.DATE,
    stock: { type: DataTypes.INTEGER, defaultValue: 0 },
    price: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
    image: DataTypes.STRING,
    description: DataTypes.TEXT,
    active: {type: DataTypes.BOOLEAN, defaultValue: true,}    
  }, {
    tableName: 'books',
    timestamps: true,
    underscored: true
  });

  return Book;
};