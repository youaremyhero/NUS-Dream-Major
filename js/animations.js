/* =====================================================
   animations.js — GSAP-powered progressive enhancement
   ===================================================== */

(() => {
  const state = {
    triggers: [],
    reduceMotionQuery: null,
    waitingForGsap: false
  };

  function markReducedMotion() {
    document.body.classList.add('ndm-motion-reduced');
    document.body.classList.remove('ndm-motion-ready');
    teardownAnimations();
  }

  function teardownAnimations() {
    if (!state.triggers.length) return;
    state.triggers.forEach(trigger => {
      if (trigger && typeof trigger.kill === 'function') {
        trigger.kill();
      }
    });
    state.triggers = [];
    if (window.ScrollTrigger && typeof window.ScrollTrigger.refresh === 'function') {
      window.ScrollTrigger.refresh();
    }
  }

  function initAnimations() {
    if (!(window.gsap && window.ScrollTrigger)) {
      return false;
    }

    const { gsap, ScrollTrigger } = window;

    try {
      gsap.registerPlugin(ScrollTrigger);
    } catch (err) {
      console.warn('[ndm] Unable to register ScrollTrigger plugin.', err);
      return false;
    }

    teardownAnimations();

    const sectionTargets = gsap.utils.toArray('.ndm [data-ndm-animate]');
    sectionTargets.forEach((target, index) => {
      const tween = gsap.fromTo(
        target,
        { autoAlpha: 0, y: 48 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.72,
          ease: 'power2.out',
          overwrite: 'auto',
          scrollTrigger: {
            id: `ndm-section-${index}`,
            trigger: target,
            start: 'top 80%',
            end: 'bottom 40%',
            toggleActions: 'play none none reverse'
          }
        }
      );

      if (tween?.scrollTrigger) {
        state.triggers.push(tween.scrollTrigger);
      }
    });

    const cardTargets = gsap.utils.toArray(
      '.ndm .landing-card, .ndm .landing-programme-card, .ndm .landing-quiz-card'
    );
    cardTargets.forEach((card, index) => {
      const tween = gsap.from(card, {
        autoAlpha: 0,
        y: 24,
        duration: 0.6,
        ease: 'power2.out',
        overwrite: 'auto',
        scrollTrigger: {
          id: `ndm-card-${index}`,
          trigger: card,
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        }
      });

      if (tween?.scrollTrigger) {
        state.triggers.push(tween.scrollTrigger);
      }
    });

    if (typeof ScrollTrigger.refresh === 'function') {
      ScrollTrigger.refresh();
    }

    document.body.classList.add('ndm-motion-ready');
    document.body.classList.remove('ndm-motion-reduced');
    return true;
  }

  function bootstrapAnimations() {
    if (state.reduceMotionQuery?.matches) {
      markReducedMotion();
      return;
    }

    const initialised = initAnimations();
    if (!initialised) {
      if (!state.waitingForGsap) {
        state.waitingForGsap = true;
        window.addEventListener(
          'load',
          () => {
            initAnimations();
          },
          { once: true }
        );
      }
      return;
    }

    window.setTimeout(() => {
      if (!state.reduceMotionQuery?.matches) {
        initAnimations();
      }
    }, 400);
  }

  function handleReducedMotionChange(event) {
    if (event.matches) {
      markReducedMotion();
    } else {
      bootstrapAnimations();
    }
  }

  function onReady() {
    if (typeof window.matchMedia === 'function') {
      try {
        state.reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      } catch (err) {
        console.warn('[ndm] Unable to evaluate prefers-reduced-motion.', err);
      }
    }

    if (state.reduceMotionQuery) {
      if (typeof state.reduceMotionQuery.addEventListener === 'function') {
        state.reduceMotionQuery.addEventListener('change', handleReducedMotionChange);
      } else if (typeof state.reduceMotionQuery.addListener === 'function') {
        state.reduceMotionQuery.addListener(handleReducedMotionChange);
      }
    }

    bootstrapAnimations();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', onReady, { once: true });
  } else {
    onReady();
  }
})();
