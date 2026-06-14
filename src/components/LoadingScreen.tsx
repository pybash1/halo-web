import { useEffect, useState } from 'react';
import { clippings } from '../lib/clippings';
import { preloadImagesWithConcurrency } from '../lib/preloadImage';

// Safety net so the loading screen can never get stuck if an asset fails to
// load or a readiness signal never fires for some reason.
const maxWaitMs = 12000;

const posterSrc = '/media/sky_bg_poster.webp';
const imageSources = [posterSrc, ...clippings.map((clipping) => clipping.src)];

export default function LoadingScreen() {
  const [isVisible, setIsVisible] = useState(true);
  const [isLeaving, setIsLeaving] = useState(false);
  const [loadedCount, setLoadedCount] = useState(0);

  const progress = Math.round((loadedCount / imageSources.length) * 100);

  useEffect(() => {
    let cancelled = false;
    let loaded = 0;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const finish = () => {
      if (cancelled) return;
      setIsLeaving(true);

      window.setTimeout(() => {
        if (!cancelled) {
          setIsVisible(false);
          document.body.style.overflow = originalOverflow;
        }
      }, 400);
    };

    const heroPinReady = (window as any).__haloHeroPinReady
      ? Promise.resolve()
      : new Promise<void>((resolve) => {
          window.addEventListener('hero-pin-ready', () => resolve(), { once: true });
        });

    const videoBuffered = (window as any).__haloHeroVideoBuffered
      ? Promise.resolve()
      : new Promise<void>((resolve) => {
          window.addEventListener('hero-video-buffered', () => resolve(), { once: true });
        });

    const fontsReady = 'fonts' in document ? document.fonts.ready.then(() => undefined) : Promise.resolve();

    const imagesReady = preloadImagesWithConcurrency(imageSources, 6, () => {
      loaded += 1;
      if (!cancelled) setLoadedCount(loaded);
    });

    const maxWait = new Promise<void>((resolve) => window.setTimeout(resolve, maxWaitMs));

    Promise.race([Promise.all([heroPinReady, videoBuffered, fontsReady, imagesReady]), maxWait]).then(finish);

    return () => {
      cancelled = true;
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className={[
        'fixed inset-0 z-[9999] flex items-center justify-center bg-black text-white',
        'transition-opacity duration-300 ease-out',
        isLeaving ? 'pointer-events-none opacity-0' : 'opacity-100',
      ].join(' ')}
      aria-live="polite"
      aria-busy={!isLeaving}
    >
      <div className="w-full min-w-[220px] max-w-[76vw] text-center">
        <p className="font-serif text-6xl leading-none md:text-8xl">HALO</p>
        <div className="mt-8 h-px w-full overflow-hidden bg-white/18">
          <div
            className="h-full bg-white transition-[width] duration-200 ease-out"
            style={{ width: `${Math.max(progress, 4)}%` }}
          />
        </div>
        <p className="mt-4 font-satoshi text-[10px] font-semibold uppercase tracking-[0.34em] text-white/45">
          Loading
        </p>
      </div>
    </div>
  );
}
