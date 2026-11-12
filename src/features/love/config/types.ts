export type PhotoRef = {
  src: string;
  alt: string;
  width: number;
  height: number;
  blur?: string;
};

export type LoveSiteConfig = {
  slug: string;
  recipient: { name: string };
  sender: { name: string };
  birthday: string;
  copy: {
    heroSub: string;
    bloomLine: string;
    memoriesHint: string;
    timelineTitle: string;
    dawnQuote: string;
    galleryTitle: string;
    wishPrompt: string;
    wishDone: string;
    letterTitle: string;
    finaleMessage: string;
  };
  memories: {
    id: string;
    title: string;
    date: string;
    caption: string;
    photo: PhotoRef;
  }[];
  timeline: {
    id: string;
    date: string;
    title: string;
    text: string;
    photo?: PhotoRef;
    featured?: boolean;
  }[];
  gallery: PhotoRef[];
  letter: { paragraphs: string[]; signoff: string; passphrase?: string };
  music: { src: string; credit: string };
};
