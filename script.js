/**
 * Mohammed Mahbub Alam — Portfolio Script
 * Pure vanilla JS — no frameworks, no dependencies
 */

// ================================================================
// 1. THEME TOGGLE (with localStorage persistence)
// ================================================================
const html         = document.documentElement;
const themeToggle  = document.getElementById('theme-toggle');
const themeIcon    = document.getElementById('theme-icon');

function setTheme(theme) {
    html.setAttribute('data-theme', theme);
    localStorage.setItem('portfolio-theme', theme);
    themeIcon.className = theme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
}

// Initialize theme from localStorage or system preference
(function initTheme() {
    const saved = localStorage.getItem('portfolio-theme');
    if (saved) {
        setTheme(saved);
    } else {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setTheme(prefersDark ? 'dark' : 'light');
    }
})();

themeToggle.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    setTheme(current === 'dark' ? 'light' : 'dark');
});

// ================================================================
// 2. MOBILE DRAWER
// ================================================================
const hamburger     = document.getElementById('hamburger');
const mobileDrawer  = document.getElementById('mobile-drawer');
const drawerOverlay = document.getElementById('drawer-overlay');

function openDrawer() {
    mobileDrawer.classList.add('open');
    mobileDrawer.setAttribute('aria-hidden', 'false');
    drawerOverlay.classList.add('visible');
    hamburger.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
}

function closeDrawer() {
    mobileDrawer.classList.remove('open');
    mobileDrawer.setAttribute('aria-hidden', 'true');
    drawerOverlay.classList.remove('visible');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
}

hamburger.addEventListener('click', () => {
    mobileDrawer.classList.contains('open') ? closeDrawer() : openDrawer();
});

drawerOverlay.addEventListener('click', closeDrawer);

// Close drawer on link click (mobile nav)
document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', closeDrawer);
});

// Close on Escape key
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeDrawer();
});

// ================================================================
// 3. STICKY HEADER + SCROLL PROGRESS BAR
// ================================================================
const header        = document.getElementById('header');
const scrollProgress = document.getElementById('scroll-progress');

function handleScroll() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;

    // Header shadow on scroll
    if (scrollTop > 80) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }

    // Scroll progress bar
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    scrollProgress.style.width = progress + '%';

    // Back to top button
    const backToTop = document.getElementById('back-to-top');
    if (scrollTop > 400) {
        backToTop.classList.add('visible');
    } else {
        backToTop.classList.remove('visible');
    }

    // Active nav link highlighting
    updateActiveNav(scrollTop);
}

// Throttled scroll listener
let scrollRAF;
window.addEventListener('scroll', () => {
    if (!scrollRAF) {
        scrollRAF = requestAnimationFrame(() => {
            handleScroll();
            scrollRAF = null;
        });
    }
}, { passive: true });

// ================================================================
// 4. ACTIVE NAV LINK ON SCROLL
// ================================================================
function updateActiveNav(scrollTop) {
    const sections = document.querySelectorAll('section[id]');
    let current = '';

    sections.forEach(section => {
        if (scrollTop >= section.offsetTop - 120) {
            current = section.getAttribute('id');
        }
    });

    document.querySelectorAll('.nav-link, .mobile-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
            link.classList.add('active');
        }
    });
}

// ================================================================
// 5. SMOOTH SCROLL FOR ANCHOR LINKS
// ================================================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const target = this.getAttribute('href');
        if (target === '#') return;
        const el = document.querySelector(target);
        if (!el) return;
        e.preventDefault();
        const offset = el.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top: offset, behavior: 'smooth' });
    });
});

// ================================================================
// 6. BACK TO TOP
// ================================================================
document.getElementById('back-to-top').addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ================================================================
// 7. SCROLL REVEAL (Intersection Observer)
// ================================================================
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target); // Only animate once
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
});

document.querySelectorAll('.reveal').forEach(el => {
    revealObserver.observe(el);
});

// ================================================================
// 8. TYPING ANIMATION
// ================================================================
const typedText = document.getElementById('typed-text');

const roles = [
    'IT & Network Engineer',
    'VLSI Enthusiast',
    'Embedded Systems Developer',
    'RF & Microwave Engineer',
];

let roleIndex  = 0;
let charIndex  = 0;
let isDeleting = false;
let typingPaused = false;

