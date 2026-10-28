import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { CanvasSequencePlayer } from './modules/canvas-player.js';
import { initCartUI } from './modules/cart-store.js';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

document.addEventListener('DOMContentLoaded', () => {
  // Initialize E-commerce Cart & Checkout UI
  initCartUI();

  // ── Preloader / Buffer Bar Tracking ──
  const bufferBar = document.getElementById('buffer-bar');
  let totalFramesTarget = 274 + 194;
  let totalFramesLoaded = 0;

  function updateBufferProgress(loadedDelta = 1) {
    totalFramesLoaded += loadedDelta;
    const progress = Math.min((totalFramesLoaded / totalFramesTarget) * 100, 100);
    if (bufferBar) {
      bufferBar.style.width = `${progress}%`;
      if (progress >= 100) {
        setTimeout(() => {
          bufferBar.style.opacity = '0';
        }, 500);
      }
    }
  }

  // ── Hero Entrance Animation ──
  const heroTl = gsap.timeline({ delay: 0.2 });
  heroTl
    .to('#word-sleep', { y: 0, duration: 1.1, ease: 'power4.out' })
    .to('#word-better', { y: 0, duration: 1.1, ease: 'power4.out' }, '-=0.85')
    .to('#hero-image', { opacity: 1, scale: 1, duration: 1.2, ease: 'power2.out' }, '-=0.9')
    .to('#hero-paragraph', { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.7')
    .to('#hero-cta-btn', { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.5');

  // ── Scroll Progress Indicator ──
  gsap.to('#scroll-progress', {
    width: '100%',
    ease: 'none',
    scrollTrigger: {
      trigger: document.body,
      start: 'top top',
      end: 'max',
      scrub: 0,
      onUpdate: (self) => {
        const percentEl = document.getElementById('scroll-percent');
        if (percentEl) {
          percentEl.textContent = `${Math.round(self.progress * 100)}%`;
        }
      }
    }
  });

  // ── Toggle Side Shop Button ──
  ScrollTrigger.create({
    trigger: '.text-reveal',
    start: 'top 50%',
    onEnter: () => {
      const btn = document.querySelector('.side-shop-btn');
      if (btn) btn.classList.add('is-visible');
    },
    onLeaveBack: () => {
      const btn = document.querySelector('.side-shop-btn');
      if (btn) btn.classList.remove('is-visible');
    }
  });

  // ══════════════════════════════════════════════════════════════
  //  SECTION 2: TEXT REVEAL & PORTAL CANVAS
  // ══════════════════════════════════════════════════════════════
  const revealEl = document.getElementById('reveal-text');
  if (revealEl) {
    const originalText = revealEl.textContent;
    const words = originalText.split(' ');
    const highlightWords = ['humidity,', 'calm,', 'aromatherapy', 'breathe', 'sleep'];

    revealEl.innerHTML = words.map(word => {
      const isHighlight = highlightWords.some(h => word.toLowerCase().includes(h));
      return `<span class="reveal-word${isHighlight ? ' highlight' : ''}">${word}</span>`;
    }).join(' ');
  }

  // Moon fade-in
  gsap.to('.text-reveal__moon', {
    opacity: 1,
    duration: 0.6,
    scrollTrigger: {
      trigger: '.text-reveal',
      start: 'top 60%',
      end: 'top 20%',
      scrub: true
    }
  });

  // Portal Canvas Sequencer
  const waterCanvas = document.getElementById('water-canvas');
  const waterPlayer = new CanvasSequencePlayer({
    canvas: waterCanvas,
    frameCount: 274,
    frameUrlBuilder: (index) => `/sleepy/video_emerges/${(index + 7).toString().padStart(4, '0')}.webp`,
    fit: 'cover',
    autoResize: true,
    onProgress: () => updateBufferProgress(1)
  });

  const waterFrames = { frame: 0 };
  const allRevealWords = document.querySelectorAll('.reveal-word');

  const revealTl = gsap.timeline({
    scrollTrigger: {
      trigger: '.text-reveal',
      start: 'top top',
      end: () => `+=${window.innerHeight * 6}`,
      pin: true,
      scrub: 0.5,
      anticipatePin: 1,
      pinSpacing: true
    }
  });

  // Reveal words one by one
  allRevealWords.forEach((word, i) => {
    revealTl.to(word, {
      opacity: 1,
      duration: 1,
      ease: 'none'
    }, i * 0.6);
  });

  revealTl.to({}, { duration: 1 }, '+=0.8');

  // Portal expands & inverse vignette
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const diagonal = Math.sqrt(vw * vw + vh * vh) * 1.15;

  revealTl
    .to('.text-reveal__content', {
      opacity: 0,
      scale: 0.95,
      duration: 1.2,
      ease: 'power2.in'
    })
    .to('.text-reveal__moon', {
      opacity: 0,
      duration: 0.6,
      ease: 'power2.in'
    }, '<')
    .to('.text-reveal__line', {
      opacity: 0,
      duration: 0.4
    }, '<')
    .to('#reveal-portal', {
      backgroundColor: '#ffffff',
      duration: 1,
      ease: 'power2.inOut'
    }, '-=0.6')
    .to('#water-canvas', {
      opacity: 1,
      duration: 1,
      ease: 'power2.inOut'
    }, '<');

  const expandLabel = 'expand';
  revealTl.addLabel(expandLabel);

  revealTl.to('#reveal-portal', {
    width: diagonal,
    height: diagonal,
    borderRadius: 0,
    duration: 4,
    ease: 'power2.inOut'
  }, expandLabel);

  revealTl.to(waterFrames, {
    frame: 273,
    snap: 'frame',
    ease: 'none',
    duration: 4,
    onUpdate: () => waterPlayer.render(waterFrames.frame)
  }, expandLabel);

  // ══════════════════════════════════════════════════════════════
  //  SECTION 3: ROTATION SHOWCASE
  // ══════════════════════════════════════════════════════════════
  const rotCanvas = document.getElementById('rotation-canvas');
  const rotPlayer = new CanvasSequencePlayer({
    canvas: rotCanvas,
    frameCount: 194,
    frameUrlBuilder: (index) => `/sleepy/video_rotation/${(index + 1).toString().padStart(4, '0')}.webp`,
    fit: 'contain',
    baseWidth: 800,
    baseHeight: 800,
    autoResize: false,
    onProgress: () => updateBufferProgress(1)
  });

  const rotFrames = { frame: 0 };
  const rotTl = gsap.timeline({
    scrollTrigger: {
      trigger: '.rotation-showcase',
      start: 'top top',
      end: () => `+=${window.innerHeight * 5}`,
      pin: true,
      scrub: 0.8,
      anticipatePin: 1,
      pinSpacing: true
    }
  });

  // Product frames scrubbing
  rotTl.to(rotFrames, {
    frame: 193,
    snap: 'frame',
    ease: 'none',
    duration: 10,
    onUpdate: () => rotPlayer.render(rotFrames.frame)
  }, 0);

  // Phase 1: Kinetic text 1
  rotTl.to('#rot-big-text-1', {
    left: '-150vw',
    duration: 4,
    ease: 'none'
  }, 0);

  rotTl.to('.rot-phase-1', {
    opacity: 1,
    y: 0,
    duration: 0.8,
    ease: 'power2.out'
  }, 1.5);

  rotTl.to('.rot-phase-1', {
    opacity: 0,
    duration: 0.5,
    ease: 'power2.inOut'
  }, 3.5);

  // Phase 2: Expanding Black Circle
  rotTl.to('#rot-black-circle', {
    scale: 300,
    duration: 1.5,
    ease: 'power2.inOut'
  }, 4);

  // Phase 3: Kinetic text 2 (white)
  rotTl.to('#rot-big-text-2', {
    left: '-120vw',
    duration: 3,
    ease: 'none'
  }, 5);

  rotTl.to('.rot-phase-2', {
    opacity: 1,
    y: 0,
    duration: 0.8,
    ease: 'power2.out'
  }, 7.5);

  rotTl.to('.rot-phase-2', {
    opacity: 0,
    duration: 0.5,
    ease: 'power2.inOut'
  }, 9);

  rotTl.to('#rot-black-circle', {
    opacity: 0,
    duration: 1,
    ease: 'power2.inOut'
  }, 9.5);

  rotTl.to('.rot-phase-3', {
    opacity: 1,
    y: 0,
    duration: 1,
    ease: 'power2.out'
  }, 10.5);

  rotTl.to({}, { duration: 2 });

  // ══════════════════════════════════════════════════════════════
  //  SECTION 4: NATURE SHOWCASE
  // ══════════════════════════════════════════════════════════════
  const natureTl = gsap.timeline({
    scrollTrigger: {
      trigger: '.nature-showcase',
      start: 'top top',
      end: () => `+=${window.innerHeight * 3}`,
      pin: true,
      scrub: 1,
      anticipatePin: 1,
      pinSpacing: true
    }
  });

  natureTl
    .to('#nature-natural', {
      opacity: 1,
      scale: 1,
      duration: 1,
      ease: 'power2.out'
    }, 0)
    .to('.nature-showcase__plant--tl', {
      opacity: 1,
      scale: 1,
      rotation: 0,
      duration: 1.2,
      ease: 'power2.out'
    }, 0.3)
    .to('.nature-showcase__plant--br', {
      opacity: 1,
      scale: 1,
      rotation: 0,
      duration: 1.2,
      ease: 'power2.out'
    }, 0.3)
    .to('#nature-bg-text', {
      xPercent: -30,
      duration: 3,
      ease: 'none'
    }, 0);

  natureTl.to({}, { duration: 1 });

  const blinkLabel = 'blink';
  natureTl.addLabel(blinkLabel);
  natureTl.to('#science-reveal', {
    height: '100vh',
    duration: 2,
    ease: 'power2.inOut'
  }, blinkLabel);

  natureTl.to('#science-content', {
    opacity: 1,
    scale: 1,
    duration: 1.5,
    ease: 'power2.out'
  }, `${blinkLabel}+=0.5`);

  natureTl.to({}, { duration: 1.5 });

  const carouselLabel = 'carousel';
  natureTl.addLabel(carouselLabel);

  natureTl.to('#science-content', {
    yPercent: -100,
    opacity: 0,
    duration: 1.5,
    ease: 'power2.inOut'
  }, carouselLabel);

  natureTl.to('#features-text-wrap', {
    y: 0,
    opacity: 1,
    duration: 1.5,
    ease: 'power2.out'
  }, `${carouselLabel}+=0.3`);

  natureTl.to({}, { duration: 1.5 });

  // ── Smooth Scroll for Anchor Links ──
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (!targetId || targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        gsap.to(window, {
          scrollTo: target,
          duration: 1.2,
          ease: 'power3.inOut'
        });
      }
    });
  });
});
