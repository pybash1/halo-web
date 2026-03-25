import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const storiesCol1 = [
  { source: "BBC News", title: "Late Night Commute", body: "A student walking home late at night found herself followed. With no one around, she had to think fast to get to safety...", link: "#" },
  { source: "The Guardian", title: "Unsafe Streets", body: "Recent reports show a spike in anxiety among nighttime workers commuting in urban areas without adequate lighting...", link: "#" },
  { source: "Local News", title: "Campus Alert", body: "University issues warning after series of incidents near the library. Students urged to use buddy system...", link: "#" },
];

const storiesCol2 = [
  { source: "TechCrunch", title: "Safety Tech", body: "How new wearable devices are changing the landscape of personal security for vulnerable populations...", link: "#" },
  { source: "NY Times", title: "Domestic Concerns", body: "Advocates call for better discrete emergency tools for those in unsafe domestic situations who cannot make a call...", link: "#" },
  { source: "NPR", title: "Community Watch", body: "Neighborhood groups are adopting new digital tools to keep their streets safer after dark...", link: "#" },
];

const StoryCard = ({ story }: { story: any }) => (
  <div className="w-[200px] md:w-[240px] lg:w-[260px] xl:w-[300px] flex-shrink-0 rounded-3xl bg-[#2b6496]/40 backdrop-blur-md border border-white/10 p-6 flex flex-col gap-4 text-white shadow-2xl mb-6 mx-auto relative overflow-hidden pointer-events-auto">
    {/* Dot pattern background */}
    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '8px 8px' }}></div>
    
    <div className="relative z-10 flex flex-col h-full gap-4">
      <h3 className="font-serif text-2xl font-bold tracking-wide">{story.source}</h3>
      <div className="border-t border-dotted border-white/20 w-full" />
      <h4 className="font-satoshi font-bold text-xl leading-tight">{story.title}</h4>
      <p className="font-satoshi text-base text-gray-200 leading-relaxed line-clamp-4">{story.body}</p>
      <div className="border-t border-dotted border-white/20 w-full mt-auto pt-4" />
      <a href={story.link} className="font-satoshi text-sm font-medium hover:text-white/70 transition-colors inline-flex items-center gap-1">
        Read full story ↗
      </a>
    </div>
  </div>
);

export default function MissionStories() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);
  const rightColRef = useRef<HTMLDivElement>(null);

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
              scrub: 1, // Smooth scrub
              invalidateOnRefresh: true,
            }
          });

          // Parallax background columns
          // We set duration to 1.5 to exactly match the text highlight timeline (duration 1 + stagger 0.5)
          // This ensures the parallax continues smoothly for the entire time the section is in view
          // The cards should start high (negative Y) and move down (positive Y)
          if (leftColRef.current) {
            tl.fromTo(leftColRef.current, 
              { y: '-50vh' }, 
              { y: '30vh', ease: 'none', duration: 1.5 }, 
              0
            );
          }
          if (rightColRef.current) {
            tl.fromTo(rightColRef.current, 
              { y: '-50vh' }, 
              { y: '30vh', ease: 'none', duration: 1.5 }, 
              0
            );
          }

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
      
      {/* Background Scrolling Columns */}
      <div 
        className="absolute inset-0 flex justify-between items-center w-full px-2 md:px-4 lg:px-8 pointer-events-none opacity-20 md:opacity-40 lg:opacity-100 z-0"
        style={{
          maskImage: 'linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)'
        }}
      >
        {/* Left Column (scrolls up) */}
        <div ref={leftColRef} className="hidden sm:flex flex-col relative gap-6 flex-shrink-0">
          {[...storiesCol1, ...storiesCol1, ...storiesCol1].map((story, i) => (
            <StoryCard key={`l-${i}`} story={story} />
          ))}
        </div>

        {/* Right Column (scrolls down) */}
        <div ref={rightColRef} className="hidden sm:flex flex-col relative gap-6 flex-shrink-0">
          {[...storiesCol2, ...storiesCol2, ...storiesCol2].map((story, i) => (
            <StoryCard key={`r-${i}`} story={story} />
          ))}
        </div>
      </div>

      <div className="mx-auto px-4 w-full flex items-center justify-center relative z-20 
        max-w-[95%] 
        md:max-w-xl 
        lg:max-w-[calc(100vw-620px)] 
        xl:max-w-[calc(100vw-760px)] 
        2xl:max-w-[900px]
      ">
        {/* Center Column - Mission Text */}
        <div className="flex flex-col justify-center items-center relative p-2 sm:p-6" ref={textRef}>
          <div className="space-y-6 md:space-y-8 text-center">
            <h2 className="text-4xl md:text-5xl xl:text-6xl font-serif text-white mb-6 md:mb-12">Our Mission</h2>
            {missionParagraphs.map((text, i) => (
              <p key={i} className="mission-paragraph font-satoshi text-xl md:text-2xl xl:text-3xl leading-relaxed font-medium">
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