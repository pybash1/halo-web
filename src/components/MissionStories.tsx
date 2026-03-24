import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const STORIES = [
  {
    source: "BBC News",
    title: "Late Night Commute",
    snippet: "A student walking home late at night found herself followed. With no one around, she had to think fast to get to safety...",
    link: "#"
  },
  {
    source: "The Guardian",
    title: "Unexpected Threat",
    snippet: "What started as a normal evening turned into a desperate situation when a group approached him aggressively...",
    link: "#"
  },
  {
    source: "Local News",
    title: "A Close Call",
    snippet: "She noticed a car trailing her through quiet neighborhood streets. With her phone battery dying, panic set in...",
    link: "#"
  },
  {
    source: "Anonymous",
    title: "Trapped in the City",
    snippet: "Stranded downtown after the last train left, he realized the people nearby were not just passing by...",
    link: "#"
  },
  {
    source: "NY Times",
    title: "Unsafe Journey",
    snippet: "A daily route home became a terrifying ordeal, highlighting the urgent need for better personal safety tools...",
    link: "#"
  },
  {
    source: "CNN",
    title: "Subway Incident",
    snippet: "An empty subway car at midnight quickly turned into a trap when an aggressive individual blocked the only exit...",
    link: "#"
  },
  {
    source: "Sarah's Story",
    title: "The Silent Walk",
    snippet: "I always thought my neighborhood was safe, until one evening I realized I was being tracked step for step...",
    link: "#"
  },
  {
    source: "Washington Post",
    title: "Campus Security",
    snippet: "University students express growing concerns after a series of late-night incidents near the main library...",
    link: "#"
  },
  {
    source: "Mark's Account",
    title: "Nowhere to Run",
    snippet: "It happened so fast. One moment I was checking my phone, the next I was surrounded with no clear way out...",
    link: "#"
  },
  {
    source: "NPR",
    title: "The Safety Gap",
    snippet: "Why traditional emergency services often fall short in those critical first few minutes when danger strikes...",
    link: "#"
  }
];

export default function MissionStories() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);
  const rightColRef = useRef<HTMLDivElement>(null);
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

          const vh = window.innerHeight;
          const sectionH = sectionRef.current?.offsetHeight || vh;

          // 1. Center Text comes UP natively! No GSAP y translation needed.
          // This ensures ZERO blank gap; it just natively perfectly scrolls up!

          // 2. Cards come DOWN (Parallax)
          // We shift them deeply up at the start, and deeply down at the end.
          const travel = ((sectionH + vh) / 2) * 0.8;

          tl.fromTo([leftColRef.current, rightColRef.current], 
            { y: -travel }, // Start above their native center
            { y: travel, ease: 'none', duration: 1 }, // End below
            0
          );

          // 3. Text Highlighting
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

  const Card = ({ story }: { story: any }) => (
    <div className="relative overflow-hidden rounded-3xl p-6 md:p-8 flex flex-col gap-4 border border-white/20 shadow-[0_10px_30px_rgba(0,0,0,0.2)]"
         style={{
           background: 'linear-gradient(120deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.02))',
           backdropFilter: 'blur(16px)',
           WebkitBackdropFilter: 'blur(16px)'
         }}>
      {/* Glossy overlay effect */}
      <div className="absolute inset-0 pointer-events-none opacity-20 mix-blend-overlay"
           style={{
             backgroundImage: 'radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.8) 0.6px, transparent 0.8px)',
             backgroundSize: '4px 4px'
           }} />
           
      <h3 className="text-xl md:text-2xl font-bold font-serif text-white z-10">{story.source}</h3>
      <div className="w-full h-[1px] bg-white/20 z-10" />
      <h4 className="text-lg font-bold text-white z-10">{story.title}</h4>
      <p className="font-satoshi text-base text-white/80 leading-relaxed z-10">
        {story.snippet}
      </p>
      <div className="w-full h-[1px] bg-white/20 z-10 mt-auto" />
      <a href={story.link} className="text-sm font-medium text-white hover:text-white/70 transition-colors flex items-center gap-1 z-10 w-fit">
        Read full story ↗
      </a>
    </div>
  );

  const missionParagraphs = [
    "We believe safety should not be a luxury or something you have to worry about when you are just trying to live your life.",
    "Our mission is simple: give people the tools they need to feel secure and get help fast when it matters most.",
    "Whether someone is walking home alone, in an unsafe relationship, or facing any threat to their wellbeing, they deserve more than just hoping for the best.",
    "We are building Halo to bridge that gap between feeling vulnerable and feeling protected.",
    "Real safety features that work when you need them, designed by people who understand what it is like to feel unsafe.",
    "Everyone should be able to move through the world with confidence, knowing that help is always within reach."
  ];

  return (
    <section ref={sectionRef} className="relative w-full min-h-[130svh] py-20 md:py-32 border-y border-transparent overflow-hidden flex items-center justify-center">
      {/* The flex container perfectly centers the grid physically in the viewport */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 w-full flex items-center justify-center">
        {/* The grid items are centered vertically, ensuring 'y: 0' is the exact visual middle of the screen */}
        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr_300px] gap-8 md:gap-16 w-full relative items-center">
          
          {/* Left Column - Cards (5) */}
          <div className="hidden md:flex flex-col gap-8 relative h-max" ref={leftColRef}>
            {STORIES.slice(0, 5).map((story, i) => (
              <Card key={i} story={story} />
            ))}
          </div>

          {/* Center Column - Mission Text */}
          <div className="flex flex-col justify-center items-center z-20 relative h-max" ref={textRef}>
            <div className="space-y-8 max-w-lg mx-auto text-center">
              <h2 className="text-4xl md:text-6xl font-serif text-white mb-12">Our Mission</h2>
              {missionParagraphs.map((text, i) => (
                <p key={i} className="mission-paragraph font-satoshi text-xl md:text-2xl leading-relaxed font-medium">
                  {text.split(' ').map((word, j) => (
                    <span key={`${i}-${j}`} className="highlight-word inline-block mr-1.5 text-white/30">
                      {word}
                    </span>
                  ))}
                </p>
              ))}
            </div>
          </div>

          {/* Right Column - Cards (5) */}
          <div className="hidden md:flex flex-col gap-8 relative h-max" ref={rightColRef}>
            {STORIES.slice(5, 10).map((story, i) => (
              <Card key={i} story={story} />
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
