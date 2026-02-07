console.log('Script loaded successfully');

// ==========================================
// THEME TOGGLE
// ==========================================

const themeToggle = document.querySelector('.theme-toggle');
const html = document.documentElement;

// Check for saved theme preference or default to 'light'
let currentTheme = 'light';
try {
  currentTheme = localStorage.getItem('theme') || 'light';
} catch (e) {
  console.warn('LocalStorage access denied');
}
html.setAttribute('data-theme', currentTheme);

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    html.setAttribute('data-theme', newTheme);
    try { localStorage.setItem('theme', newTheme); } catch (e) {}
    
    // Add a small animation effect
    themeToggle.style.transform = 'rotate(360deg)';
    setTimeout(() => {
      themeToggle.style.transform = '';
    }, 300);
  });
}

// ==========================================
// SMOOTH SCROLLING
// ==========================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    
    if (target) {
      const navHeight = document.querySelector('.nav').offsetHeight;
      const targetPosition = target.offsetTop - navHeight;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  });
});

// ==========================================
// NAVBAR SCROLL EFFECT
// ==========================================

const nav = document.querySelector('.nav');
let lastScroll = 0;

window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;
  
  // Add shadow on scroll
  if (nav) {
    if (currentScroll > 100) {
      nav.style.boxShadow = 'var(--shadow-md)';
    } else {
      nav.style.boxShadow = 'none';
    }
  }
  
  lastScroll = currentScroll;
});

// ==========================================
// INTERSECTION OBSERVER FOR ANIMATIONS
// ==========================================

const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Observe elements that should animate on scroll
const animateOnScroll = document.querySelectorAll(
  '.project-card, .expertise-item, .contact-item, .about-card'
);

animateOnScroll.forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
  observer.observe(el);
});

// ==========================================
// FORM HANDLING
// ==========================================

const contactForm = document.getElementById('contactForm');

if (contactForm) {
contactForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const submitBtn = contactForm.querySelector('button[type="submit"]');
  const originalText = submitBtn.innerHTML;
  
  // Show loading state
  submitBtn.innerHTML = '<span>Sending...</span>';
  submitBtn.disabled = true;
  submitBtn.style.opacity = '0.7';
  
  // Get form data
  const formData = {
    name: document.getElementById('name').value,
    email: document.getElementById('email').value,
    message: document.getElementById('message').value
  };
  
  try {
    // ⚠️ IMPORTANT: Replace the URL below with your actual Formspree Endpoint
    const response = await fetch("https://formspree.io/forms", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(formData)
    });

    if (response.ok) {
      // Success state
      submitBtn.innerHTML = '<span>Message Sent! ✓</span>';
      submitBtn.style.background = '#10b981';
      contactForm.reset();
      showNotification('Thank you! Your message has been sent successfully.', 'success');
    } else {
      throw new Error('Network response was not ok');
    }
  } catch (error) {
    console.error('Error:', error);
    showNotification('Oops! Something went wrong. Please try again.', 'error');
    submitBtn.innerHTML = '<span>Error</span>';
    submitBtn.style.background = '#ef4444';
  }

  // Reset button after 3 seconds
  setTimeout(() => {
    submitBtn.innerHTML = originalText;
    submitBtn.disabled = false;
    submitBtn.style.opacity = '1';
    submitBtn.style.background = '';
  }, 3000);
});
}

// ==========================================
// NOTIFICATION SYSTEM
// ==========================================

