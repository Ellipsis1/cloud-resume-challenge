// Cloud Resume Challenge - Enhanced Frontend
const API_ENDPOINT = 'https://6xq40rciya.execute-api.us-east-1.amazonaws.com/prod/visitor-count';

/**
 * Update visitor count by calling the Lambda API
 */
async function updateVisitorCount() {
    try {
        // Show loading state
        const countElement = document.getElementById('visitor-count');
        countElement.textContent = 'Loading...';
        countElement.style.opacity = '0.7';

        // Call the API
        const response = await fetch(API_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Parse the nested response structure
        const bodyData = JSON.parse(data.body);
        const count = bodyData.count;

        // Animate the counter update
        animateCounter(0, count, 1500);
        countElement.style.opacity = '1';

        console.log(`Visitor count updated: ${count}`);

    } catch (error) {
        console.error('Error updating visitor count:', error);
        const countElement = document.getElementById('visitor-count');
        countElement.textContent = 'Error';
        countElement.style.opacity = '0.8';
        countElement.style.color = '#e74c3c';
    }
}

/**
 * Animate the counter from start to end value with smooth easing
 */
function animateCounter(start, end, duration) {
    const countElement = document.getElementById('visitor-count');
    const startTime = performance.now();
    const range = end - start;

    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const current = Math.floor(start + (range * easeOutQuart));

        countElement.textContent = current.toLocaleString();

        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        }
    }

    requestAnimationFrame(updateCounter);
}

/**
 * Add smooth scrolling to internal links
 */
function initializeSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

/**
 * Initialize page animations using Intersection Observer
 */
function initializePageAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';

                // Add a slight delay for staggered animations
                const delay = Array.from(entry.target.parentNode.children).indexOf(entry.target) * 100;
                entry.target.style.transitionDelay = `${delay}ms`;
            }
        });
    }, observerOptions);

    // Observe all sections for animation
    document.querySelectorAll('.section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });

    // Animate individual items within sections
    document.querySelectorAll('.experience-item, .project-item, .education-item, .certification-item').forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(15px)';
        item.style.transition = `opacity 0.5s ease ${index * 0.1}s, transform 0.5s ease ${index * 0.1}s`;
        observer.observe(item);
    });
}

/**
 * Add hover effects for interactive elements
 */
function initializeHoverEffects() {
    // Project links hover effects
    document.querySelectorAll('.project-title a').forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(5px)';
            this.style.transition = 'transform 0.3s ease';
        });

        link.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0)';
        });
    });

    // Skill tags hover effects
    document.querySelectorAll('.skill-tag, .tech-tag').forEach(tag => {
        tag.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px) scale(1.05)';
            this.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
        });

        tag.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = 'none';
        });
    });

    // Experience item hover effects
    document.querySelectorAll('.experience-item, .project-item').forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px)';
            this.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
        });

        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 5px 15px rgba(0,0,0,0.1)';
        });
    });
}

/**
 * Track external link clicks for analytics
 */
function initializeLinkTracking() {
    document.addEventListener('click', (e) => {
        if (e.target.tagName === 'A' && e.target.href.startsWith('http')) {
            const linkText = e.target.textContent.trim();
            const linkUrl = e.target.href;
            const section = e.target.closest('.section')?.querySelector('.section-title')?.textContent || 'unknown';

            console.log('External link clicked:', {
                text: linkText,
                url: linkUrl,
                section: section,
                timestamp: new Date().toISOString()
            });

            // In a real application, you might send this to an analytics service
            trackEvent('external_link_click', {
                link_text: linkText,
                link_url: linkUrl,
                section: section
            });
        }
    });
}

/**
 * Simple event tracking function (placeholder for future analytics)
 */
function trackEvent(eventName, eventData = {}) {
    console.log(`Event: ${eventName}`, eventData);

    // Future: Send to analytics service
    // analytics.track(eventName, eventData);
}

/**
 * Add subtle parallax effect to header
 */
function initializeParallaxEffect() {
    const header = document.querySelector('.header');
    if (header) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            header.style.transform = `translateY(${rate}px)`;
        });
    }
}

/**
 * Add loading progress indicator
 */
function showLoadingProgress() {
    // Create progress bar
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, #3498db, #e74c3c);
        z-index: 9999;
        transition: width 0.3s ease;
    `;
    document.body.appendChild(progressBar);

    // Simulate loading progress
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 30;
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            setTimeout(() => {
                progressBar.style.opacity = '0';
                setTimeout(() => progressBar.remove(), 300);
            }, 200);
        }
        progressBar.style.width = progress + '%';
    }, 100);
}

/**
 * Performance monitoring
 */
function monitorPerformance() {
    window.addEventListener('load', () => {
        const loadTime = performance.now();
        console.log(`Page loaded in ${loadTime.toFixed(2)}ms`);

        trackEvent('page_load_complete', {
            load_time: loadTime,
            user_agent: navigator.userAgent,
            viewport: {
                width: window.innerWidth,
                height: window.innerHeight
            }
        });

        // Report Core Web Vitals if available
        if ('web-vital' in window) {
            // This would integrate with web-vitals library
            console.log('Web Vitals monitoring enabled');
        }
    });
}

// Main initialization function
document.addEventListener('DOMContentLoaded', () => {
    console.log('Cloud Resume Challenge - Frontend Loaded');

    // Show loading progress
    showLoadingProgress();

    // Initialize all features
    updateVisitorCount();
    initializeSmoothScrolling();
    initializePageAnimations();
    initializeHoverEffects();
    initializeLinkTracking();
    initializeParallaxEffect();
    monitorPerformance();

    // Add keyboard navigation for accessibility
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });

    document.addEventListener('mousedown', () => {
        document.body.classList.remove('keyboard-navigation');
    });

    console.log('All features initialized successfully');
});