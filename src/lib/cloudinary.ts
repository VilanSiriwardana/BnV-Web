import { v2 as cloudinary } from 'cloudinary';

// Signed direct uploads (ADR-0021): the server signs, the browser sends the file straight to Cloudinary.
export const uploadFolders = {
  catalog: 'bnv/catalog',
  customRequests: 'bnv/custom-requests',
} as const;

export type UploadFolder = (typeof uploadFolders)[keyof typeof uploadFolders];

export const UPLOAD_MAX_BYTES = 5 * 1024 * 1024;
export const UPLOAD_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const;
const ALLOWED_FORMATS = 'jpg,png,webp';

function config() {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  return cloudName && apiKey && apiSecret
    ? { cloudName, apiKey, apiSecret }
    : null;
}

export function isCloudinaryConfigured() {
  return config() !== null;
}

export type UploadSignature = {
  cloudName: string;
  apiKey: string;
  timestamp: number;
  signature: string;
  folder: string;
  allowedFormats: string;
};

export function signUpload(folder: UploadFolder): UploadSignature | null {
  const c = config();
  if (!c) return null;
  const timestamp = Math.round(Date.now() / 1000);
  const signature = cloudinary.utils.api_sign_request(
    { timestamp, folder, allowed_formats: ALLOWED_FORMATS },
    c.apiSecret,
  );
  return {
    cloudName: c.cloudName,
    apiKey: c.apiKey,
    timestamp,
    signature,
    folder,
    allowedFormats: ALLOWED_FORMATS,
  };
}

// Only accepts delivery URLs from our own cloud and folder, so forms cannot store arbitrary links.
export function isOwnUploadUrl(url: string, folder: UploadFolder) {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  if (!cloudName) return false;
  try {
    const u = new URL(url);
    return (
      u.protocol === 'https:' &&
      u.hostname === 'res.cloudinary.com' &&
      u.pathname.startsWith(`/${cloudName}/image/upload/`) &&
      u.pathname.includes(`/${folder}/`)
    );
  } catch {
    return false;
  }
}
