import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const shortCode = searchParams.get('code');

  if (!shortCode) {
    return NextResponse.json(
      { error: 'Código corto requerido' },
      { status: 400 }
    );
  }

  try {
    const result = await pool.query(
      'SELECT * FROM urls WHERE url_corta = $1',
      [shortCode]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'URL no encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    return NextResponse.json(
      { error: 'Error al procesar la solicitud' },
      { status: 500 }
    );
  }
}