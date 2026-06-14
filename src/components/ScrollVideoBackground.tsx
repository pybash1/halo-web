import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function ScrollVideoBackground() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    (window as any).__haloHeroPinReady = false;
    (window as any).__haloHeroVideoBuffered = false;

    let tween: gsap.core.Tween | gsap.core.Timeline | null = null;
    let rafId = 0;
    let fallbackTimer = 0;
    const state = { target: 0, current: 0, duration: 0 };

    const render = () => {
      state.current += (state.target - state.current) * 0.35;
      const clamped = gsap.utils.clamp(0, state.duration, state.current);
      if (Math.abs(video.currentTime - clamped) > 0.001) {
        video.currentTime = clamped;
      }
      rafId = window.requestAnimationFrame(render);
    };

    const init = () => {
      if (!video.duration || Number.isNaN(video.duration) || !Number.isFinite(video.duration)) return;

      state.duration = video.duration;
      state.target = 0;
      state.current = 0;
      video.currentTime = 0;

      tween?.kill();

      const tl = gsap.timeline({
        scrollTrigger: {
          id: 'hero-scroll',
          trigger: '#hero-section',
          start: 'top top',
          end: '+=150%',
          scrub: 1, 
          pin: true,
          fastScrollEnd: true,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const isDissolved = self.progress > 0.8; // Adjusted progress scale
            window.dispatchEvent(new CustomEvent('hero-dissolve-progress', { detail: isDissolved }));
          }
        },
      });

      // 1. Video scrubs evenly across the whole scroll duration
      tl.to(
        state,
        {
          target: state.duration,
          duration: 1,
          ease: 'none',
        },
        0
      );

      // 2. Optical Camera Zoom
      tl.fromTo(
        video,
        { scale: 1 },
        {
          scale: 5, 
          duration: 1, // Stretch to end of timeline
          ease: 'power3.in', 
          force3D: true, 
        },
        0 
      );

      // 3. Text Hold & Dissolve
      tl.fromTo(
        '#hero-content',
        { opacity: 1 },
        {
          opacity: 0,
          duration: 0.2,
          ease: 'power2.inOut',
          force3D: true,
        },
        0.8 // Trigger pushed to 0.8
      );

      // 4. Fade through black before the following section takes over.
      tl.fromTo(
        '#video-overlay',
        { backgroundColor: 'rgba(0, 0, 0, 0.2)' },
        {
          backgroundColor: 'rgba(0, 0, 0, 1)',
          duration: 0.2,
          ease: 'power1.inOut',
        },
        0.8 // Ends at 1.0 exactly
      );

      // 5. Also fade the document body
      tl.fromTo(
        'body',
        { backgroundColor: 'rgba(0, 0, 0, 1)' },
        {
          backgroundColor: 'rgba(0, 0, 0, 1)',
          duration: 0.2,
          ease: 'power1.inOut',
        },
        0.8 // Ends at 1.0 exactly
      );

      tween = tl;

      if (rafId) {
        window.cancelAnimationFrame(rafId);
      }
      rafId = window.requestAnimationFrame(render);
      ScrollTrigger.refresh();

      // Dispatch event strictly AFTER the hero pin spacer has been fully calculated and injected
      window.clearTimeout(fallbackTimer);
      markPinReady();
    };

    const markPinReady = () => {
      if ((window as any).__haloHeroPinReady) return;
      (window as any).__haloHeroPinReady = true;
      window.dispatchEvent(new CustomEvent('hero-pin-ready'));
    };

    // Lets the loading screen know the video has enough data buffered to be
    // scrubbed smoothly, so scroll-driven seeking doesn't stall/jump on prod.
    const markVideoBuffered = () => {
      if ((window as any).__haloHeroVideoBuffered) return;
      (window as any).__haloHeroVideoBuffered = true;
      window.dispatchEvent(new CustomEvent('hero-video-buffered'));
    };

    const handleLoadedMetadata = () => {
      init();
    };

    const handleCanPlayThrough = () => {
      markVideoBuffered();
    };

    let retried = false;
    const handleError = () => {
      if ((window as any).__haloHeroPinReady) return;

      // The video source can intermittently fail to load (e.g. a transient
      // CDN error). Retry once before giving up so the rest of the page
      // doesn't get stuck waiting on the hero pin/scroll effect.
      if (!retried) {
        retried = true;
        window.setTimeout(() => video.load(), 600);
        return;
      }

      window.clearTimeout(fallbackTimer);
      markPinReady();
      markVideoBuffered();
    };

    video.pause();
    video.muted = true;
    video.playsInline = true;
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('canplaythrough', handleCanPlayThrough);
    video.addEventListener('error', handleError);

    if (video.readyState >= 1) {
      init();
    }
    if (video.readyState >= 4) {
      markVideoBuffered();
    }

    // Safety net: never let the rest of the page wait forever on the hero video.
    fallbackTimer = window.setTimeout(() => {
      markPinReady();
      markVideoBuffered();
    }, 6000);

    const handleResize = () => ScrollTrigger.refresh();
    window.addEventListener('resize', handleResize);

    return () => {
      window.clearTimeout(fallbackTimer);
      window.removeEventListener('resize', handleResize);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('canplaythrough', handleCanPlayThrough);
      video.removeEventListener('error', handleError);
      if (rafId) {
        window.cancelAnimationFrame(rafId);
      }
      if (tween) {
        tween.kill();
        if ((tween as any).scrollTrigger) {
          (tween as any).scrollTrigger.kill();
        }
      }
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-black">
      <video
        ref={videoRef}
        src="/media/sky_bg.mp4"
        poster="/media/sky_bg_poster.webp"
        className="h-full w-full object-cover"
        muted
        playsInline
        preload="auto"
      />

      <div id="video-overlay" className="absolute inset-0 bg-black/20" />
    </div>
  );
}
