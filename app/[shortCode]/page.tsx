import { redirect } from 'next/navigation';
import pool from '@/lib/db';

interface PageProps {
  params: {
    shortCode: string;
  };
}

export default async function RedirectPage({ params }: PageProps) {
  const { shortCode } = params;

  try {
    // Buscar la URL en la base de datos
    const result = await pool.query(
      'SELECT url_original FROM urls WHERE url_corta = $1',
      [shortCode]
    );

    if (result.rows.length === 0) {
      // Si no existe, redirigir a la página principal
      redirect('/');
    }

    const urlOriginal = result.rows[0].url_original;

    // Incrementar contador de visitas
    await pool.query(
      'UPDATE urls SET visitas = visitas + 1 WHERE url_corta = $1',
      [shortCode]
    );

    // Redirigir a la URL original
    redirect(urlOriginal);
  } catch (error) {
    console.error('Error en redirección:', error);
    redirect('/');
  }
}