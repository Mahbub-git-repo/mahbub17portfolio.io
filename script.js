// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

// Sidebar elements
const sidebarToggle = document.querySelector('.sidebar-toggle');
const sidebar = document.querySelector('.sidebar');
const sidebarClose = document.querySelector('.sidebar-close');
const sidebarOverlay = document.createElement('div');
sidebarOverlay.className = 'sidebar-overlay';
document.body.appendChild(sidebarOverlay);

// Mobile menu toggle
hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    hamburger.innerHTML = navLinks.classList.contains('active') 
        ? '<i class="fas fa-times"></i>' 
        : '<i class="fas fa-bars"></i>';
});

// Sidebar toggle functionality
sidebarToggle.addEventListener('click', () => {
    sidebar.classList.add('active');
    sidebarOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
});

sidebarClose.addEventListener('click', () => {
    closeSidebar();
});

sidebarOverlay.addEventListener('click', () => {
    closeSidebar();
});

function closeSidebar() {
    sidebar.classList.remove('active');
    sidebarOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-links a, .sidebar-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        hamburger.innerHTML = '<i class="fas fa-bars"></i>';
        closeSidebar();
    });
});

// Enhanced smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            // Calculate the target position with offset
            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - 80;
            
            // Smooth scroll with easing
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Sticky header with enhanced scroll effects
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    const progressBar = document.querySelector('.progress-bar');
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Header background on scroll
    if (scrollTop > 100) {
        header.classList.add('scrolled');
        header.style.boxShadow = '0 5px 20px rgba(2, 12, 27, 0.7)';
    } else {
        header.classList.remove('scrolled');
        header.style.boxShadow = 'none';
    }
    
    // Progress bar
    if (progressBar) {
        const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (scrollTop / windowHeight) * 100;
        progressBar.style.width = progress + '%';
    }
});

// Create progress bar element
const progressBar = document.createElement('div');
progressBar.className = 'progress-bar';
document.body.appendChild(progressBar);

// Enhanced intersection observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            
            // Animate skill items with staggered delay
            if (entry.target.id === 'skills') {
                const skillItems = entry.target.querySelectorAll('.skill-item');
                skillItems.forEach((item, index) => {
                    setTimeout(() => {
                        item.style.transitionDelay = `${(index % 5) * 0.1}s`;
                    }, 300);
                });
            }
        }
    });
}, observerOptions);

// Observe all sections for animation
document.querySelectorAll('.section').forEach(section => {
    observer.observe(section);
});

// Additional animation for elements within sections
const elementObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
        }
    });
}, {
    threshold: 0.2,
    rootMargin: '0px 0px -30px 0px'
});

// Observe specific elements for additional animations
document.querySelectorAll('.skill-category, .portfolio-item, .education-item, .contact-item').forEach(el => {
    elementObserver.observe(el);
});

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    const heroContent = document.querySelector('.hero-content');
    
    if (hero && heroContent) {
        const rate = scrolled * -0.5;
        heroContent.style.transform = `translateY(${rate}px)`;
    }
});

// Add loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // Add slight delay for hero animations to feel more natural
    setTimeout(() => {
        document.querySelector('.hero').classList.add('loaded');
    }, 500);
});

// Enhanced hover effects for buttons
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('mouseenter', function(e) {
        const x = e.pageX - this.offsetLeft;
        const y = e.pageY - this.offsetTop;
        
        this.style.setProperty('--x', x + 'px');
        this.style.setProperty('--y', y + 'px');
    });
});

// Keyboard navigation enhancement
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        navLinks.classList.remove('active');
        hamburger.innerHTML = '<i class="fas fa-bars"></i>';
        closeSidebar();
    }
});

// Performance optimization: Throttle scroll events
let scrollTimeout;
window.addEventListener('scroll', () => {
    if (!scrollTimeout) {
        scrollTimeout = setTimeout(() => {
            scrollTimeout = null;
            
            // Update active navigation link based on scroll position
            const sections = document.querySelectorAll('.section');
            const navLinks = document.querySelectorAll('.nav-links a');
            const sidebarLinks = document.querySelectorAll('.sidebar-links a');
            
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                if (window.pageYOffset >= sectionTop - 100) {
                    current = section.getAttribute('id');
                }
            });
            
            // Update main navigation
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href').substring(1) === current) {
                    link.classList.add('active');
                }
            });
            
            // Update sidebar navigation
            sidebarLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href').substring(1) === current) {
                    link.classList.add('active');
                }
            });
            
        }, 100);
    }
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Add loaded class to body for initial animations
    document.body.classList.add('loaded');
    
    // Initialize hero section as visible
    document.querySelector('.hero').classList.add('visible');
    
    console.log('Portfolio website initialized with enhanced animations and sidebar!');
});
// Typing Animation
const typedTextSpan = document.querySelector(".typed-text");
const cursorSpan = document.querySelector(".cursor");

const textArray = ["VLSI Enthusiast", "Machine Learning Enthusiast"];
const typingDelay = 100;
const erasingDelay = 50;
const newTextDelay = 1500; // Delay between current and next text
let textArrayIndex = 0;
let charIndex = 0;

function type() {
    if (charIndex < textArray[textArrayIndex].length) {
        if(!cursorSpan.classList.contains("typing")) cursorSpan.classList.add("typing");
        typedTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex);
        charIndex++;
        setTimeout(type, typingDelay);
    } 
    else {
        cursorSpan.classList.remove("typing");
        setTimeout(erase, newTextDelay);
    }
}

function erase() {
    if (charIndex > 0) {
        if(!cursorSpan.classList.contains("typing")) cursorSpan.classList.add("typing");
        typedTextSpan.textContent = textArray[textArrayIndex].substring(0, charIndex-1);
        charIndex--;
        setTimeout(erase, erasingDelay);
    } 
    else {
        cursorSpan.classList.remove("typing");
        textArrayIndex++;
        if(textArrayIndex >= textArray.length) textArrayIndex = 0;
        setTimeout(type, typingDelay + 1100);
    }
}

// Initialize typing animation when page loads
document.addEventListener("DOMContentLoaded", function() {
    if(textArray.length) setTimeout(type, newTextDelay + 250);
});
// Fix About section delay on mobile
if (window.innerWidth <= 768) {
    const aboutSection = document.querySelector('#about');
    if (aboutSection) {
        aboutSection.classList.add('visible');
    }
}
