import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { nanoid } from 'nanoid';
import QRCode from 'qrcode';

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    // Validar que la URL sea válida
    if (!url || !url.startsWith('http')) {
      return NextResponse.json(
        { error: 'URL inválida. Debe comenzar con http:// o https://' },
        { status: 400 }
      );
    }

    // Generar código corto único
    const urlCorta = nanoid(8);

    // Generar código QR
    const codigoQR = await QRCode.toDataURL(
      `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/${urlCorta}`
    );

    // Guardar en la base de datos
    const result = await pool.query(
      'INSERT INTO urls (url_original, url_corta, codigo_qr) VALUES ($1, $2, $3) RETURNING *',
      [url, urlCorta, codigoQR]
    );

    return NextResponse.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Error al acortar URL:', error);
    return NextResponse.json(
      { error: 'Error al procesar la solicitud' },
      { status: 500 }
    );
  }
}
