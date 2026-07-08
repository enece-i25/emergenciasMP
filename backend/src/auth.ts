import express, { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { OAuth2Client } from 'google-auth-library';
import prisma from './prisma.js';

dotenv.config();

type AuthPayload = { userId: string; email: string; role: string };

declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload;
    }
  }
}

export {};

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const cookieSecret = process.env.COOKIE_SECRET || 'cookie-secret';

export function createAuthRouter() {
  const router = express.Router();
  const oauth2Client = new OAuth2Client({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    redirectUri: `${process.env.BACKEND_URL || 'http://localhost:4000'}/api/auth/google/callback`,
  });

  router.get('/google', (req, res) => {
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: ['openid', 'email', 'profile'],
      prompt: 'consent',
    });
    res.redirect(authUrl);
  });

  router.get('/google/callback', async (req, res) => {
    const code = req.query.code as string;
    if (!code) return res.status(400).send('Código de autorización faltante');

    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    const ticket = await client.verifyIdToken({ idToken: tokens.id_token!, audience: process.env.GOOGLE_CLIENT_ID });
    const payload = ticket.getPayload();
    if (!payload || !payload.email) return res.status(401).send('Email no disponible');

    const email = payload.email;
    const role = 'PRODUCTOR';

    let usuario = await prisma.usuario.findUnique({ where: { email } });
    if (!usuario) {
      usuario = await prisma.usuario.create({
        data: { email, role, estado: 'PENDIENTE' }
      });
    }

    const tokenJwt = jwt.sign({ userId: usuario.id, email, role: usuario.role }, cookieSecret, {
      expiresIn: '8h'
    });

    res.cookie('token', tokenJwt, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 8 * 60 * 60 * 1000
    });

    const productor = await prisma.productorProfile.findUnique({ where: { userId: usuario.id } });
    const redirectPath = productor ? '/dashboard' : '/perfil';
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}${redirectPath}`);
  });

  // Development-only: simulate Google login without calling Google's OAuth
  if (process.env.NODE_ENV !== 'production' && process.env.ENABLE_DEV_LOGIN === 'true') {
    router.get('/dev', async (req, res) => {
      const email = (req.query.email as string) || 'dev@local';
      const role = 'PRODUCTOR';

      let usuario = await prisma.usuario.findUnique({ where: { email } });
      if (!usuario) {
        usuario = await prisma.usuario.create({
          data: { email, role, estado: 'ACTIVO' }
        });
      }

      const tokenJwt = jwt.sign({ userId: usuario.id, email, role: usuario.role }, cookieSecret, {
        expiresIn: '8h'
      });

      res.cookie('token', tokenJwt, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 8 * 60 * 60 * 1000
      });

      const productor = await prisma.productorProfile.findUnique({ where: { userId: usuario.id } });
      const redirectPath = productor ? '/dashboard' : '/perfil';
      res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}${redirectPath}`);
    });
  }

  router.post('/logout', (req, res) => {
    res.cookie('token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0,
      path: '/',
    });
    res.json({ success: true });
  });

  return router;
}

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No autenticado' });
  try {
    const payload = jwt.verify(token, cookieSecret) as AuthPayload;
    req.user = payload;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido' });
  }
}

export async function requireProfileComplete(req: Request, res: Response, next: NextFunction) {
  const userId = req.user?.userId;
  if (!userId) return res.status(401).json({ error: 'No autenticado' });
  try {
    const usuario = await prisma.usuario.findUnique({ where: { id: userId }, include: { productorProfile: true } });
    const productor = usuario?.productorProfile;
    if (!usuario || !usuario.profileCompleted) {
      return res.status(403).json({ error: 'Perfil incompleto' });
    }
    next();
  } catch (error) {
    next(error);
  }
}
