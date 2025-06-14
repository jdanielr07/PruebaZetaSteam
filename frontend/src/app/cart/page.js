'use client';
import { useCart } from '@/context/CartContext';
import { Trash2, Plus, Minus, ShoppingBag, CreditCard, RotateCcw } from 'lucide-react';

export default function CartPage() {
  const { cart, updateQuantity, removeItem, clearCart } = useCart();

  const total = cart.reduce((acc, item) => acc + item.book.price * item.quantity, 0);
  const itemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header mejorado */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 p-3 rounded-xl shadow-lg">
              <ShoppingBag className="w-6 h-6 text-white " />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Mi Carrito</h1>
              <p className="text-gray-600">{itemCount} {itemCount === 1 ? 'artículo' : 'artículos'}</p>
            </div>
          </div>
        </div>

        {cart.length === 0 ? (
          /* Estado vacío mejorado */
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <div className="bg-gray-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">Tu carrito está vacío</h2>
            <p className="text-gray-600 mb-6">¡Agrega algunos libros increíbles para comenzar!</p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg">
              Explorar libros
            </button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Lista de productos */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item, index) => (
                <div
                  key={item.book_id}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 transform hover:-translate-y-1"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Imagen del libro */}
                    <div className="flex-shrink-0">
                      {item.book.image ? (
                        <img
                          src={item.book.image}
                          alt={item.book.title}
                          className="w-24 h-32 md:w-28 md:h-36 object-cover rounded-xl shadow-md"
                        />
                      ) : (
                        <div className="w-24 h-32 md:w-28 md:h-36 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center shadow-md">
                          <ShoppingBag className="w-8 h-8 text-blue-500" />
                        </div>
                      )}
                    </div>

                    {/* Información del libro */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">
                        {item.book.title}
                      </h3>
                      <p className="text-gray-600 mb-3">
                        <span className="font-medium">Autor:</span> {item.book.author}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="text-2xl font-bold text-blue-600">
                          ${item.book.price}
                        </div>
                        <div className="text-sm text-gray-500">
                          Subtotal: ${(item.book.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    </div>

                    {/* Controles */}
                    <div className="flex flex-col justify-between items-end space-y-4">
                      {/* Control de cantidad */}
                      <div className="flex items-center bg-gray-100 rounded-xl p-1">
                        <button
                          onClick={() => updateQuantity(item.book_id, Math.max(item.quantity - 1, 1))}
                          className="p-2 hover:bg-white rounded-lg transition-colors duration-200 group"
                          disabled={item.quantity <= 1}
                        >
                          <Minus className={`w-4 h-4 ${item.quantity <= 1 ? 'text-gray-400' : 'text-gray-600 group-hover:text-blue-600'}`} />
                        </button>
                        <span className="font-bold text-lg px-4 min-w-[3rem] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.book_id, item.quantity + 1)}
                          className="p-2 hover:bg-white rounded-lg transition-colors duration-200 group"
                        >
                          <Plus className="w-4 h-4 text-gray-600 group-hover:text-blue-600" />
                        </button>
                      </div>

                      {/* Botón eliminar */}
                      <button
                        onClick={() => removeItem(item.book_id)}
                        className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:text-white hover:bg-red-500 rounded-xl transition-all duration-200 group border border-red-200 hover:border-red-500"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span className="text-sm font-medium">Eliminar</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Resumen del pedido */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Resumen del pedido</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({itemCount} {itemCount === 1 ? 'artículo' : 'artículos'})</span>
                    <span className="font-medium">${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Envío</span>
                    <span className="font-medium text-green-600">Gratis</span>
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold text-gray-800">Total</span>
                      <span className="text-2xl font-bold text-blue-600">${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Botones de acción */}
                <div className="space-y-3">
                  <button
                    onClick={() => alert('Aquí iría el flujo de checkout 😄')}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                  >
                    <CreditCard className="w-5 h-5" />
                    <span>Finalizar compra</span>
                  </button>
                  
                  <button
                    onClick={clearCart}
                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 border border-gray-200 hover:border-gray-300"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Vaciar carrito</span>
                  </button>
                </div>

                {/* Información adicional */}
                <div className="mt-6 p-4 bg-blue-50 rounded-xl">
                  <div className="flex items-start space-x-3">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <ShoppingBag className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-blue-800 mb-1">Envío gratuito</h4>
                      <p className="text-sm text-blue-600">En pedidos superiores a $25. Tu pedido califica.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}