const TYPING_SPEED  = 80;
const DELETING_SPEED = 45;
const PAUSE_AFTER_TYPE = 1800;
const PAUSE_BEFORE_TYPE = 300;

function typeRole() {
    if (typingPaused) return;

    const currentRole = roles[roleIndex];

    if (!isDeleting) {
        // Typing forward
        typedText.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;

        if (charIndex === currentRole.length) {
            // Finished typing — pause then start deleting
            typingPaused = true;
            setTimeout(() => {
                typingPaused = false;
                isDeleting = true;
                typeRole();
            }, PAUSE_AFTER_TYPE);
            return;
        }
    } else {
        // Deleting
        typedText.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;

        if (charIndex === 0) {
            // Finished deleting — move to next role
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            typingPaused = true;
            setTimeout(() => {
                typingPaused = false;
                typeRole();
            }, PAUSE_BEFORE_TYPE);
            return;
        }
    }

    setTimeout(typeRole, isDeleting ? DELETING_SPEED : TYPING_SPEED);
}

// Start typing after page load
window.addEventListener('load', () => {
    setTimeout(typeRole, 800);
});

// ================================================================
// 9. CONTACT FORM VALIDATION
// ================================================================
const contactForm = document.getElementById('contact-form');

function showError(inputId, errorId, message) {
    const input = document.getElementById(inputId);
    const error = document.getElementById(errorId);
    input.classList.add('error');
    error.textContent = message;
}

function clearError(inputId, errorId) {
    const input = document.getElementById(inputId);
    const error = document.getElementById(errorId);
    input.classList.remove('error');
    error.textContent = '';
}

function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Real-time validation on blur
['name', 'email', 'message'].forEach(fieldId => {
    const input = document.getElementById(fieldId);
    input.addEventListener('blur', () => validateField(fieldId));
    input.addEventListener('input', () => {
        // Clear error on input
        if (input.classList.contains('error')) {
            clearError(fieldId, fieldId + '-error');
        }
    });
});

function validateField(fieldId) {
    const input = document.getElementById(fieldId);
    const value = input.value.trim();

    if (fieldId === 'name') {
        if (!value) { showError('name', 'name-error', 'Name is required.'); return false; }
        if (value.length < 2) { showError('name', 'name-error', 'Name must be at least 2 characters.'); return false; }
        clearError('name', 'name-error');
        return true;
    }

    if (fieldId === 'email') {
        if (!value) { showError('email', 'email-error', 'Email is required.'); return false; }
        if (!validateEmail(value)) { showError('email', 'email-error', 'Please enter a valid email address.'); return false; }
        clearError('email', 'email-error');
        return true;
    }

    if (fieldId === 'message') {
        if (!value) { showError('message', 'message-error', 'Message is required.'); return false; }
        if (value.length < 10) { showError('message', 'message-error', 'Message must be at least 10 characters.'); return false; }
        clearError('message', 'message-error');
        return true;
    }

    return true;
}

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameValid    = validateField('name');
    const emailValid   = validateField('email');
    const messageValid = validateField('message');

    if (!nameValid || !emailValid || !messageValid) return;

    // Simulate form submission (replace with real endpoint)
    const submitBtn = document.getElementById('submit-btn');
    const btnText   = document.getElementById('btn-text');
    const successEl = document.getElementById('form-success');

    submitBtn.disabled = true;
    btnText.innerHTML  = '<i class="fas fa-circle-notch fa-spin"></i> Sending...';

    setTimeout(() => {
        submitBtn.disabled = false;
        btnText.innerHTML  = '<i class="fas fa-paper-plane"></i> Send Message';
        successEl.textContent = '✓ Message sent successfully! I\'ll get back to you soon.';
        contactForm.reset();

        setTimeout(() => {
            successEl.textContent = '';
        }, 5000);
    }, 1500);
});

// ================================================================
// 10. FOOTER YEAR
// ================================================================
document.getElementById('year').textContent = new Date().getFullYear();

// ================================================================
// 11. INITIAL LOAD
// ================================================================
document.addEventListener('DOMContentLoaded', () => {
    // Trigger initial scroll handler
    handleScroll();

    console.log('%c[M.M] Portfolio Loaded', 'color:#20c9ff; font-family:monospace; font-size:14px;');
});
