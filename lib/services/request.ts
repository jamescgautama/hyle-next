import { query } from '../db';

export interface AnalysisRequestPayload {
  name: string;
  institutions: string;
  email: string;
  phone: string;
  request: string;
}

export interface AnalysisRequestResponse {
  id: number;
  name: string;
  institutions: string;
  email: string;
  phone: string;
  request: string;
  created_at?: string;
}

export async function submitRequest(payload: AnalysisRequestPayload): Promise<AnalysisRequestResponse> {
  const { name, institutions, email, phone, request } = payload;

  if (!name || !institutions || !email || !phone || !request) {
    throw new Error('All fields are required');
  }

  const result = await query(
    'INSERT INTO analysisrequests (name, institutions, email, phone, request) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [name, institutions, email, phone, request]
  );

  return result.rows[0];
}
