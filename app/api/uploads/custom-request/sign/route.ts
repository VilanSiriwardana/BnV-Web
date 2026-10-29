import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

import { rateLimit } from '@/lib/auth/rate-limit';
import { signUpload, uploadFolders } from '@/lib/cloudinary';

// Public signer for custom-request reference images: one folder, limited per IP (ADR-0021).
export async function POST() {
  const ip =
    (await headers()).get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'local';
  if (!rateLimit(`upload:custom:${ip}`, 10, 60 * 60 * 1000).ok) {
    return NextResponse.json(
      { error: 'Too many uploads. Please send more images on WhatsApp.' },
      { status: 429 },
    );
  }

  const signature = signUpload(uploadFolders.customRequests);
  if (!signature) {
    return NextResponse.json(
      { error: 'Image uploads are not available right now.' },
      { status: 503 },
    );
  }
  return NextResponse.json(signature);
}
