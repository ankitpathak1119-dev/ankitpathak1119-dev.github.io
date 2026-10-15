/**
 * Ankit Pathak - Cyber Security Portfolio
 * Clean, minimal, corporate-grade client script.
 */

// DOM Elements
const body = document.body;
const themeToggle = document.getElementById('theme-toggle');
const navToggle = document.getElementById('nav-toggle');
const siteNav = document.getElementById('site-nav');
const backToTop = document.getElementById('back-to-top');
const contactForm = document.getElementById('contact-form');
const formSuccess = document.getElementById('form-success');
const toastNotice = document.getElementById('toast-notice');
const toastMessage = document.getElementById('toast-message');

// Theme Management
const savedTheme = localStorage.getItem('ankit-theme');
if (savedTheme === 'light') {
  body.classList.add('light');
  if (themeToggle) themeToggle.textContent = '☼';
} else {
  if (themeToggle) themeToggle.textContent = '◐';
}

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const isLight = body.classList.toggle('light');
    localStorage.setItem('ankit-theme', isLight ? 'light' : 'dark');
    themeToggle.textContent = isLight ? '☼' : '◐';
  });
}

// Mobile Navigation Toggle
if (navToggle && siteNav) {
  navToggle.addEventListener('click', () => {
    const isOpen = siteNav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  // Close nav when clicking a link
  siteNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      siteNav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  // Close nav on click outside
  document.addEventListener('click', (e) => {
    if (!siteNav.contains(e.target) && !navToggle.contains(e.target) && siteNav.classList.contains('open')) {
      siteNav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });
}

// Active Nav Link Spy on Scroll
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.site-nav a');

window.addEventListener('scroll', () => {
  let currentId = '';
  const scrollPos = window.scrollY + 120;

  sections.forEach((section) => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    if (scrollPos >= top && scrollPos < top + height) {
      currentId = section.getAttribute('id');
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${currentId}`) {
      link.classList.add('active');
    }
  });
}, { passive: true });

// Scroll Reveal Animation
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

// Back to Top Button
if (backToTop) {
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// Year auto-update
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Toast Notification Helper
let toastTimer = null;
function showToast(message) {
  if (!toastNotice || !toastMessage) return;
  toastMessage.textContent = message;
  toastNotice.classList.add('show');
  
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toastNotice.classList.remove('show');
  }, 2600);
}

// Robust Dual-Fallback Copy Helper (Works across all browsers & contexts)
async function copyToClipboard(text) {
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (_) {}
  }
  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';
    textArea.style.top = '0';
    textArea.setAttribute('readonly', '');
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const success = document.execCommand('copy');
    document.body.removeChild(textArea);
    return success;
  } catch (_) {
    return false;
  }
}

// Copy to Clipboard Triggers
const copyEmailBtn = document.getElementById('copy-email-btn');
if (copyEmailBtn) {
  copyEmailBtn.addEventListener('click', async () => {
    const emailEl = document.querySelector('[data-email]');
    const email = emailEl ? emailEl.textContent.trim() : 'ankitpathak.1119@gmail.com';
    const success = await copyToClipboard(email);
    showToast(success ? '✓ Email copied to clipboard' : 'ankitpathak.1119@gmail.com');
  });
}

const copyPhoneBtn = document.getElementById('copy-phone-btn');
if (copyPhoneBtn) {
  copyPhoneBtn.addEventListener('click', async () => {
    const phone = '+91 62670 04473';
    const success = await copyToClipboard(phone);
    showToast(success ? '✓ Phone number copied to clipboard' : '+91 62670 04473');
  });
}

// Dynamic Role Typewriter Loop in Hero
const roles = [
  "Cyber Security Analyst",
  "VAPT Specialist",
  "SOC Operations & Threat Intel",
  "Digital Forensics Investigator"
];
let roleIdx = 0;
let charIdx = 0;
let isDeletingRole = false;
const roleElement = document.getElementById('role-text');

function cycleRoles() {
  if (!roleElement) return;
  const currentRole = roles[roleIdx];

  if (isDeletingRole) {
    charIdx--;
    roleElement.textContent = currentRole.substring(0, charIdx);
  } else {
    charIdx++;
    roleElement.textContent = currentRole.substring(0, charIdx);
  }

  let typingDelay = isDeletingRole ? 35 : 75;

  if (!isDeletingRole && charIdx === currentRole.length) {
    typingDelay = 2200; // Pause when word complete
    isDeletingRole = true;
  } else if (isDeletingRole && charIdx === 0) {
    isDeletingRole = false;
    roleIdx = (roleIdx + 1) % roles.length;
    typingDelay = 400; // Brief pause before typing next
  }

  setTimeout(cycleRoles, typingDelay);
}
// Start typing loop after DOM is ready
setTimeout(cycleRoles, 600);

// Contact Form Handling (Direct Delivery to ankitpathak.1119@gmail.com)
if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalBtnHtml = submitBtn ? submitBtn.innerHTML : '';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span>Sending message...</span>';
    }

    const data = new FormData(contactForm);
    const senderName = data.get('name') || '';
    const senderEmail = data.get('email') || '';
    const subject = data.get('subject') || 'Cyber Security Opportunity';
    const message = data.get('message') || '';

    try {
      const res = await fetch('https://formsubmit.co/ajax/ankitpathak.1119@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: senderName,
          email: senderEmail,
          _subject: `[Portfolio] ${subject}`,
          message: message
        })
      });

      if (res.ok) {
        if (formSuccess) {
          formSuccess.hidden = false;
          formSuccess.innerHTML = '<span>✓</span><span>Thank you! Your message has been sent successfully.</span>';
          setTimeout(() => { formSuccess.hidden = true; }, 5000);
        }
        contactForm.reset();
        showToast('✓ Message sent successfully');
      } else {
        throw new Error('API submission failed');
      }
    } catch (_) {
      // Graceful fallback to mail client
      const encSub = encodeURIComponent(`[Portfolio] ${subject}`);
      const encBody = encodeURIComponent(`Hi Ankit,\n\nName: ${senderName}\nEmail: ${senderEmail}\n\nMessage:\n${message}`);
      window.location.href = `mailto:ankitpathak.1119@gmail.com?subject=${encSub}&body=${encBody}`;
      if (formSuccess) {
        formSuccess.hidden = false;
        formSuccess.innerHTML = '<span>✓</span><span>Opening your email client...</span>';
      }
      showToast('Opening default mail client...');
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHtml;
      }
    }
  });
}

