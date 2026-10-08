import QRCode from 'qrcode';

/**
 * Generates a unique 14-digit demo health identifier inspired by digital registries
 * Formatted as XXXX-XXXX-XXXX-XX
 */
export function generateHealthId(): string {
  // Generate 14 random digits
  let digits = '';
  for (let i = 0; i < 14; i++) {
    const digit = Math.floor(Math.random() * 10);
    digits += (i === 0 && digit === 0) ? '9' : digit.toString();
  }
  // Format as 4-4-4-2
  return `${digits.slice(0, 4)}-${digits.slice(4, 8)}-${digits.slice(8, 12)}-${digits.slice(12, 14)}`;
}

/**
 * Normalizes health ID by stripping spaces, hyphens, and dashes
 */
export function normalizeHealthId(id: string): string {
  return id.replace(/[^0-9]/g, '');
}

/**
 * Formats a 14-digit numeric string to standard display format XXXX-XXXX-XXXX-XX
 */
export function formatHealthId(rawId: string): string {
  const clean = normalizeHealthId(rawId);
  if (clean.length !== 14) return rawId;
  return `${clean.slice(0, 4)}-${clean.slice(4, 8)}-${clean.slice(8, 12)}-${clean.slice(12, 14)}`;
}

/**
 * Generates high-quality QR code data URL for a given patient Health ID
 */
export async function generateHealthIdQRCode(healthId: string): Promise<string> {
  try {
    const qrPayload = JSON.stringify({
      app: 'THULIR_HEALTH_COPILOT',
      healthId,
      timestamp: Date.now(),
    });
    const url = await QRCode.toDataURL(qrPayload, {
      errorCorrectionLevel: 'H',
      margin: 2,
      width: 320,
      color: {
        dark: '#0f766e', // Deep healthcare teal
        light: '#ffffff',
      },
    });
    return url;
  } catch (err) {
    console.error('Failed to generate QR Code:', err);
    // Fallback QR with plain string
    return QRCode.toDataURL(healthId);
  }
}
