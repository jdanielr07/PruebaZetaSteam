import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    
    // Validación más robusta del ID
    if (!id || typeof id !== 'string' || id.trim() === '') {
      return NextResponse.json({ 
        message: 'ID de producto requerido y debe ser válido',
        error: 'INVALID_ID'
      }, { status: 400 });
    }

    const backendUrl = process.env.BACKEND_URL || 'http://localhost:4000';
    const response = await fetch(`${backendUrl}/api/products/${encodeURIComponent(id)}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json({ 
          message: 'Producto no encontrado',
          error: 'PRODUCT_NOT_FOUND',
          productId: id
        }, { status: 404 });
      }
    }
    
    const data = await response.json();
    
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('Error al obtener producto:', {
      productId: productId,
      error: error.message,
      stack: error.stack
    });
    
    return NextResponse.json({ 
      message: 'Error interno del servidor',
      error: 'INTERNAL_ERROR',
      ...(process.env.NODE_ENV === 'development' && { 
        details: error.message 
      })
    }, { status: 500 });
  }
}