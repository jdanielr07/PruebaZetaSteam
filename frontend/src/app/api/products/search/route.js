import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    
    if (!query) {
      return NextResponse.json({ 
        message: 'Parámetro de búsqueda requerido',
        products: [] 
      }, { status: 400 });
    }

    // Llamada a tu backend
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:4000';
    const response = await fetch(`${backendUrl}/api/products/search?q=${encodeURIComponent(query)}`);
    
    if (!response.ok) {
      throw new Error(`Error del backend: ${response.status}`);
    }
    
    const data = await response.json();
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error en búsqueda:', error);
    return NextResponse.json({ 
      message: 'Error al buscar productos',
      error: error.message,
      products: []
    }, { status: 500 });
  }
}