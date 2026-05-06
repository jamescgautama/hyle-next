import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'hyle_super_secret_key';
const JWT_EXPIRY = '1d';

export interface JWTPayload {
  id: number;
  username: string;
}

export function signToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRY });
}

export function verifyToken(token: string): JWTPayload {
  return jwt.verify(token, JWT_SECRET) as JWTPayload;
}

export function extractToken(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization');
  if (!authHeader) return null;

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return null;
  }

  return parts[1];
}

export function verifyRequestToken(request: NextRequest): JWTPayload {
  const token = extractToken(request);
  if (!token) {
    throw new Error('No token provided');
  }

  try {
    return verifyToken(token);
  } catch (err) {
    throw new Error('Invalid token');
  }
}
