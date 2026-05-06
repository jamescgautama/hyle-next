import bcrypt from 'bcryptjs';
import { query } from '../db';
import { signToken, JWTPayload } from '../auth';

export interface AdminRegisterRequest {
  username: string;
  password: string;
}

export interface AdminLoginRequest {
  username: string;
  password: string;
}

export interface AdminResponse {
  id: number;
  username: string;
  created_at?: string;
}

export interface AdminLoginResponse {
  token: string;
  username: string;
}

export async function registerAdmin(req: AdminRegisterRequest): Promise<AdminResponse> {
  const { username, password } = req;

  if (!username || !password) {
    throw new Error('Username and password required');
  }

  const existsResult = await query('SELECT * FROM admins WHERE username = $1', [username]);
  if (existsResult.rows.length > 0) {
    throw new Error('Username already exists');
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const result = await query(
    'INSERT INTO admins (username, password) VALUES ($1, $2) RETURNING id, username',
    [username, hash]
  );

  return result.rows[0];
}

export async function loginAdmin(req: AdminLoginRequest): Promise<AdminLoginResponse> {
  const { username, password } = req;

  const result = await query('SELECT * FROM admins WHERE username = $1', [username]);
  if (result.rows.length === 0) {
    throw new Error('Invalid credentials');
  }

  const admin = result.rows[0];

  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) {
    throw new Error('Invalid credentials');
  }

  const payload: JWTPayload = { id: admin.id, username: admin.username };
  const token = signToken(payload);

  return { token, username: admin.username };
}
