import { useEffect, useMemo, useState } from 'react';

const criticalClippingCount = 12;
const criticalAssets = [
  '/media/sky_bg_poster.webp',
  ...Array.from({ length: criticalClippingCount }, (_, index) => {
    const id = String(index + 1).padStart(2, '0');
    return `/news/clippings/news-${id}.webp`;
  }),
];

const preloadImage = (src: string) =>
  new Promise<void>((resolve) => {
    const image = new Image();

    const finish = async () => {
      try {
        await image.decode();
      } catch {
        // A failed decode should not trap the user behind the loader.
      }

      resolve();
    };

    image.onload = finish;
    image.onerror = finish;
    image.src = src;
  });

const preloadVideoMetadata = (src: string) =>
  new Promise<void>((resolve) => {
    const video = document.createElement('video');
    let settled = false;

    const finish = () => {
      if (settled) return;
      settled = true;
      video.removeAttribute('src');
      video.load();
      resolve();
    };

    video.preload = 'metadata';
    video.muted = true;
    video.playsInline = true;
    video.addEventListener('loadedmetadata', finish, { once: true });
    video.addEventListener('error', finish, { once: true });
    video.src = src;
    video.load();
  });

export default function LoadingScreen() {
  const [loadedTasks, setLoadedTasks] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isLeaving, setIsLeaving] = useState(false);

  const totalTasks = useMemo(() => criticalAssets.length + 2, []);
  const progress = Math.min(100, Math.round((loadedTasks / totalTasks) * 100));

  useEffect(() => {
    let cancelled = false;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const markLoaded = () => {
      if (!cancelled) {
        setLoadedTasks((count) => Math.min(totalTasks, count + 1));
      }
    };

    const minimumDelay = new Promise<void>((resolve) => window.setTimeout(resolve, 900));
    const maximumDelay = new Promise<void>((resolve) => window.setTimeout(resolve, 6500));
    const fontsReady = 'fonts' in document ? document.fonts.ready.then(() => undefined) : Promise.resolve();

    const assetTasks = [
      preloadVideoMetadata('/media/sky_bg.mp4').then(markLoaded),
      fontsReady.then(markLoaded),
      ...criticalAssets.map((asset) => preloadImage(asset).then(markLoaded)),
    ];

    Promise.race([
      Promise.all([minimumDelay, Promise.all(assetTasks)]),
      maximumDelay,
    ]).then(() => {
      if (cancelled) return;

      setLoadedTasks(totalTasks);
      setIsLeaving(true);

      window.setTimeout(() => {
        if (!cancelled) {
          setIsVisible(false);
          document.body.style.overflow = originalOverflow;
        }
      }, 520);
    });

    return () => {
      cancelled = true;
      document.body.style.overflow = originalOverflow;
    };
  }, [totalTasks]);

  if (!isVisible) return null;

  return (
    <div
      className={[
        'fixed inset-0 z-[9999] flex items-center justify-center bg-black text-white',
        'transition-opacity duration-500 ease-out',
        isLeaving ? 'pointer-events-none opacity-0' : 'opacity-100',
      ].join(' ')}
      aria-live="polite"
      aria-busy={!isLeaving}
    >
      <div className="w-full min-w-[220px] max-w-[76vw] text-center">
        <p className="font-serif text-6xl leading-none md:text-8xl">HALO</p>
        <div className="mt-8 h-px w-full overflow-hidden bg-white/18">
          <div
            className="h-full bg-white transition-[width] duration-300 ease-out"
            style={{ width: `${Math.max(progress, 8)}%` }}
          />
        </div>
        <p className="mt-4 font-satoshi text-[10px] font-semibold uppercase tracking-[0.34em] text-white/45">
          Loading
        </p>
      </div>
    </div>
  );
}
