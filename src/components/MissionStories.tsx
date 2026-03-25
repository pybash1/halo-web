import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function MissionStories() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ctx: gsap.Context;

    const initAnimation = () => {
      // Small timeout to ensure DOM layout has fully settled and Hero pin padding is active
      setTimeout(() => {
        if (ctx) ctx.revert();

        ctx = gsap.context(() => {
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top bottom', // Start instantly entering screen
              end: 'bottom top',   // Leave screen naturally
              scrub: true,
              invalidateOnRefresh: true,
            }
          });

          // Text Highlighting
          const words = gsap.utils.toArray('.highlight-word', textRef.current);
          tl.fromTo(words, 
            { color: 'rgba(255, 255, 255, 0.3)' }, 
            {
              color: 'rgba(255, 255, 255, 1)',
              stagger: { amount: 0.5 },
              duration: 1, 
              ease: 'none',
            },
            0 
          );

          ScrollTrigger.refresh();
        }, sectionRef);
      }, 50);
    };

    // Fix Race Condition: Wait for Hero video to pin before calculating Mission boundaries
    window.addEventListener('hero-pin-ready', initAnimation, { once: true });

    // Fallback in case the event fired before we mounted
    const fallbackTimer = setTimeout(() => {
      if (!ctx) initAnimation();
    }, 500);

    return () => {
      window.removeEventListener('hero-pin-ready', initAnimation);
      clearTimeout(fallbackTimer);
      if (ctx) ctx.revert();
    };
  }, []);

  const missionParagraphs = [
    "We believe safety should not be a luxury or something you have to worry about when you are just trying to live your life.",
    "Our mission is simple: give people the tools they need to feel secure and get help fast when it matters most.",
    "Whether someone is walking home alone, in an unsafe relationship, or facing any threat to their wellbeing, they deserve more than just hoping for the best.",
    "We are building Halo to bridge that gap between feeling vulnerable and feeling protected.",
    "Real safety features that work when you need them, designed by people who understand what it is like to feel unsafe.",
    "Everyone should be able to move through the world with confidence, knowing that help is always within reach."
  ];

  return (
    <section ref={sectionRef} className="relative w-full min-h-[100svh] py-20 md:py-32 border-y border-transparent overflow-hidden flex items-center justify-center">
      <div className="max-w-4xl mx-auto px-4 md:px-8 w-full flex items-center justify-center">
        {/* Center Column - Mission Text */}
        <div className="flex flex-col justify-center items-center z-20 relative" ref={textRef}>
          <div className="space-y-8 text-center">
            <h2 className="text-4xl md:text-6xl font-serif text-white mb-12">Our Mission</h2>
            {missionParagraphs.map((text, i) => (
              <p key={i} className="mission-paragraph font-satoshi text-2xl md:text-3xl leading-relaxed font-medium">
                {text.split(' ').map((word, j) => (
                  <span key={`${i}-${j}`} className="highlight-word inline-block mr-1.5 text-white/30">
                    {word}
                  </span>
                ))}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}