'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { Library } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const searchRef = useRef(null);
  const dropdownRef = useRef(null);
  const userMenuRef = useRef(null);
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  const isActive = (path) => pathname === path ? 'text-blue-500 font-bold' : '';
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (searchTerm.trim().length > 2) {
      const timeoutId = setTimeout(() => {
        performSearch(searchTerm.trim());
      }, 300);

      return () => clearTimeout(timeoutId);
    } else {
      setSearchResults([]);
      setShowDropdown(false);
    }
  }, [searchTerm]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Cerrar dropdown de búsqueda
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) &&
          searchRef.current && !searchRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
      
      // Cerrar menú de usuario
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const performSearch = async (query) => {
    try {
      setIsSearching(true);
      const response = await fetch(`http://localhost:4000/api/books?search=${encodeURIComponent(query.trim())}`)
      
      if (!response.ok) {
        throw new Error('Error en la búsqueda');
      }
      
      const data = await response.json();
      setSearchResults(data.slice(0, 5) || []);
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

  const handleResultClick = (book) => {
    setSearchTerm('');
    setShowDropdown(false);
    setSearchResults([]);
    router.push(`/books/${book.id}`);
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

  const handleLogout = async () => {
    try {
      await logout();
      setShowUserMenu(false);
      router.push('/');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <Library size={32} className="text-blue-600" />
            <div className="flex items-center">
              <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                ZETA
              </span>
              <span className="text-gray-800 ml-2 text-xl font-medium">
                Library
              </span>
            </div>
          </Link>
          
          {/* Barra de búsqueda */}
          <div className="flex-1 max-w-md mx-8 relative">
            <form onSubmit={handleSearch} className="relative">
              <input
                ref={searchRef}
                type="text"
                placeholder="Buscar libros, autores..."
                value={searchTerm}
                onChange={handleInputChange}
                className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                🔍
              </div>
              <button
                type="submit"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-500 transition-colors"
              >
                {isSearching ? (
                  <div className="animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                ) : (
                  <span className="text-sm">⏎</span>
                )}
              </button>
            </form>

            {/* Dropdown de resultados de búsqueda */}
            {showDropdown && (
              <div 
                ref={dropdownRef}
                className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-xl shadow-lg mt-2 z-50 max-h-80 overflow-y-auto"
              >
                {searchResults.length > 0 ? (
                  <>
                    {searchResults.map((book) => (
                      <div
                        key={book.id}
                        onClick={() => handleResultClick(book)}
                        className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 first:rounded-t-xl"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-gray-900 truncate">
                              {book.title}
                            </div>
                            {book.author && (
                              <div className="text-sm text-gray-500 truncate">
                                {book.author}
                              </div>
                            )}
                            {book.price && (
                              <div className="text-sm text-blue-600 font-medium">
                                ${book.price}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    <div
                      onClick={handleSeeAllResults}
                      className="p-3 text-center bg-gray-50 hover:bg-gray-100 cursor-pointer text-blue-600 font-medium rounded-b-xl"
                    >
                      Ver todos los resultados para "{searchTerm}"
                    </div>
                  </>
                ) : (
                  <div className="p-4 text-center text-gray-500 rounded-xl">
                    {isSearching ? 'Buscando...' : 'No se encontraron resultados'}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Navegación */}
          <div className="flex items-center space-x-6">
            {/* Enlace de Inicio */}
            <Link 
              href="/" 
              className={`${isActive('/')} hover:text-blue-500 transition-colors duration-200 font-medium`}
            >
              Inicio
            </Link>

            {/* Carrito */}
            <Link 
              href="/cart" 
              className={`relative inline-flex items-center hover:text-blue-500 transition-colors duration-200 ${isActive('/cart')}`}
            >
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.8 7.2M7 13h10M17 21a2 2 0 100-4 2 2 0 000 4zm-8 0a2 2 0 100-4 2 2 0 000 4z" />
              </svg>
              <span className="font-medium">Carrito</span>
              {isMounted && totalItems > 0 && (
                <span className="ml-2 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full animate-pulse">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Enlaces para usuarios no autenticados */}
            {!user && (
              <>
                <Link
                  href="/login"
                  className={`${isActive('/login')} flex items-center space-x-1 px-4 py-2 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 font-medium`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  <span>Iniciar sesión</span>
                </Link>
                
                <Link
                  href="/register"
                  className={`${isActive('/register')} flex items-center space-x-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                  <span>Registrarse</span>
                </Link>
              </>
            )}

            {/* Menú de usuario autenticado */}
            {user && (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  {/* Avatar */}
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {user?.name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  
                  {/* Nombre del usuario */}
                  <span className="hidden md:block text-sm font-medium text-gray-700">
                    {user?.name || user?.email?.split('@')[0]}
                  </span>
                  
                  {/* Icono de flecha */}
                  <svg
                    className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Menú desplegable del usuario */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                    {/* Header del menú */}
                    <div className="px-4 py-3 border-b border-gray-100">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                          {user?.name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-800">
                            {user?.username || 'Usuario'}
                          </p>
                          <p className="text-xs text-gray-500">{user?.email}</p>
                          {user?.role && (
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium mt-1 ${
                              user.role === 'admin' 
                                ? 'bg-red-100 text-red-800' 
                                : 'bg-blue-100 text-blue-800'
                            }`}>
                              {user.role === 'admin' ? '👑 Admin' : '👤 Usuario'}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Opciones del menú */}
                    <div className="py-2">
                      {/* Opciones de admin */}
                      {user?.role === 'admin' && (
                        <>
                          <div className="border-gray-100 my-2"></div>
                          <div className="px-4 py-1">
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                              Administración
                            </p>
                          </div>
                          
                          <Link
                            href="/admin"
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                            onClick={() => setShowUserMenu(false)}
                          >
                            <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            Panel Admin
                          </Link>

                          <Link
                            href="/admin/books"
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                            onClick={() => setShowUserMenu(false)}
                          >
                            <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                            Gestionar Libros
                          </Link>

                          <Link
                            href="/admin/create"
                            className="flex border-gray-100 border-b items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                            onClick={() => setShowUserMenu(false)}
                          >
                            <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Crear Libro
                          </Link>
                        </>
                      )}

                      {/* Cerrar sesión */}
                      <div className="border-gray-100 my-2"></div>
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150"
                      >
                        <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Cerrar Sesión
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}