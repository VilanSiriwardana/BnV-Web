export type PhotoRef = {
  src: string;
  alt: string;
  width: number;
  height: number;
  blur?: string;
  /** Gallery only: one short line shown in gold when the photo is opened. */
  note?: string;
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
    starlightLine: string;
    galleryTitle: string;
    danceTitle: string;
    danceLine: string;
    wishPrompt: string;
    wishDone: string;
    letterTitle: string;
    finaleMessage: string;
    bloomLines?: [string, string, string];
    bloomEmphasis?: string;
    reasonsTitle?: string;
    reasonsHint?: string;
    skyHint?: string;
    skyDone?: string;
    skyReveal?: string[];
    blowHint?: string;
    afterglowTitle?: string;
    afterglowIntro?: string;
  };
  memories: {
    id: string;
    title: string;
    date: string;
    caption: string;
    photo: PhotoRef;
    /** 512 px square texture for the 3D orb; falls back to photo.src. */
    orb?: string;
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
  /** Spotlit end frame of the gallery walk; falls back to gallery[0]. */
  galleryEnd?: PhotoRef;
  letter: {
    salutation?: string;
    paragraphs: string[];
    signoff: string;
    passphrase?: string;
    voice?: { src: string; transcript: string; label?: string };
  };
  music: { src: string; credit: string };
  reasons?: string[];
  wish?: { mode?: 'candle' | 'star' };
  finale?: { spell?: { line1?: string; line2?: string } };
  afterglow?: {
    gifts?: {
      mode: 'pick-one' | 'open-all' | 'sequence';
      items: {
        id: string;
        label: string;
        title: string;
        text: string;
        plan?: {
          startsAt: string;
          durationMin: number;
          place: string;
          mapsQuery?: string;
          note?: string;
        };
      }[];
    };
    openWhen?: {
      id: string;
      label: string;
      paragraphs: string[];
      unlockAt?: string;
    }[];
    openWhenIntro?: string;
    secret?: { title: string; paragraphs: string[]; photo?: PhotoRef };
  };
  hidden?: { hint: string };
};
