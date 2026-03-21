import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function ScrollVideoBackground() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;

    if (!video) return;

    let tween: gsap.core.Tween | null = null;
    let rafId = 0;
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

      tween = gsap.to(state, {
        target: state.duration,
        duration: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: document.body,
          start: 'top top',
          end: 'max',
          scrub: 0.35,
          fastScrollEnd: true,
          invalidateOnRefresh: true,
        },
      });

      if (rafId) {
        window.cancelAnimationFrame(rafId);
      }
      rafId = window.requestAnimationFrame(render);
      ScrollTrigger.refresh();
    };

    const handleLoadedMetadata = () => {
      init();
    };

    video.pause();
    video.muted = true;
    video.playsInline = true;

    if (video.readyState >= 1) {
      init();
    } else {
      video.addEventListener('loadedmetadata', handleLoadedMetadata, { once: true });
    }

    const handleResize = () => ScrollTrigger.refresh();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      if (rafId) {
        window.cancelAnimationFrame(rafId);
      }
      tween?.kill();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-black">
      <video
        ref={videoRef}
        src="/media/sky_bg.mp4"
        className="h-full w-full object-cover"
        muted
        playsInline
        preload="auto"
      />

      <div className="absolute inset-0 bg-black/20" />
    </div>
  );
}
