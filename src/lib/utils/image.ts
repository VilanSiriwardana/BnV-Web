import { imagePlaceholders } from '@/data/image-placeholders';

export function blurFor(src: string | null | undefined) {
  const blurDataURL = src ? imagePlaceholders[src] : undefined;
  return blurDataURL ? { placeholder: 'blur' as const, blurDataURL } : {};
}
