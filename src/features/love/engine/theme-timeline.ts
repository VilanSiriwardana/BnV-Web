import gsap from 'gsap';

// Night → day (Experience §3.1, §10): one scrubbed number each. Text in Dawn appears only after 75 %.
export function buildTheme(root: HTMLElement) {
  gsap.fromTo(
    root,
    { '--dawn': 0 },
    {
      '--dawn': 1,
      ease: 'none',
      scrollTrigger: {
        trigger: '#dawn',
        start: 'top 80%',
        end: 'bottom 20%',
        scrub: true,
      },
    },
  );

  gsap.fromTo(
    root,
    { '--depth': 0 },
    {
      '--depth': 0.5,
      ease: 'none',
      immediateRender: false,
      scrollTrigger: {
        trigger: '#memories',
        start: 'top bottom',
        end: 'bottom bottom',
        scrub: true,
      },
    },
  );

  gsap.fromTo(
    root,
    { '--depth': 0.5 },
    {
      '--depth': 1,
      ease: 'none',
      immediateRender: false,
      scrollTrigger: {
        trigger: '#timeline',
        start: 'top bottom',
        end: 'bottom bottom',
        scrub: true,
      },
    },
  );
}

export function clearTheme(root: HTMLElement) {
  root.style.removeProperty('--dawn');
  root.style.removeProperty('--depth');
}
