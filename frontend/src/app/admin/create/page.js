'use client';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import { 
  BookOpen, 
  Save, 
  ArrowLeft, 
  Upload, 
  AlertCircle, 
  CheckCircle,
  Eye,
  EyeOff,
  Calendar,
  DollarSign,
  Hash,
  User,
  Tag,
  Package,
  FileText,
  Image as ImageIcon
} from 'lucide-react';

export default function CreateBookPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState({
    title: '',
    author: '',
    image: '',
    isbn: '',
    genre_id: 1,
    publication_date: '',
    stock: 0,
    price: '',
    description: '',
    active: true
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [imagePreview, setImagePreview] = useState('');
  const [availableGenres, setAvailableGenres] = useState([]);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Obtener géneros existentes del backend
  const fetchGenres = async () => {
    try {
      if (!user) return;
      
      const res = await axios.get('http://localhost:4000/api/books/genres', {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      const backendGenres = res.data || [];
      console.log(backendGenres);
      
      setAvailableGenres(backendGenres);
    } catch (err) {
      console.error('Error al obtener géneros', err);
      setAvailableGenres(commonGenres);
    }
  };

  useEffect(() => {
    fetchGenres();
  }, [user]);

  // Validar imagen URL
  useEffect(() => {
    if (form.image) {
      const img = new Image();
      img.onload = () => setImagePreview(form.image);
      img.onerror = () => setImagePreview('');
      img.src = form.image;
    } else {
      setImagePreview('');
    }
  }, [form.image]);

  // Validación del formulario
  const validateForm = () => {
    const newErrors = {};

    if (!form.title.trim()) newErrors.title = 'El título es requerido';
    if (!form.author.trim()) newErrors.author = 'El autor es requerido';
    if (!form.isbn.trim()) newErrors.isbn = 'El ISBN es requerido';
    if (!form.price || form.price <= 0) newErrors.price = 'El precio debe ser mayor a 0';
    if (form.stock < 0) newErrors.stock = 'El stock no puede ser negativo';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await axios.post('http://localhost:4000/api/books', {
        ...form,
        stock: parseInt(form.stock) || 0,
        price: parseFloat(form.price) || 0
      }, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      
      setShowSuccessMessage(true);
      setTimeout(() => {
        router.push('/admin/books');
      }, 2000);
    } catch (err) {
      console.error(err);
      const errorMessage = err.response?.data?.message || 'Error al crear libro';
      setErrors({ submit: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field, value) => {
    setForm({ ...form, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  return (
    <ProtectedRoute onlyAdmin>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-4 mb-4">
              <Link
                href="/admin/books"
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Volver a Libros</span>
              </Link>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-xl">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Crear Nuevo Libro</h1>
                <p className="text-gray-600">Agrega un nuevo libro a tu catálogo</p>
              </div>
            </div>
          </div>

          {/* Mensaje de éxito */}
          {showSuccessMessage && (
            <div className="mb-6 bg-green-50 border border-green-200 rounded-xl p-4 flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-green-800">¡Libro creado exitosamente! Redirigiendo...</span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Formulario principal */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Error general */}
                {errors.submit && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center space-x-3">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                    <span className="text-red-800">{errors.submit}</span>
                  </div>
                )}

                {/* Información básica */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center space-x-2">
                    <BookOpen className="w-5 h-5 text-blue-600" />
                    <span>Información Básica</span>
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Título *
                      </label>
                      <div className="relative">
                        <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="text"
                          placeholder="Ingresa el título del libro"
                          value={form.title}
                          onChange={(e) => handleInputChange('title', e.target.value)}
                          className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
                            errors.title ? 'border-red-300 bg-red-50' : 'border-gray-300'
                          }`}
                          required
                        />
                      </div>
                      {errors.title && <p className="text-red-600 text-sm mt-1">{errors.title}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Autor *
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="text"
                          placeholder="Nombre del autor"
                          value={form.author}
                          onChange={(e) => handleInputChange('author', e.target.value)}
                          className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
                            errors.author ? 'border-red-300 bg-red-50' : 'border-gray-300'
                          }`}
                          required
                        />
                      </div>
                      {errors.author && <p className="text-red-600 text-sm mt-1">{errors.author}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        ISBN *
                      </label>
                      <div className="relative">
                        <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="text"
                          placeholder="978-0-123456-78-9"
                          value={form.isbn}
                          onChange={(e) => handleInputChange('isbn', e.target.value)}
                          className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
                            errors.isbn ? 'border-red-300 bg-red-50' : 'border-gray-300'
                          }`}
                          required
                        />
                      </div>
                      {errors.isbn && <p className="text-red-600 text-sm mt-1">{errors.isbn}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Género
                      </label>
                      <div className="relative">
                        <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <select
                          value={form.genre_id}
                          onChange={(e) => handleInputChange('genre', e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 appearance-none"
                        >
                          <option value="">Selecciona un género</option>
                          {availableGenres.map((genre) => (
                            <option key={genre.id} value={genre.id}>{genre.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Fecha de Publicación
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="date"
                          value={form.publication_date}
                          onChange={(e) => handleInputChange('publication_date', e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Inventario y Precio */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center space-x-2">
                    <Package className="w-5 h-5 text-green-600" />
                    <span>Inventario y Precio</span>
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Stock
                      </label>
                      <div className="relative">
                        <Package className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="number"
                          min="0"
                          placeholder="0"
                          value={form.stock}
                          onChange={(e) => handleInputChange('stock', e.target.value)}
                          className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
                            errors.stock ? 'border-red-300 bg-red-50' : 'border-gray-300'
                          }`}
                        />
                      </div>
                      {errors.stock && <p className="text-red-600 text-sm mt-1">{errors.stock}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Precio *
                      </label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          placeholder="0.00"
                          value={form.price}
                          onChange={(e) => handleInputChange('price', e.target.value)}
                          className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
                            errors.price ? 'border-red-300 bg-red-50' : 'border-gray-300'
                          }`}
                          required
                        />
                      </div>
                      {errors.price && <p className="text-red-600 text-sm mt-1">{errors.price}</p>}
                    </div>
                  </div>

                  {/* Estado del libro */}
                  <div className="mt-6">
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={form.active}
                        onChange={(e) => handleInputChange('active', e.target.checked)}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="text-sm font-medium text-gray-700">Libro activo (visible en el catálogo)</span>
                    </label>
                  </div>
                </div>

                {/* Imagen */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center space-x-2">
                    <ImageIcon className="w-5 h-5 text-purple-600" />
                    <span>Imagen del Libro</span>
                  </h2>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      URL de la Imagen
                    </label>
                    <div className="relative">
                      <ImageIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="url"
                        placeholder="https://ejemplo.com/imagen.jpg"
                        value={form.image}
                        onChange={(e) => handleInputChange('image', e.target.value)}
                        className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
                          errors.image ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                      />
                    </div>
                    {errors.image && <p className="text-red-600 text-sm mt-1">{errors.image}</p>}
                    <p className="text-sm text-gray-500 mt-1">
                      Formatos soportados: JPG, PNG, GIF, WebP
                    </p>
                  </div>
                </div>

                {/* Descripción */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center space-x-2">
                    <FileText className="w-5 h-5 text-orange-600" />
                    <span>Descripción</span>
                  </h2>
                  
                  <div>
                    <textarea
                      placeholder="Describe el libro, su trama, características principales..."
                      value={form.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 resize-none"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      {form.description.length}/1000 caracteres
                    </p>
                  </div>
                </div>

                {/* Botones de acción */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    type="button"
                    onClick={() => setShowPreview(!showPreview)}
                    className="flex items-center justify-center space-x-2 px-6 py-3 border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 rounded-xl transition-colors duration-200"
                  >
                    {showPreview ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    <span>{showPreview ? 'Ocultar Vista Previa' : 'Vista Previa'}</span>
                  </button>
                  
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 text-white px-6 py-3 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:scale-100 shadow-lg hover:shadow-xl font-medium"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Guardando...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        <span>Guardar Libro</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Panel de vista previa */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Vista Previa</h2>
                  
                  {/* Imagen de vista previa */}
                  <div className="mb-4">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Vista previa"
                        className="w-full h-64 object-cover rounded-lg border border-gray-200"
                      />
                    ) : (
                      <div className="w-full h-64 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center border border-gray-200">
                        <div className="text-center">
                          <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                          <p className="text-gray-500 text-sm">Sin imagen</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Información del libro */}
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {form.title || 'Título del libro'}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        por {form.author || 'Autor'}
                      </p>
                    </div>

                    {form.genre && (
                      <span className="inline-block px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">
                        {form.genre}
                      </span>
                    )}

                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-green-600">
                        ${form.price || '0.00'}
                      </span>
                      {form.stock > 0 && (
                        <span className="text-sm text-gray-600">
                          {form.stock} en stock
                        </span>
                      )}
                    </div>

                    {form.description && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Descripción</h4>
                        <p className="text-gray-600 text-sm line-clamp-4">
                          {form.description}
                        </p>
                      </div>
                    )}

                    <div className="pt-3 border-t border-gray-200">
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>ISBN: {form.isbn || 'No especificado'}</span>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          form.active 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {form.active ? 'Activo' : 'Inactivo'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}