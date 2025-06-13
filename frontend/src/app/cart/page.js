'use client';
import { useCart } from '@/context/CartContext';

export default function CartPage() {
  const { cart, updateQuantity, removeItem, clearCart } = useCart();

  const total = cart.reduce((acc, item) => acc + item.book.price * item.quantity, 0);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">🛒 Carrito de compras</h1>

      {cart.length === 0 ? (
        <p className="text-gray-600">Tu carrito está vacío.</p>
      ) : (
        <>
          <div className="space-y-4 mb-6">
            {cart.map((item) => (
              <div
                key={item.book_id}
                className="flex flex-col md:flex-row items-center justify-between p-4 rounded bg-white shadow"
              >
                <div className="flex items-center space-x-4 mb-4 md:mb-0 md:flex-1">
                  {item.book.image && (
                    <img
                      src={item.book.image}
                      alt={item.book.title}
                      className="w-20 h-20 object-cover rounded"
                    />
                  )}
                  <div>
                    <h2 className="text-lg font-semibold">{item.book.title}</h2>
                    <p className="text-sm text-gray-600">Autor: {item.book.author}</p>
                    <p className="text-blue-600 font-bold">${item.book.price}</p>
                  </div>
                </div>

                {/* Controles de cantidad */}
                <div className="flex items-center space-x-2 mb-4 md:mb-0">
                  <button
                    onClick={() => updateQuantity(item.book_id, Math.max(item.quantity - 1, 1))}
                    className="px-2 py-1 bg-gray-200 rounded"
                  >
                    -
                  </button>
                  <span className="font-semibold">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.book_id, item.quantity + 1)}
                    className="px-2 py-1 bg-gray-200 rounded"
                  >
                    +
                  </button>
                </div>

                {/* Botón eliminar */}
                <button
                  onClick={() => removeItem(item.book_id)}
                  className="px-3 py-1 bg-red-500 text-white rounded ml-2"
                >
                  Eliminar
                </button>
              </div>
            ))}
          </div>

          {/* Total + botones */}
          <div className="border-t pt-4">
            <p className="text-xl font-bold mb-4">
              Total: <span className="text-blue-600">${total.toFixed(2)}</span>
            </p>
            <div className="flex space-x-4">
              <button
                onClick={clearCart}
                className="px-4 py-2 bg-red-500 text-white rounded"
              >
                Vaciar carrito
              </button>
              <button
                onClick={() => alert('Aquí iría el flujo de checkout 😄')}
                className="px-4 py-2 bg-green-600 text-white rounded"
              >
                Finalizar compra
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
