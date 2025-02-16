// animations.js
document.addEventListener('DOMContentLoaded', () => {
  // Reveal animations on scroll
  const reveals = document.querySelectorAll('.reveal');

  const revealOnScroll = () => {
    reveals.forEach(element => {
      const elementTop = element.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;

      if (elementTop < windowHeight - 100) {
        element.classList.add('active');
      }
    });
  };

  window.addEventListener('scroll', revealOnScroll);

  // Parallax effect
  const parallaxElements = document.querySelectorAll('.parallax');

  const handleParallax = () => {
    parallaxElements.forEach(element => {
      const speed = element.dataset.speed || 0.5;
      const offset = window.pageYOffset * speed;
      element.style.setProperty('--parallax-offset', `${offset}px`);
    });
  };

  window.addEventListener('scroll', handleParallax);

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      target.scrollIntoView({ behavior: 'smooth' });
    });
  });
});

// Loader animation
window.addEventListener('load', () => {
  const loader = document.querySelector('.loader');
  loader.style.opacity = '0';
  setTimeout(() => loader.style.display = 'none', 500);
});