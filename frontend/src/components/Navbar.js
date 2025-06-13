'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef(null);
  const dropdownRef = useRef(null);

  const isActive = (path) => pathname === path ? 'text-blue-500 font-bold' : '';

  // Búsqueda en tiempo real con debounce
  useEffect(() => {
    if (searchTerm.trim().length > 2) {
      const timeoutId = setTimeout(() => {
        performSearch(searchTerm.trim());
      }, 300); // Esperar 300ms después de que el usuario deje de escribir

      return () => clearTimeout(timeoutId);
    } else {
      setSearchResults([]);
      setShowDropdown(false);
    }
  }, [searchTerm]);

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) &&
          searchRef.current && !searchRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const performSearch = async (query) => {
    try {
      setIsSearching(true);
      const response = await fetch(`/api/products/search?q=${encodeURIComponent(query)}`);
      
      if (!response.ok) {
        throw new Error('Error en la búsqueda');
      }
      
      const data = await response.json();
      setSearchResults(data.products.slice(0, 5) || []); // Mostrar solo los primeros 5 resultados
      setShowDropdown(true);
    } catch (error) {
      console.error('Error en búsqueda:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    if (value.trim().length === 0) {
      setSearchResults([]);
      setShowDropdown(false);
    }
  };

  const handleResultClick = (product) => {
    setSearchTerm('');
    setShowDropdown(false);
    setSearchResults([]);
    router.push(`/products/${product.id}`);
  };

  const handleSeeAllResults = () => {
    if (searchTerm.trim()) {
      setShowDropdown(false);
      router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setShowDropdown(false);
      router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <nav className="bg-white shadow p-4 flex justify-between items-center">
      <Link href="/" className="text-xl font-bold text-gray-800">📚 ZETA Library</Link>
      
      {/* Campo de búsqueda */}
      <div className="flex-1 max-w-md mx-8 relative">
        <form onSubmit={handleSearch} className="relative">
          <input
            ref={searchRef}
            type="text"
            placeholder="Buscar libros, autores..."
            value={searchTerm}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-500"
          >
            {isSearching ? (
              <span className="animate-spin">⏳</span>
            ) : (
              '🔍'
            )}
          </button>
        </form>

        {/* Dropdown de resultados */}
        {showDropdown && (
          <div 
            ref={dropdownRef}
            className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 z-50 max-h-80 overflow-y-auto"
          >
            {searchResults.length > 0 ? (
              <>
                {searchResults.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => handleResultClick(product)}
                    className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                  >
                    <div className="flex items-center space-x-3">
                      {product.image && (
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900 truncate">
                          {product.name}
                        </div>
                        {product.description && (
                          <div className="text-sm text-gray-500 truncate">
                            {product.description}
                          </div>
                        )}
                        {product.price && (
                          <div className="text-sm text-blue-600 font-medium">
                            ${product.price}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Botón para ver todos los resultados */}
                <div
                  onClick={handleSeeAllResults}
                  className="p-3 text-center bg-gray-50 hover:bg-gray-100 cursor-pointer text-blue-600 font-medium"
                >
                  Ver todos los resultados para "{searchTerm}"
                </div>
              </>
            ) : (
              <div className="p-4 text-center text-gray-500">
                {isSearching ? 'Buscando...' : 'No se encontraron resultados'}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="space-x-4">
        <Link href="/" className={isActive('/')}>Inicio</Link>
        <Link href="/login" className={isActive('/login')}>Iniciar sesión</Link>
        <Link href="/dashboard" className={isActive('/dashboard')}>Dashboard</Link>
        <Link href="/cart" className={isActive('/cart')}>Carrito</Link>
      </div>
    </nav>
  );
}