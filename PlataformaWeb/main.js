// Funcionalidades principales de MentorIA
(function() {
  'use strict';

  // FAQ Accordion
  function setupFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
      const question = item.querySelector('.faq-question');
      
      if (question) {
        question.addEventListener('click', () => {
          const isActive = item.classList.contains('active');
          
          // Cerrar todas las demás
          faqItems.forEach(otherItem => {
            if (otherItem !== item) {
              otherItem.classList.remove('active');
            }
          });
          
          // Toggle la actual
          if (isActive) {
            item.classList.remove('active');
          } else {
            item.classList.add('active');
          }
        });
      }
    });
  }

  // Smooth Scroll para enlaces internos
  function setupSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
      link.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        
        if (href === '#' || !href) return;
        
        const target = document.querySelector(href);
        
        if (target) {
          e.preventDefault();
          
          const offsetTop = target.offsetTop - 80; // 80px para el navbar fijo
          
          window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  // Animación de estadísticas al scroll
  function setupCounterAnimation() {
    const stats = document.querySelectorAll('.stat-number');
    let animated = false;
    
    function animateCounters() {
      if (animated) return;
      
      stats.forEach(stat => {
        const target = stat.textContent.replace(/[^0-9]/g, '');
        const suffix = stat.textContent.replace(/[0-9]/g, '');
        
        if (!target) return;
        
        let count = 0;
        const increment = Math.ceil(parseInt(target) / 50);
        
        const updateCount = () => {
          count += increment;
          
          if (count > parseInt(target)) {
            count = parseInt(target);
            stat.textContent = count + suffix;
          } else {
            stat.textContent = count + suffix;
            requestAnimationFrame(updateCount);
          }
        };
        
        updateCount();
      });
      
      animated = true;
    }
    
    // Observar cuando el hero entra en viewport
    const hero = document.querySelector('.hero');
    
    if (hero && 'IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            animateCounters();
          }
        });
      }, { threshold: 0.5 });
      
      observer.observe(hero);
    }
  }

  // Navbar transparente al inicio, sólido al hacer scroll
  function setupNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    
    if (!navbar) return;
    
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });
  }

  // Highlight active section en navbar
  function setupActiveSection() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
    
    if (!sections.length || !navLinks.length) return;
    
    window.addEventListener('scroll', () => {
      let current = '';
      
      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (window.pageYOffset >= sectionTop - 100) {
          current = section.getAttribute('id');
        }
      });
      
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
          link.classList.add('active');
        }
      });
    });
  }

  // Inicializar todo cuando el DOM esté listo
  function init() {
    setupFAQ();
    setupSmoothScroll();
    setupCounterAnimation();
    setupNavbarScroll();
    setupActiveSection();
  }

  // Ejecutar cuando el DOM esté listo
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
