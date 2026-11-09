# Platform-native motion, no animation library

Motion uses only the View Transitions API (React `<ViewTransition>` and `document.startViewTransition`), CSS transitions and keyframes, and small scripts of our own (IntersectionObserver, pointer position). Motion, GSAP, Lenis and Three.js were prototyped as the "Expressive" and "Cinematic" levels and rejected in favour of the "Crafted" level. Browsers without View Transitions swap pages instantly, and `prefers-reduced-motion` is handled by hand: everything becomes a plain cross-fade.
