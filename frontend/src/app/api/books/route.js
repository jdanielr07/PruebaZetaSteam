// app/api/books/route.js
import { NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

// POST - Crear un nuevo libro (proxy al backend)
export async function POST(request) {
  try {
    const body = await request.json();
    
    // Validaciones básicas en el frontend
    if (!body.titulo || !body.autor || !body.isbn) {
      return NextResponse.json(
        { error: 'Título, autor e ISBN son requeridos' },
        { status: 400 }
      );
    }

    // Enviar la petición al backend
    const response = await fetch(`${API_BASE_URL}/books`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body)
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error || 'Error al crear el libro' },
        { status: response.status }
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Error creating book:', error);
    return NextResponse.json(
      { error: 'Error de conexión con el servidor' },
      { status: 500 }
    );
  }
}

// GET - Obtener todos los libros (proxy al backend)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Construir query params para el backend
    const params = new URLSearchParams();
    if (searchParams.get('page')) params.set('page', searchParams.get('page'));
    if (searchParams.get('limit')) params.set('limit', searchParams.get('limit'));
    if (searchParams.get('q')) params.set('q', searchParams.get('q'));

    // Enviar la petición al backend
    const response = await fetch(`${API_BASE_URL}/books?${params.toString()}`);

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error || 'Error al obtener los libros' },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching books:', error);
    return NextResponse.json(
      { error: 'Error de conexión con el servidor' },
      { status: 500 }
    );
  }
}