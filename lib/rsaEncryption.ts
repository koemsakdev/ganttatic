const base64PublicKey =
  `MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCXTYds5HO76PgpzK2fsYf8FujNuJcKVdUf+GXab3ioissCTNJ6OquZkwEPnEfhilh9ZPR4qFmw+18irKVZ+kJMu9tHqhxHCEY5Hato4wdso7lh4obWEkPbSB+NkHn6Okp49IpA8oqketlm20aeNfRUh55eKnBGShhcWOvHTJso3wIDAQAB`.replace(
    /\s+/g,
    "",
  );
const base64PrivateKey =
  `MIICdgIBADANBgkqhkiG9w0BAQEFAASCAmAwggJcAgEAAoGBAJdNh2zkc7vo+CnMrZ+xh/wW6M24lwpV1R/4ZdpveKiKywJM0no6q5mTAQ+cR+GKWH1k9HioWbD7XyKspVn6Qky720eqHEcIRjkdq2jjB2yjuWHihtYSQ9tIH42Qefo6Snj0ikDyiqR62WbbRp419FSHnl4qcEZKGFxY68dMmyjfAgMBAAECgYAWPZG+Gni+svijoFAXTM/Z6P4wm0UsgkBxUiCass8QK1K7FFLOH8iwqvC5fDX+u8jVKd1bzRdeEh1CahFmQAi1p/1l36CqtusVcYo8sONsLiEbBqXybcxlMFZTANKP0gssP0hKtI45oScaC1/fje9+se/4GK3zVq5ynffgPcKXxQJBAMUVsI36MXh8WQdjvydDjZzF5FXzBJ7/SFhXF2Ycfjx0/jfVjkpvw798uv2E3C6NrJXoBpFeYQzSRxd14oATpAsCQQDEiEmvoXUQ7hKdNEw6z+TipL9rTry3UKpa+2Go6JTxELfii80JDG4U9pGtojdwCNi48iworJhbgd3PuWmcol79AkA64/tIwW0M4qM7uQuCcQYcxWkwYZiM5h05AHUmdvclm5PnHTISfgkQ6/V4Eb41TvI2LQnhYEFBsoe5s+kFelj3AkAS/cyJEUQbv7XCxTP8luxaTmtE9lXcLQpZQmN8jAUgimoKlVHZ5v6YPf9z1PIgfGpc7OIBiDQs247QrO0cusANAkEAreb+sBwa7PB7jFX79bgfliJEIeDpMuwJHf9IxOE3QYNABV5YpRROIcPNDCJslq3DiFeiZceo57wJEiGP9e6wSw==`.replace(
    /\s+/g,
    "",
  );

export async function rsaAesEncryption(
  plainText: string,
  base64PublicKey: string,
): Promise<string> {
  try {
    const publicKey = await getPublicKey(base64PublicKey);
    const encryptedBuffer = await window.crypto.subtle.encrypt(
      { name: "RSA-OAEP" },
      publicKey,
      new TextEncoder().encode(plainText),
    );
    const bytes = new Uint8Array(encryptedBuffer);
    let binary = "";
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  } catch (error) {
    console.error("Encrypt error:", error);
    throw new Error("Encrypt error");
  }
}

export const EXAMPLE_PUBLIC_KEY = base64PublicKey;
export const EXAMPLE_PLAINTEXT = "123456";

export async function rsaAesDecryption(
  encryptedBase64: string,
  base64PrivateKey: string,
): Promise<string> {
  try {
    const encryptedBytes = Uint8Array.from(atob(encryptedBase64), (c) =>
      c.charCodeAt(0),
    );
    const privateKey = await getPrivateKey(base64PrivateKey);
    const decryptedBuffer = await window.crypto.subtle.decrypt(
      { name: "RSA-OAEP" },
      privateKey,
      encryptedBytes,
    );
    return new TextDecoder().decode(decryptedBuffer);
  } catch (error) {
    console.error("Decrypt error:", error);
    throw new Error("Decrypt error");
  }
}

async function getPublicKey(base64PublicKey: string): Promise<CryptoKey> {
  const binaryDer = Uint8Array.from(atob(base64PublicKey), (c) =>
    c.charCodeAt(0),
  );
  return await window.crypto.subtle.importKey(
    "spki",
    binaryDer.buffer,
    { name: "RSA-OAEP", hash: { name: "SHA-256" } },
    false,
    ["encrypt"],
  );
}
export async function getPrivateKey(
  base64PrivateKey: string,
): Promise<CryptoKey> {
  const binaryDer = Uint8Array.from(atob(base64PrivateKey), (c) =>
    c.charCodeAt(0),
  );
  return await crypto.subtle.importKey(
    "pkcs8",
    binaryDer.buffer,
    { name: "RSA-OAEP", hash: { name: "SHA-256" } },
    false,
    ["decrypt"],
  );
}

/**
 * Example RSA private key for testing (2048-bit) - matches the public key above
 */
export const EXAMPLE_PRIVATE_KEY = base64PrivateKey;

/**
 * Example encrypted text for testing - encrypted version of EXAMPLE_PLAINTEXT using EXAMPLE_PUBLIC_KEY
 * Note: This will vary each time due to random padding, so for testing you should encrypt EXAMPLE_PLAINTEXT first
 */
export const EXAMPLE_ENCRYPTED_TEXT =
  "csusHlsdTjd/bLa/BEcCvG33GO53jmXgCxwyJLnUT+2ofTgrToShBgNYWgnVjkaKHsGvMnbhXSQl/JtWyR/e9TvxrW/jAxGgXP9G3l1MHOrA3n6zArC3bXrPXHMJWgFw6SVu5Pa7+C6CGxotjAKN7hA5N74kpM4F9bYsO98NAls=";
