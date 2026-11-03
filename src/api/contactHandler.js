// Server-side Contact Message Processing & Resend Integration
import fs from 'fs';
import path from 'path';

// Simple in-memory rate limiter: max 5 requests per 10 minutes per IP
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_REQUESTS_PER_WINDOW = 5;
const rateLimitMap = new Map();

// Helper to escape HTML characters and prevent HTML injection / XSS
export function escapeHtml(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// RFC 5322 compliant email regex for syntax validation
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

export function isValidEmail(email) {
  if (!email || typeof email !== 'string') return false;
  if (email.length > 254) return false;
  return EMAIL_REGEX.test(email.trim());
}

// Sanitize single-line text (e.g. subject) to prevent header injection
export function sanitizeHeader(str) {
  if (typeof str !== 'string') return '';
  return str.replace(/[\r\n\t]/g, ' ').trim();
}

// Check rate limit for an IP
export function checkRateLimit(ip) {
  const now = Date.now();
  const clientRecord = rateLimitMap.get(ip) || [];
  
  // Filter out timestamps outside the active window
  const validTimestamps = clientRecord.filter(ts => (now - ts) < RATE_LIMIT_WINDOW_MS);
  
  if (validTimestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    return false; // Rate limit exceeded
  }
  
  validTimestamps.push(now);
  rateLimitMap.set(ip, validTimestamps);
  
  // Periodic cleanup if map grows large
  if (rateLimitMap.size > 1000) {
    for (const [key, timestamps] of rateLimitMap.entries()) {
      const active = timestamps.filter(ts => (now - ts) < RATE_LIMIT_WINDOW_MS);
      if (active.length === 0) {
        rateLimitMap.delete(key);
      } else {
        rateLimitMap.set(key, active);
      }
    }
  }
  
  return true;
}

// Helper to load .env variables into process.env
export function loadEnvFile(envPath) {
  try {
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf-8');
      const lines = content.split(/\r?\n/);
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;
        const eqIdx = trimmed.indexOf('=');
        if (eqIdx !== -1) {
          const key = trimmed.slice(0, eqIdx).trim();
          let val = trimmed.slice(eqIdx + 1).trim();
          // Remove wrapping quotes if present
          if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
            val = val.slice(1, -1);
          }
          if (val !== undefined && val !== '') {
            process.env[key] = val;
          }
        }
      }
    }
  } catch (err) {
    // Silently continue if .env cannot be read
  }
}

/**
 * Core handler to validate input and dispatch email through Resend API
 */
