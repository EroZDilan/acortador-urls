import { redirect } from 'next/navigation';
import pool from '@/lib/db';

interface PageProps {
  params: Promise<{
    shortCode: string;
  }>;
}

export default async function RedirectPage({ params }: PageProps) {
  const { shortCode } = await params;

  try {
    const result = await pool.query(
      'SELECT url_original FROM urls WHERE url_corta = $1',
      [shortCode]
    );

    if (result.rows.length === 0) {
      redirect('/');
    }

    const urlOriginal = result.rows[0].url_original;

    await pool.query(
      'UPDATE urls SET visitas = visitas + 1 WHERE url_corta = $1',
      [shortCode]
    );

    redirect(urlOriginal);
  } catch (error) {
    console.error('Error en redirección:', error);
    redirect('/');
  }
}