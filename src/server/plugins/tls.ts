/**
 * tls.ts — Nitro server plugin for TLS certificate support
 *
 * Note: Nitro itself runs on plain HTTP (NITRO_PORT, bound to 127.0.0.1).
 * HTTPS termination is handled externally by tls-proxy.js, which forwards
 * decrypted traffic to Nitro and hot-reloads certificates on renewal.
 *
 * This plugin only logs certificate status at startup for observability.
 */
import fs from 'node:fs';

const CERT_PATH = '/root/cert/ip/fullchain.pem';
const KEY_PATH = '/root/cert/ip/privkey.pem';

export default defineNitroPlugin((_nitroApp) => {
  const legoEnabled = process.env.LEGO_ENABLED === 'true';
  const insecure = process.env.INSECURE === 'true';

  if (!legoEnabled || insecure) {
    console.log(
      '[tls] Running in HTTP mode (LEGO_ENABLED != true or INSECURE=true)'
    );
    return;
  }

  // Verify certs exist — entrypoint.sh validates them before Nitro starts
  if (!fs.existsSync(CERT_PATH) || !fs.existsSync(KEY_PATH)) {
    console.error(
      '[tls] ERROR: Certificate files not found!\n' +
        `Expected: ${CERT_PATH}\n` +
        `         ${KEY_PATH}`
    );
    return;
  }

  try {
    const stat = fs.statSync(CERT_PATH);
    console.log(
      `[tls] Certificate present: ${CERT_PATH} (modified: ${stat.mtime.toISOString()})`
    );
    console.log(
      `[tls] TLS proxy will handle HTTPS for: ${process.env.LEGO_IP || process.env.HOST}`
    );
  } catch {
    // Non-fatal
  }
});
