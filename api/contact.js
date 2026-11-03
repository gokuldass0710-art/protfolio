// Vercel Serverless Function: /api/contact
import { handleContactSubmission, loadEnvFile } from '../src/api/contactHandler.js';
import path from 'path';

// Attempt to load .env in development environments
loadEnvFile(path.join(process.cwd(), '.env'));

export default async function handler(req, res) {
  // Enforce POST method only
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method Not Allowed. Use POST.' });
  }

  try {
    // Parse JSON body if needed
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch (e) {
        return res.status(400).json({ error: 'Malformed JSON payload.' });
      }
    }

    if (!body || typeof body !== 'object') {
      return res.status(400).json({ error: 'Invalid request body.' });
    }

    const { name, email, subject, message, company_field, testMode } = body;

    // Determine client IP for rate limiting
    const forwarded = req.headers['x-forwarded-for'];
    const clientIp = typeof forwarded === 'string' 
      ? forwarded.split(',')[0].trim() 
      : (req.socket?.remoteAddress || '127.0.0.1');

    const result = await handleContactSubmission({
      name,
      email,
      subject,
      message,
      honeypot: company_field,
      clientIp,
      testMode
    });

    return res.status(result.status).json(result.data);
  } catch (error) {
    console.error('[API Contact] Uncaught error:', error);
    return res.status(500).json({
      error: 'Unable to send your message right now. Please try again later.'
    });
  }
}

