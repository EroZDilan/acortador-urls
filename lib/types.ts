export interface Url {
  id: number;
  url_original: string;
  url_corta: string;
  codigo_qr: string | null;
  visitas: number;
  created_at: Date;
}