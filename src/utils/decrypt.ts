import CryptoJS from "crypto-js";

export interface EncryptedResponse {
  iv: string;
  content: string;
  tag?: string; // optional
}

export function decryptResponse<T = unknown>(data: EncryptedResponse): T {
  const encryptionKey = import.meta.env.VITE_ENCRYPTION_KEY;

  if (!encryptionKey) {
    throw new Error("VITE_ENCRYPTION_KEY is missing in environment variables.");
  }

  // 🔹 Parse the key as Base64 (not UTF-8)
  const key = CryptoJS.enc.Base64.parse(encryptionKey);
  const iv = CryptoJS.enc.Base64.parse(data.iv);

  // 🔹 Decrypt
  const decrypted = CryptoJS.AES.decrypt(
    {
      ciphertext: CryptoJS.enc.Base64.parse(data.content),
    } as CryptoJS.lib.CipherParams,
    key,
    {
      iv,
      mode: CryptoJS.mode.CBC, // or GCM if your backend uses GCM
      padding: CryptoJS.pad.Pkcs7,
    }
  );

  const text = decrypted.toString(CryptoJS.enc.Utf8);

  if (!text) {
    throw new Error("Failed to decrypt data. Invalid encryption key or IV.");
  }

  return JSON.parse(text) as T;
}