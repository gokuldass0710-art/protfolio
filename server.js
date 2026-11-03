import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { handleContactSubmission, loadEnvFile } from './src/api/contactHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env configuration if present
loadEnvFile(path.join(__dirname, '.env'));

// Verification mode check (for npm run build / test checklist)
if (process.argv.includes('--verify')) {
  console.log('[*] Running portfolio build verification check...');
  const requiredFiles = [
    'index.html',
    'src/app.js',
    'src/styles/main.css',
    'src/data/site.js',
    'src/data/projects.js',
    'src/data/skills.js',
    'src/data/certifications.js',
    'src/api/contactHandler.js',
    'api/contact.js',
    'public/favicon.svg',
    'public/og-image.svg',
    'public/robots.txt',
    'public/resume/Gokul_Dass_Kannan_Resume.pdf',
    'public/certificates/cisco-introduction-to-cybersecurity.pdf',
    'public/certificates/cisco-introduction-to-cybersecurity.png',
    'public/certificates/bia-master-diploma-cyber-security.jpeg',
    'public/certificates/bia-master-diploma-ethical-hacking.jpeg',
    'public/certificates/aws-cloud-practitioner-essentials.pdf',
    'public/certificates/aws-cloud-practitioner-essentials.png',
    'public/_headers',
    'vercel.json'
  ];

  let missing = 0;
  for (const f of requiredFiles) {
    if (!fs.existsSync(path.join(__dirname, f))) {
      console.error(`[!] Missing required file: ${f}`);
      missing++;
    } else {
      console.log(`[✓] Verified file: ${f}`);
    }
  }

  if (missing > 0) {
    console.error(`[!] Verification failed with ${missing} missing files.`);
    process.exit(1);
  }

  console.log('[✓] All required portfolio assets, configs, and backend routes verified successfully!');
  process.exit(0);
}

const PORT = parseInt(process.env.PORT || '3000', 10);
const HOST = '0.0.0.0';

const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.js': 'text/javascript; charset=UTF-8',
  '.mjs': 'text/javascript; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.pdf': 'application/pdf',
  '.txt': 'text/plain; charset=UTF-8',
  '.xml': 'application/xml; charset=UTF-8'
};

const SECURITY_HEADERS = {
  'X-Frame-Options': 'SAMEORIGIN',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: https:; connect-src 'self'; frame-ancestors 'self';"
};

function resolveFilePath(reqUrl) {
  let pathname = decodeURIComponent(new URL(reqUrl, `http://${HOST}:${PORT}`).pathname);
  if (pathname === '/') pathname = '/index.html';

  // Check direct file in root
  let candidate = path.join(__dirname, pathname);
  if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
    return candidate;
  }

  // Check in public/ directory
  candidate = path.join(__dirname, 'public', pathname);
  if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
    return candidate;
  }

  // If path doesn't have an extension, try adding .html or fallback to index.html for SPA routing
  if (!path.extname(pathname)) {
    const candidateHtml = path.join(__dirname, `${pathname}.html`);
    if (fs.existsSync(candidateHtml) && fs.statSync(candidateHtml).isFile()) {
      return candidateHtml;
    }
    // Fallback to index.html
    return path.join(__dirname, 'index.html');
  }

  return null;
}

const server = http.createServer(async (req, res) => {
  // Apply Security Headers to every response
  for (const [header, val] of Object.entries(SECURITY_HEADERS)) {
    res.setHeader(header, val);
  }

  const parsedUrl = new URL(req.url, `http://${HOST}:${PORT}`);
  const pathname = parsedUrl.pathname;

  // 1. Backend Route: /api/contact
  if (pathname === '/api/contact' || pathname === '/api/contact/') {
    if (req.method !== 'POST') {
      res.writeHead(405, { 'Content-Type': 'application/json; charset=UTF-8', 'Allow': 'POST' });
      res.end(JSON.stringify({ error: 'Method Not Allowed. Use POST.' }));
      return;
    }

    let body = '';
    const MAX_SIZE = 100 * 1024; // 100 KB limit
    let tooLarge = false;

    req.on('data', chunk => {
      body += chunk;
      if (body.length > MAX_SIZE) {
        tooLarge = true;
        res.writeHead(413, { 'Content-Type': 'application/json; charset=UTF-8' });
        res.end(JSON.stringify({ error: 'Payload too large.' }));
        req.destroy();
      }
    });

    req.on('end', async () => {
      if (tooLarge) return;

      let payload = {};
      try {
        if (body.trim()) {
          payload = JSON.parse(body);
        }
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json; charset=UTF-8' });
        res.end(JSON.stringify({ error: 'Malformed JSON payload.' }));
        return;
      }

      const clientIp = req.headers['x-forwarded-for']?.split(',')[0].trim() || req.socket.remoteAddress || '127.0.0.1';

      const result = await handleContactSubmission({
        name: payload.name,
        email: payload.email,
        subject: payload.subject,
        message: payload.message,
        honeypot: payload.company_field,
        clientIp,
        testMode: payload.testMode
      });

      res.writeHead(result.status, { 'Content-Type': 'application/json; charset=UTF-8' });
      res.end(JSON.stringify(result.data));
    });
    return;
  }

  // 2. Static File Serving
  const resolved = resolveFilePath(req.url);

  if (!resolved) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=UTF-8' });
    res.end('404 Not Found');
    return;
  }

  const ext = path.extname(resolved).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  if (req.method === 'HEAD') {
    res.writeHead(200, { 'Content-Type': contentType });
    res.end();
    return;
  }

  fs.readFile(resolved, (err, data) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain; charset=UTF-8' });
      res.end(`500 Server Error: ${err.message}`);
      return;
    }

    res.writeHead(200, {
      'Content-Type': contentType,
      'Content-Length': data.length,
      'Cache-Control': 'no-cache, no-store, must-revalidate'
    });
    res.end(data);
  });
});

function startServer(portToTry) {
  server.listen(portToTry, HOST, () => {
    console.log('\n======================================================');
    console.log('  GOKUL DASS KANNAN: CYBERSECURITY PORTFOLIO');
    console.log('======================================================');
    console.log(`  Localhost Server is LIVE at:`);
    console.log(`  >>> http://localhost:${portToTry}`);
    console.log(`  >>> http://127.0.0.1:${portToTry}`);
    console.log('  Backend Contact API active at:');
    console.log(`  >>> http://localhost:${portToTry}/api/contact`);
    console.log('======================================================');
    console.log('  Press Ctrl+C to terminate.');
    console.log('======================================================\n');
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.warn(`[!] Port ${portToTry} is in use, attempting port ${portToTry + 1}...`);
      startServer(portToTry + 1);
    } else {
      console.error('[!] Server error:', err);
    }
  });
}

startServer(PORT);
