'use client';
import { useCart } from '@/context/CartContext';

export default function CartPage() {
  const { cart, dispatch } = useCart();

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">🛒 Carrito</h1>
      {cart.length === 0 ? (
        <p>No hay productos en el carrito.</p>
      ) : (
        <div className="space-y-4">
          {cart.map((item) => (
            <div key={item.id} className="flex justify-between items-center border p-4 rounded bg-white">
              <div>
                <p className="font-semibold">{item.name}</p>
                <p className="text-sm">Cantidad: {item.quantity}</p>
              </div>
              <div className="flex items-center gap-2">
                <p className="font-bold text-blue-600">${(item.price * item.quantity).toFixed(2)}</p>
                <button
                  onClick={() => dispatch({ type: 'REMOVE_ITEM', payload: { id: item.id } })}
                  className="text-red-500 hover:text-red-700"
                >
                  ✖
                </button>
              </div>
            </div>
          ))}
          <div className="text-right mt-4 text-xl font-bold">
            Total: ${total.toFixed(2)}
          </div>
        </div>
      )}
    </div>
  );
}
