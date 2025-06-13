import { useCart } from '@/context/CartContext';

export default function ProductCard({ product }) {
  const { dispatch } = useCart();

  const handleAdd = () => {
    dispatch({ type: 'ADD_ITEM', payload: product });
  };

  return (
    <div className="border rounded-lg p-4 shadow bg-white flex flex-col">
      <img src={product.image} alt={product.name} className="w-full h-48 object-cover mb-2 rounded" />
      <h2 className="text-lg font-semibold">{product.name}</h2>
      <p className="text-gray-600 text-sm mb-1">{product.description}</p>
      <p className="text-blue-600 font-bold mb-2">${product.price}</p>
      <button onClick={handleAdd} className="mt-auto bg-blue-600 text-white py-1 px-3 rounded hover:bg-blue-700">
        Agregar al carrito
      </button>
    </div>
  );
}
