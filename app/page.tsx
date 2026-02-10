'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function Home() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('/api/shorten', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Error al acortar la URL');
        return;
      }

      setResult(data.data);
      setUrl('');
    } catch (err) {
      setError('Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('¡Copiado al portapapeles!');
  };

  const downloadQR = () => {
    if (!result?.codigo_qr) return;
    
    const link = document.createElement('a');
    link.href = result.codigo_qr;
    link.download = `qr-${result.url_corta}.png`;
    link.click();
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            🔗 Acortador de URLs
          </h1>
          <p className="text-gray-600 text-lg">
            Acorta tus enlaces y genera códigos QR al instante
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col md:flex-row gap-4">
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Pega tu URL aquí (https://ejemplo.com)"
                className="flex-1 px-6 py-4 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 text-gray-700"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-4 rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? 'Procesando...' : 'Acortar'}
              </button>
            </div>
          </form>

          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}
        </div>

        {/* Result */}
        {result && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              ✅ ¡URL acortada con éxito!
            </h2>

            <div className="space-y-6">
              {/* URL Original */}
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-2">
                  URL Original:
                </label>
                <div className="bg-gray-50 p-4 rounded-lg break-all text-gray-700">
                  {result.url_original}
                </div>
              </div>

              {/* URL Corta */}
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-2">
                  URL Corta:
                </label>
                <div className="flex gap-2">
                  <div className="flex-1 bg-indigo-50 p-4 rounded-lg font-mono text-indigo-700">
                    {`${window.location.origin}/${result.url_corta}`}
                  </div>
                  <button
                    onClick={() => copyToClipboard(`${window.location.origin}/${result.url_corta}`)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 rounded-lg transition-colors"
                  >
                    Copiar
                  </button>
                </div>
              </div>

              {/* Código QR */}
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-2">
                  Código QR:
                </label>
                <div className="flex flex-col items-center gap-4 bg-gray-50 p-6 rounded-lg">
                  <img
                    src={result.codigo_qr}
                    alt="Código QR"
                    className="w-64 h-64 border-4 border-white shadow-lg"
                  />
                  <button
                    onClick={downloadQR}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors font-semibold"
                  >
                    📥 Descargar QR
                  </button>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div className="text-center">
                  <p className="text-sm text-gray-600">Visitas</p>
                  <p className="text-3xl font-bold text-indigo-600">{result.visitas}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Creado</p>
                  <p className="text-lg font-semibold text-gray-700">
                    {new Date(result.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}