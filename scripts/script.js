// Main JavaScript functionality
document.addEventListener('DOMContentLoaded', function() {
  
  // Mobile Navigation Toggle
  initMobileNavigation();
  
  // Dropdown functionality
  initDropdowns();
  
  // Language switcher functionality
  initLanguageSwitcher();
  
  // Smooth scrolling for anchor links
  initSmoothScrolling();
  
  // Hero animations
  initHeroAnimations();
  
  // Close mobile menu when clicking outside
  initOutsideClickHandler();
});

// Mobile Navigation Toggle
function initMobileNavigation() {
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function() {
      navMenu.classList.toggle('active');
      
      // Update aria-expanded for accessibility
      const isExpanded = navMenu.classList.contains('active');
      navToggle.setAttribute('aria-expanded', isExpanded);
    });
    
    // Close menu when clicking on a link
    document.querySelectorAll('.nav-link:not(.dropdown-toggle)').forEach(link => {
      link.addEventListener('click', function() {
        navMenu.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }
}

// Dropdown functionality
function initDropdowns() {
  document.querySelectorAll('.dropdown').forEach(dropdown => {
    const toggle = dropdown.querySelector('.dropdown-toggle');
    const menu = dropdown.querySelector('.dropdown-menu');
    
    if (toggle && menu) {
      toggle.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Close other dropdowns
        document.querySelectorAll('.dropdown').forEach(otherDropdown => {
          if (otherDropdown !== dropdown) {
            otherDropdown.classList.remove('active');
          }
        });
        
        // Toggle current dropdown
        dropdown.classList.toggle('active');
        
        // Update aria-expanded for accessibility
        const isExpanded = dropdown.classList.contains('active');
        toggle.setAttribute('aria-expanded', isExpanded);
      });
      
      // Close dropdown when clicking on dropdown link
      dropdown.querySelectorAll('.dropdown-link').forEach(link => {
        link.addEventListener('click', function() {
          dropdown.classList.remove('active');
          toggle.setAttribute('aria-expanded', 'false');
          
          // Also close mobile menu if open
          const navMenu = document.querySelector('.nav-menu');
          const navToggle = document.querySelector('.nav-toggle');
          if (navMenu && navToggle) {
            navMenu.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
          }
        });
      });
    }
  });
}

// Language switcher functionality
function initLanguageSwitcher() {
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const selectedLang = this.dataset.lang;
      
      if (window.languageManager) {
        window.languageManager.setLanguage(selectedLang);
      }
      
      // Add visual feedback
      this.style.transform = 'scale(0.95)';
      setTimeout(() => {
        this.style.transform = 'scale(1)';
      }, 100);
    });
  });
}

// Smooth scrolling for anchor links
function initSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

// Hero animations
function initHeroAnimations() {
  const heroContent = document.querySelector('.hero-content');
  const buttons = document.querySelectorAll('.btn');
  
  if (heroContent) {
    // Add intersection observer for hero content
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.animationPlayState = 'running';
        }
      });
    });
    
    observer.observe(heroContent);
  }
  
  // Add hover effects to buttons
  buttons.forEach(btn => {
    btn.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-2px) scale(1.02)';
    });
    
    btn.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0) scale(1)';
    });
    
    // Add click effect
    btn.addEventListener('mousedown', function() {
      this.style.transform = 'translateY(0) scale(0.98)';
    });
    
    btn.addEventListener('mouseup', function() {
      this.style.transform = 'translateY(-2px) scale(1.02)';
    });
  });
}

// Close mobile menu and dropdowns when clicking outside
function initOutsideClickHandler() {
  document.addEventListener('click', function(e) {
    // Close dropdowns when clicking outside
    if (!e.target.closest('.dropdown')) {
      document.querySelectorAll('.dropdown').forEach(dropdown => {
        dropdown.classList.remove('active');
        const toggle = dropdown.querySelector('.dropdown-toggle');
        if (toggle) {
          toggle.setAttribute('aria-expanded', 'false');
        }
      });
    }
    
    // Close mobile menu when clicking outside
    if (!e.target.closest('.nav-container') && !e.target.closest('.nav-toggle')) {
      const navMenu = document.querySelector('.nav-menu');
      const navToggle = document.querySelector('.nav-toggle');
      if (navMenu && navToggle) {
        navMenu.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    }
  });
}

// Utility function to add loading states
function addLoadingState(element, text = 'Loading...') {
  const originalText = element.textContent;
  element.textContent = text;
  element.disabled = true;
  
  return function removeLoadingState() {
    element.textContent = originalText;
    element.disabled = false;
  };
}

// Utility function for debouncing
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Add keyboard navigation support
document.addEventListener('keydown', function(e) {
  // ESC key closes dropdowns and mobile menu
  if (e.key === 'Escape') {
    // Close dropdowns
    document.querySelectorAll('.dropdown').forEach(dropdown => {
      dropdown.classList.remove('active');
      const toggle = dropdown.querySelector('.dropdown-toggle');
      if (toggle) {
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
    
    // Close mobile menu
    const navMenu = document.querySelector('.nav-menu');
    const navToggle = document.querySelector('.nav-toggle');
    if (navMenu && navToggle) {
      navMenu.classList.remove('active');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  }
});

// Add scroll effects
window.addEventListener('scroll', debounce(function() {
  const scrolled = window.pageYOffset;
  const nav = document.querySelector('.main-nav');
  
  if (nav) {
    if (scrolled > 50) {
      nav.style.background = 'linear-gradient(135deg, rgba(0,0,0,0.95) 0%, rgba(10,10,10,0.95) 25%, rgba(0,17,51,0.95) 50%, rgba(0,8,20,0.95) 75%, rgba(0,0,0,0.95) 100%)';
      nav.style.backdropFilter = 'blur(10px)';
    } else {
      nav.style.background = 'linear-gradient(135deg, #000000 0%, #0a0a0a 25%, #001133 50%, #000814 75%, #000000 100%)';
      nav.style.backdropFilter = 'none';
    }
  }
}, 10));

// Performance optimization: Preload critical resources
function preloadCriticalResources() {
  const criticalImages = [
    'images/logo_raetselraum.png',
    'images/logo_htltraun.png',
    'images/logo_schnitzel.png',
    'images/logo_realsim.png'
  ];
  
  criticalImages.forEach(src => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    document.head.appendChild(link);
  });
}

// Initialize preloading
preloadCriticalResources();