function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
    <div class="notification-content">
      <span>${message}</span>
      <button class="notification-close">&times;</button>
    </div>
  `;
  
  // Add styles dynamically
  const style = document.createElement('style');
  style.textContent = `
    .notification {
      position: fixed;
      top: 100px;
      right: 2rem;
      background: var(--bg-secondary);
      border: 1px solid var(--border-color);
      border-radius: 12px;
      padding: 1rem 1.5rem;
      box-shadow: var(--shadow-xl);
      z-index: 10000;
      animation: slideInRight 0.3s ease-out;
      max-width: 400px;
    }
    
    .notification-success {
      border-left: 4px solid #10b981;
    }
    
    .notification-error {
      border-left: 4px solid #ef4444;
    }
    
    .notification-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
    }
    
    .notification-close {
      background: none;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
      color: var(--text-secondary);
      padding: 0;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: color var(--transition-fast);
    }
    
    .notification-close:hover {
      color: var(--text-primary);
    }
    
    @keyframes slideInRight {
      from {
        transform: translateX(400px);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    
    @keyframes slideOutRight {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(400px);
        opacity: 0;
      }
    }
  `;
  
  if (!document.querySelector('style[data-notification-styles]')) {
    style.setAttribute('data-notification-styles', '');
    document.head.appendChild(style);
  }
  
  document.body.appendChild(notification);
  
  // Close button functionality
  const closeBtn = notification.querySelector('.notification-close');
  closeBtn.addEventListener('click', () => {
    notification.style.animation = 'slideOutRight 0.3s ease-out';
    setTimeout(() => notification.remove(), 300);
  });
  
  // Auto remove after 5 seconds
  setTimeout(() => {
    if (notification.parentElement) {
      notification.style.animation = 'slideOutRight 0.3s ease-out';
      setTimeout(() => notification.remove(), 300);
    }
  }, 5000);
}

// ==========================================
// CURSOR EFFECT (OPTIONAL - PREMIUM TOUCH)
// ==========================================

const cursor = document.createElement('div');
cursor.className = 'custom-cursor';
const cursorFollower = document.createElement('div');
cursorFollower.className = 'cursor-follower';

// Add cursor styles
const cursorStyle = document.createElement('style');
cursorStyle.textContent = `
  .custom-cursor,
  .cursor-follower {
    position: fixed;
    border-radius: 50%;
    pointer-events: none;
    z-index: 9999;
    transition: transform 0.15s ease-out;
  }
  
  .custom-cursor {
    width: 8px;
    height: 8px;
    background: var(--accent-primary);
    transform: translate(-50%, -50%);
  }
  
  .cursor-follower {
    width: 40px;
    height: 40px;
    border: 2px solid var(--accent-primary);
    transform: translate(-50%, -50%);
    transition: transform 0.3s ease-out, opacity 0.3s ease-out;
    opacity: 0.5;
  }
  
  .cursor-hover .cursor-follower {
    transform: translate(-50%, -50%) scale(1.5);
    opacity: 0.3;
  }
  
  @media (max-width: 1024px) {
    .custom-cursor,
    .cursor-follower {
      display: none;
    }
  }
`;

document.head.appendChild(cursorStyle);
document.body.appendChild(cursor);
document.body.appendChild(cursorFollower);

let mouseX = 0;
let mouseY = 0;
let cursorX = 0;
let cursorY = 0;
let followerX = 0;
let followerY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

function animateCursor() {
  // Smooth cursor movement
  cursorX += (mouseX - cursorX) * 0.5;
  cursorY += (mouseY - cursorY) * 0.5;
  followerX += (mouseX - followerX) * 0.1;
  followerY += (mouseY - followerY) * 0.1;
  
  cursor.style.left = cursorX + 'px';
  cursor.style.top = cursorY + 'px';
  cursorFollower.style.left = followerX + 'px';
  cursorFollower.style.top = followerY + 'px';
  
  requestAnimationFrame(animateCursor);
}

animateCursor();

// Add hover effect for interactive elements
const interactiveElements = document.querySelectorAll('a, button, .project-card');
interactiveElements.forEach(el => {
  el.addEventListener('mouseenter', () => {
    document.body.classList.add('cursor-hover');
  });
  el.addEventListener('mouseleave', () => {
    document.body.classList.remove('cursor-hover');
  });
});

// ==========================================
// PARALLAX EFFECT ON HERO ORBS
// ==========================================

const orbs = document.querySelectorAll('.gradient-orb');

document.addEventListener('mousemove', (e) => {
  const mouseX = e.clientX / window.innerWidth;
  const mouseY = e.clientY / window.innerHeight;
  
  orbs.forEach((orb, index) => {
    const speed = (index + 1) * 20;
    const x = (mouseX - 0.5) * speed;
    const y = (mouseY - 0.5) * speed;
    
    orb.style.transform = `translate(${x}px, ${y}px)`;
  });
});

// ==========================================
// COUNTER ANIMATION FOR STATS
// ==========================================

function animateCounter(element, target, duration = 2000) {
  const start = 0;
  const increment = target / (duration / 16); // 60fps
  let current = start;
  
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      element.textContent = target + (element.textContent.includes('+') ? '+' : '') + (element.textContent.includes('%') ? '%' : '');
      clearInterval(timer);
    } else {
      element.textContent = Math.floor(current) + (element.textContent.includes('+') ? '+' : '') + (element.textContent.includes('%') ? '%' : '');
    }
  }, 16);
}

// Trigger counter animation when stats are visible
const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const statValue = entry.target.querySelector('.stat-value');
      const target = parseInt(statValue.textContent);
      animateCounter(statValue, target);
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat').forEach(stat => {
  statsObserver.observe(stat);
});

// ==========================================
// PROJECT CARD TILT EFFECT
// ==========================================

document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (y - centerY) / 20;
    const rotateY = (centerX - x) / 20;
    
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
  });
  
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

// ==========================================
// CONSOLE MESSAGE (EASTER EGG)
// ==========================================

console.log('%c👋 Hey there!', 'font-size: 24px; font-weight: bold; color: #0066ff;');
console.log('%cLooking at the code? I like your style!', 'font-size: 14px; color: #525252;');
console.log('%cFeel free to reach out if you want to collaborate: felyxkeem@gmail.com', 'font-size: 12px; color: #737373;');

// ==========================================
// PERFORMANCE OPTIMIZATION
// ==========================================

// Lazy load images when implemented
if ('IntersectionObserver' in window) {
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.classList.add('loaded');
          imageObserver.unobserve(img);
        }
      }
    });
  });
  
  document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
  });
}

// ==========================================
// PREVENT FLASH OF UNSTYLED CONTENT
// ==========================================

window.addEventListener('load', () => {
  document.body.classList.add('loaded');
  
  // Add loaded class for additional animations
  const loadedStyle = document.createElement('style');
  loadedStyle.textContent = `
    body {
      opacity: 1 !important;
    }
  `;
  document.head.appendChild(loadedStyle);
});

// Initial page load optimization
document.addEventListener('DOMContentLoaded', () => {
  // Preload critical fonts
  const fontPreload = document.createElement('link');
  fontPreload.rel = 'preload';
  fontPreload.as = 'font';
  fontPreload.type = 'font/woff2';
  fontPreload.crossOrigin = 'anonymous';
  
  // Add performance marks for monitoring
  if (window.performance && window.performance.mark) {
    window.performance.mark('portfolio-interactive');
  }
});

// ==========================================
// PROFILE RATING SYSTEM
// ==========================================

const stars = document.querySelectorAll('.star');
const ratingText = document.querySelector('.rating-text');
const ratingKey = 'profileRating';

// Load saved rating
let savedRating = null;
try {
  savedRating = localStorage.getItem(ratingKey);
} catch (e) {}

if (savedRating) {
  updateStars(savedRating);
  ratingText.textContent = `You rated this ${savedRating}/5`;
}

stars.forEach(star => {
  star.addEventListener('click', () => {
    const rating = star.dataset.value;
    try { localStorage.setItem(ratingKey, rating); } catch (e) {}
    updateStars(rating);
    ratingText.textContent = `You rated this ${rating}/5`;
    
    // Animation effect
    star.style.transform = 'scale(1.4)';
    setTimeout(() => star.style.transform = 'scale(1)', 200);
  });
  
  star.addEventListener('mouseenter', () => {
    const rating = star.dataset.value;
    highlightStars(rating);
  });
});

document.querySelector('.stars')?.addEventListener('mouseleave', () => {
  let saved = 0;
  try {
    saved = localStorage.getItem(ratingKey);
  } catch (e) {}
  updateStars(saved);
});

function updateStars(rating) {
  stars.forEach(star => {
    star.style.color = star.dataset.value <= rating ? '#fbbf24' : '';
  });
}

function highlightStars(rating) {
  stars.forEach(star => {
    star.style.color = star.dataset.value <= rating ? '#fbbf24' : '';
  });
}
