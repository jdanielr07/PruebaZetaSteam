'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchProduct(params.id);
    }
  }, [params.id]);

  const fetchProduct = async (productId) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/products/${productId}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Producto no encontrado');
        }
        throw new Error('Error al cargar el producto');
      }
      
      const data = await response.json();
      setProduct(data.product);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    try {
      setAddingToCart(true);
      
      // Aquí implementarías la lógica para añadir al carrito
      // Por ejemplo, guardar en localStorage o enviar a una API
      const cartItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: quantity
      };

      // Obtener carrito actual del localStorage
      const currentCart = JSON.parse(localStorage.getItem('cart') || '[]');
      
      // Verificar si el producto ya está en el carrito
      const existingItemIndex = currentCart.findIndex(item => item.id === product.id);
      
      if (existingItemIndex > -1) {
        // Si ya existe, actualizar cantidad
        currentCart[existingItemIndex].quantity += quantity;
      } else {
        // Si no existe, añadir nuevo item
        currentCart.push(cartItem);
      }
      
      // Guardar carrito actualizado
      localStorage.setItem('cart', JSON.stringify(currentCart));
      
      // Mostrar mensaje de éxito (podrías usar una librería de notificaciones)
      alert(`${product.name} añadido al carrito!`);
      
    } catch (error) {
      console.error('Error al añadir al carrito:', error);
      alert('Error al añadir al carrito');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= 99) {
      setQuantity(newQuantity);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-600">Cargando producto...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="text-red-600 text-lg mb-4">Error: {error}</div>
          <button
            onClick={() => router.back()}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="text-gray-600 text-lg">Producto no encontrado</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-6">
        <button
          onClick={() => router.back()}
          className="text-blue-600 hover:text-blue-800 flex items-center space-x-2"
        >
          <span>←</span>
          <span>Volver</span>
        </button>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Imagen del producto */}
        <div className="space-y-4">
          <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <div className="text-6xl mb-2">📚</div>
                  <div>Sin imagen</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Información del producto */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {product.name}
            </h1>
            
            {product.author && (
              <p className="text-lg text-gray-600 mb-4">
                Por {product.author}
              </p>
            )}

            <div className="text-3xl font-bold text-blue-600 mb-4">
              ${parseFloat(product.price).toFixed(2)}
            </div>

            {product.category && (
              <div className="inline-block bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm mb-4">
                {product.category}
              </div>
            )}
          </div>

          {/* Descripción */}
          {product.description && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Descripción
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {product.description}
              </p>
            </div>
          )}

          {/* Información adicional */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            {product.isbn && (
              <div>
                <span className="font-semibold text-gray-600">ISBN:</span>
                <span className="ml-2 text-gray-800">{product.isbn}</span>
              </div>
            )}
            
            {product.pages && (
              <div>
                <span className="font-semibold text-gray-600">Páginas:</span>
                <span className="ml-2 text-gray-800">{product.pages}</span>
              </div>
            )}
            
            {product.publisher && (
              <div>
                <span className="font-semibold text-gray-600">Editorial:</span>
                <span className="ml-2 text-gray-800">{product.publisher}</span>
              </div>
            )}
            
            {product.publishDate && (
              <div>
                <span className="font-semibold text-gray-600">Publicación:</span>
                <span className="ml-2 text-gray-800">
                  {new Date(product.publishDate).getFullYear()}
                </span>
              </div>
            )}
          </div>

          {/* Controles de cantidad y añadir al carrito */}
          <div className="border-t pt-6">
            <div className="flex items-center space-x-4 mb-6">
              <label className="text-gray-700 font-medium">Cantidad:</label>
              <div className="flex items-center border border-gray-300 rounded">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  className="px-3 py-1 hover:bg-gray-100"
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span className="px-4 py-1 min-w-[3rem] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => handleQuantityChange(1)}
                  className="px-3 py-1 hover:bg-gray-100"
                  disabled={quantity >= 99}
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={handleAddToCart}
                disabled={addingToCart}
                className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {addingToCart ? 'Añadiendo...' : 'Añadir al carrito'}
              </button>
              
              <button className="bg-gray-200 text-gray-800 py-3 px-6 rounded-lg hover:bg-gray-300 font-medium">
                ♡ Favoritos
              </button>
            </div>

            <div className="mt-4 text-sm text-gray-600">
              <div className="flex items-center space-x-2 mb-2">
                <span>🚚</span>
                <span>Envío gratis en pedidos superiores a $50</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>↩️</span>
                <span>Devoluciones gratuitas en 30 días</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}