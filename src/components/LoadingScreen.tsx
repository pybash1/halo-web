import { useEffect, useState } from 'react';

// Safety net so the loading screen can never get stuck if the hero video
// fails to load or `hero-pin-ready` never fires for some reason.
const maxWaitMs = 6000;

export default function LoadingScreen() {
  const [isVisible, setIsVisible] = useState(true);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
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

    const heroReady = (window as any).__haloHeroPinReady
      ? Promise.resolve()
      : new Promise<void>((resolve) => {
          window.addEventListener('hero-pin-ready', () => resolve(), { once: true });
        });

    const fontsReady = 'fonts' in document ? document.fonts.ready.then(() => undefined) : Promise.resolve();

    const maxWait = new Promise<void>((resolve) => window.setTimeout(resolve, maxWaitMs));

    Promise.race([Promise.all([heroReady, fontsReady]), maxWait]).then(finish);

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
          <div className="h-full w-1/3 animate-[loading-bar_1.1s_ease-in-out_infinite] bg-white" />
        </div>
        <p className="mt-4 font-satoshi text-[10px] font-semibold uppercase tracking-[0.34em] text-white/45">
          Loading
        </p>
      </div>
    </div>
  );
}
