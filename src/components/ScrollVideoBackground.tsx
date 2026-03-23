import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function ScrollVideoBackground() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let tween: gsap.core.Tween | gsap.core.Timeline | null = null;
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

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: '#hero-section',
          start: 'top top',
          end: '+=400%',
          scrub: 1, // Increased from 0.35 to 1 for buttery smooth, anti-jitter scroll interpolation
          pin: true,
          fastScrollEnd: true,
          invalidateOnRefresh: true,
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

      // 2. Optical Camera Zoom: Mimics moving physically forward through space.
      // Scaling exponentially ('power3.in') keeps the initial motion focused on the video scrubbing,
      // and only accelerates the zoom at the end—perfectly mirroring how pushing a camera forward works.
      tl.fromTo(
        video,
        { scale: 1 },
        {
          scale: 5, // Reduced from 10 to eliminate synthetic "digital stretch" and emphasize real motion
          duration: 0.95, 
          ease: 'power3.in', 
          force3D: true, 
        },
        0 
      );

      // 3. Text Hold & Dissolve: Text stays completely static and dissolves right when the frame hits a specific cloud texture depth
      tl.fromTo(
        '#hero-content',
        { opacity: 1 },
        {
          opacity: 0,
          duration: 0.15,
          ease: 'power2.inOut',
          force3D: true,
        },
        0.65 // Trigger pushed significantly deeper into the scroll to match the latest provided screenshot.
      );

      // 4. Solid pure blue sweeps in smoothly into the background, peaking exactly as the zoom finishes
      tl.fromTo(
        '#video-overlay',
        { backgroundColor: 'rgba(0, 0, 0, 0.2)' },
        {
          backgroundColor: 'rgba(56, 114, 169, 1)', // Completely opaque sky blue
          duration: 0.20,
          ease: 'power1.inOut',
        },
        0.75
      );

      tween = tl;

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

      <div id="video-overlay" className="absolute inset-0 bg-black/20" />
    </div>
  );
}
