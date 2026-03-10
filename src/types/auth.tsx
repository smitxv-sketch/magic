import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createHmac, randomBytes, timingSafeEqual } from 'crypto';

// Helper for constant-time-like delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const serverPassword = process.env.TIMELINE_PASSWORD;

  if (!serverPassword) {
    console.error('CRITICAL: TIMELINE_PASSWORD is not set in environment variables.');
    return res.status(500).json({ error: 'Configuration Error' });
  }

  // --- GET: VALIDATE SESSION (For Client-Side Guard) ---
  if (req.method === 'GET') {
    const authCookie = req.cookies['timeline_auth'];
    
    if (!authCookie) {
       return res.status(401).json({ authenticated: false });
    }

    try {
      const parts = authCookie.split('.');
      if (parts.length !== 2) throw new Error('Invalid format');
      
      const [payloadB64, signature] = parts;
      
      // Check Expiration
      const payload = JSON.parse(Buffer.from(payloadB64, 'base64').toString());
      if (Date.now() - payload.iat > 86400000) { // 24h
         return res.status(401).json({ authenticated: false, reason: 'expired' });
      }

      // Check Signature
      const expectedSignature = createHmac('sha256', serverPassword).update(payloadB64).digest('base64');
      const sigBuffer = Buffer.from(signature);
      const expectedBuffer = Buffer.from(expectedSignature);

      if (sigBuffer.length !== expectedBuffer.length || !timingSafeEqual(sigBuffer, expectedBuffer)) {
         return res.status(401).json({ authenticated: false, reason: 'invalid_sig' });
      }

      // Valid Session
      return res.status(200).json({ authenticated: true });

    } catch (e) {
      return res.status(401).json({ authenticated: false });
    }
  }

  // --- POST: LOGIN (Create Session) ---
  if (req.method === 'POST') {
    // Artificial delay to prevent brute force
    const randomDelay = Math.floor(Math.random() * 300) + 300;
    await delay(randomDelay);

    try {
      const { password } = req.body;

      // 1. TIMING-SAFE PASSWORD CHECK
      const inputHash = createHmac('sha256', 'auth-check').update(password || '').digest();
      const targetHash = createHmac('sha256', 'auth-check').update(serverPassword).digest();

      if (!timingSafeEqual(inputHash, targetHash)) {
        return res.status(401).json({ error: 'Invalid Credentials' });
      }

      // 2. GENERATE SIGNED SESSION TOKEN
      const payload = JSON.stringify({ 
        jti: randomBytes(16).toString('hex'), 
        iat: Date.now() 
      });
      const payloadB64 = Buffer.from(payload).toString('base64');
      
      const signature = createHmac('sha256', serverPassword).update(payloadB64).digest('base64');
      const token = `${payloadB64}.${signature}`;

      // 3. SET SECURE COOKIE
      const cookieValue = `timeline_auth=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=86400`; // 24 hours

      res.setHeader('Set-Cookie', cookieValue);
      
      return res.status(200).json({ success: true });
    } catch (error) {
      console.error('Auth System Error:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}