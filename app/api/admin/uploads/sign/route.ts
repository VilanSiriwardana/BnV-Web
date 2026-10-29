import { NextResponse } from 'next/server';

import { getAdmin } from '@/lib/auth/guards';
import { signUpload, uploadFolders } from '@/lib/cloudinary';

// Admin-only signer (D-12): checks the session itself rather than relying on proxy.ts.
export async function POST() {
  const admin = await getAdmin();
  if (!admin) {
    return NextResponse.json(
      { error: 'Please sign in again.' },
      { status: 401 },
    );
  }
  if (
    !admin.permissions.has('products.manage') &&
    !admin.permissions.has('catalog.manage')
  ) {
    return NextResponse.json(
      { error: 'You do not have permission to upload images.' },
      { status: 403 },
    );
  }

  const signature = signUpload(uploadFolders.catalog);
  if (!signature) {
    return NextResponse.json(
      { error: 'Image uploads are not configured yet.' },
      { status: 503 },
    );
  }
  return NextResponse.json(signature);
}