export async function handleContactSubmission({ name, email, subject, message, honeypot, clientIp, testMode = false }) {
  // Always load latest .env configuration dynamically
  loadEnvFile(path.join(process.cwd(), '.env'));
  // 1. Anti-spam honeypot detection
  // If the hidden honeypot field is filled, silently return 200 without calling Resend
  if (honeypot && String(honeypot).trim() !== '') {
    console.warn(`[Anti-Spam] Honeypot triggered from IP ${clientIp}. Silently dropping request.`);
    return {
      status: 200,
      data: { success: true, message: "Message transmitted successfully! Thank you for reaching out." }
    };
  }

  // 2. Input Validation (Validate before consuming rate limit quota)
  const trimmedName = typeof name === 'string' ? name.trim() : '';
  const trimmedEmail = typeof email === 'string' ? email.trim() : '';
  const trimmedSubject = typeof subject === 'string' ? subject.trim() : '';
  const trimmedMessage = typeof message === 'string' ? message.trim() : '';

  if (!trimmedName) {
    return { status: 400, data: { error: "Full Name is required." } };
  }
  if (trimmedName.length > 100) {
    return { status: 400, data: { error: "Full Name must not exceed 100 characters." } };
  }

  if (!trimmedEmail) {
    return { status: 400, data: { error: "Email Address is required." } };
  }
  if (!isValidEmail(trimmedEmail)) {
    return { status: 400, data: { error: "Please enter a valid email address." } };
  }

  if (trimmedSubject.length > 200) {
    return { status: 400, data: { error: "Subject must not exceed 200 characters." } };
  }

  if (!trimmedMessage) {
    return { status: 400, data: { error: "Message is required." } };
  }
  if (trimmedMessage.length > 5000) {
    return { status: 400, data: { error: "Message must not exceed 5000 characters." } };
  }

  // 3. Handle simulated / test mode
  if (testMode === 'simulate_success') {
    return {
      status: 200,
      data: { success: true, id: "simulated_success_id", message: "Message transmitted successfully! Thank you for reaching out." }
    };
  }
  if (testMode === 'simulate_error') {
    return {
      status: 500,
      data: { error: "Unable to send your message right now. Please try again later." }
    };
  }

  // 4. Rate limiting check (protects Resend email sending)
  if (clientIp && !checkRateLimit(clientIp)) {
    return {
      status: 429,
      data: { error: "Too many messages sent. Please wait a few minutes before trying again." }
    };
  }

  // 5. Check Environment Configuration
  const resendApiKey = process.env.RESEND_API_KEY;
  const contactEmail = process.env.CONTACT_EMAIL;
  const fromEmail = process.env.FROM_EMAIL;

  // Check if credentials are placeholders or missing
  const isKeyMissingOrPlaceholder = !resendApiKey || resendApiKey.includes('your_actual_api_key') || !resendApiKey.startsWith('re_');
  const isContactEmailMissingOrPlaceholder = !contactEmail || contactEmail.includes('example.com');
  const isFromEmailMissingOrPlaceholder = !fromEmail || fromEmail.includes('example.com');

  if (isKeyMissingOrPlaceholder || isContactEmailMissingOrPlaceholder || isFromEmailMissingOrPlaceholder) {
    console.error(`[Contact API] Configuration Error: Resend credentials not fully configured in environment.`);
    console.error(`  - RESEND_API_KEY present: ${Boolean(resendApiKey)} (Valid prefix: ${resendApiKey?.startsWith('re_')})`);
    console.error(`  - CONTACT_EMAIL: ${contactEmail || '[MISSING]'}`);
    console.error(`  - FROM_EMAIL: ${fromEmail || '[MISSING]'}`);

    let specificError = "Unable to send your message right now. Please try again later.";
    if (isKeyMissingOrPlaceholder) {
      specificError = "Message delivery is temporarily unavailable. Please email gokuldass0710@gmail.com directly.";
    } else if (isContactEmailMissingOrPlaceholder) {
      specificError = "Setup required: Please set your receiving email in CONTACT_EMAIL in the .env file.";
    }

    return {
      status: 500,
      data: { error: specificError }
    };
  }

  // 5. Build Safe Email Content
  const serverTimestamp = new Date().toISOString();
  const formattedDate = new Date().toUTCString();

  const sanitizedSubjectHeader = sanitizeHeader(trimmedSubject);
  const emailSubject = sanitizedSubjectHeader 
    ? `New Portfolio Message: ${sanitizedSubjectHeader}`
    : `New Message from Your Cybersecurity Portfolio`;

  const escapedName = escapeHtml(trimmedName);
  const escapedEmail = escapeHtml(trimmedEmail);
  const escapedSubject = escapeHtml(sanitizedSubjectHeader || '(No subject provided)');
  const escapedMessage = escapeHtml(trimmedMessage).replace(/\n/g, '<br />');

  // HTML Email Template styled in dark cybersecurity aesthetic
  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${escapeHtml(emailSubject)}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #080B10; color: #F8FAFC; margin: 0; padding: 24px; line-height: 1.6; }
    .card { background-color: #111827; border: 1px solid #263244; border-radius: 8px; max-width: 600px; margin: 0 auto; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.5); }
    .header { background-color: #0D121B; padding: 20px 24px; border-bottom: 2px solid #00F5A0; }
    .header h2 { margin: 0; font-size: 20px; color: #00F5A0; letter-spacing: -0.01em; }
    .header p { margin: 4px 0 0 0; font-size: 13px; color: #94A3B8; }
    .body { padding: 24px; }
    .meta-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
    .meta-table td { padding: 8px 0; border-bottom: 1px solid #1F2937; font-size: 14px; vertical-align: top; }
    .meta-label { color: #94A3B8; width: 130px; font-weight: 600; }
    .meta-value { color: #F8FAFC; font-weight: 500; }
    .meta-value a { color: #38BDF8; text-decoration: none; }
    .message-box { background-color: #080B10; border: 1px solid #263244; border-radius: 6px; padding: 18px; margin-top: 10px; font-size: 14px; color: #F8FAFC; line-height: 1.7; word-break: break-word; }
    .footer { padding: 16px 24px; background-color: #0D121B; border-top: 1px solid #1F2937; font-size: 12px; color: #64748B; text-align: center; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <h2>🛡️ New Portfolio Contact Message</h2>
      <p>Submitted via Gokul Dass Kannan Cybersecurity Portfolio</p>
    </div>
    <div class="body">
      <table class="meta-table">
        <tr>
          <td class="meta-label">Visitor Name:</td>
          <td class="meta-value"><strong>${escapedName}</strong></td>
        </tr>
        <tr>
          <td class="meta-label">Visitor Email:</td>
          <td class="meta-value"><a href="mailto:${escapedEmail}">${escapedEmail}</a></td>
        </tr>
        <tr>
          <td class="meta-label">Subject:</td>
          <td class="meta-value">${escapedSubject}</td>
        </tr>
        <tr>
          <td class="meta-label">Received At:</td>
          <td class="meta-value">${formattedDate} <span style="color:#64748B;">(${serverTimestamp})</span></td>
        </tr>
      </table>

      <div style="font-weight: 600; color: #94A3B8; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 6px;">
        Message Content:
      </div>
      <div class="message-box">
        ${escapedMessage}
      </div>
    </div>
    <div class="footer">
      Reply directly to this email to respond to ${escapedName} (${escapedEmail}).
    </div>
  </div>
</body>
</html>
  `.trim();

  // Plain-text Fallback
  const textContent = `
New Portfolio Contact Message
========================================
Visitor Name:  ${trimmedName}
Visitor Email: ${trimmedEmail}
Subject:       ${sanitizedSubjectHeader || '(No subject provided)'}
Received At:   ${formattedDate} (${serverTimestamp})
========================================

Message:
${trimmedMessage}

----------------------------------------
Reply directly to this email to respond to ${trimmedName} (${trimmedEmail}).
  `.trim();

  // 6. Send via Resend REST API
  try {
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [contactEmail],
        reply_to: trimmedEmail,
        subject: emailSubject,
        html: htmlContent,
        text: textContent
      })
    });

    const resendData = await resendResponse.json().catch(() => ({}));

    if (!resendResponse.ok) {
      console.error(`[Contact API] Resend API error (${resendResponse.status}):`, resendData);
      return {
        status: 500,
        data: { error: "Unable to send your message right now. Please try again later." }
      };
    }

    console.log(`[Contact API] Email dispatched successfully via Resend. Message ID: ${resendData.id}`);
    return {
      status: 200,
      data: {
        success: true,
        id: resendData.id,
        message: "Message transmitted successfully! Thank you for reaching out."
      }
    };
  } catch (err) {
    console.error('[Contact API] Network/Unexpected error communicating with Resend:', err.message);
    return {
      status: 500,
      data: { error: "Unable to send your message right now. Please try again later." }
    };
  }
}
