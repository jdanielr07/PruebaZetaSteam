'use client';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';

export default function BookCard({ book }) {
  const router = useRouter();
  const { addItem } = useCart();

  const handleAddToCart = () => {
    addItem(book);
  };

  const handleClick = () => {
    router.push(`/books/${book.id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="cursor-pointer rounded-lg shadow hover:shadow-lg transition duration-200 p-4 bg-white flex flex-col"
    >
      {/* Imagen */}
      {book.image && (
        <img
          src={book.image}
          alt={book.title}
          className="w-full h-48 object-cover mb-4 rounded"
        />
      )}

      {/* Título */}
      <h2 className="text-lg font-semibold text-gray-900 mb-1">{book.title}</h2>

      {/* Autor */}
      <p className="text-sm text-gray-600 mb-1">Autor: {book.author}</p>

      {/* Precio */}
      <p className="text-blue-600 font-bold text-lg mb-3">${book.price}</p>

      {/* Botón agregar al carrito */}
      <button
        onClick={handleAddToCart}
        disabled={book.stock <= 0}
        className={`mt-auto py-1 px-3 rounded ${
          book.stock > 0
            ? 'bg-blue-600 text-white hover:bg-blue-700'
            : 'bg-gray-400 text-gray-700 cursor-not-allowed'
        }`}
      >
        {book.stock > 0 ? 'Agregar al carrito' : 'Sin stock'}
      </button>
    </div>
  );
}
