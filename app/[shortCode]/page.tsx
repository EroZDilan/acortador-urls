import { redirect, notFound } from 'next/navigation';
import pool from '@/lib/db';

export default async function RedirectPage({ 
  params 
}: { 
  params: Promise<{ shortCode: string }> 
}) {
  const resolvedParams = await params;
  const shortCode = resolvedParams.shortCode;

  console.log('ShortCode recibido:', shortCode);

  if (!shortCode) {
    notFound();
  }

  let urlOriginal: string | null = null;

  try {
    const result = await pool.query(
      'SELECT url_original FROM urls WHERE url_corta = $1',
      [shortCode]
    );

    console.log('Resultado DB:', result.rows);

    if (result.rows.length === 0) {
      console.log('URL no encontrada en DB');
      notFound();
    }

    urlOriginal = result.rows[0].url_original;

    await pool.query(
      'UPDATE urls SET visitas = visitas + 1 WHERE url_corta = $1',
      [shortCode]
    );

  } catch (error) {
    console.error('Error en redirección:', error);
    notFound();
  }

  if (!urlOriginal) {
    notFound();
  }

  redirect(urlOriginal);
}