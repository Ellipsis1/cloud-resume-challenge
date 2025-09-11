// Visitor Counter Functionality
// This will connect to your AWS API Gateway endpoint later

class VisitorCounter {
    constructor() {
        this.apiEndpoint = null; // Will be set when API is ready
        this.countElement = document.getElementById('visitor-count');
        this.init();
    }

    init() {
        // For now, show a placeholder until we have the API
        this.showPlaceholder();

        // When API is ready, uncomment this:
        // this.updateVisitorCount();
    }

    showPlaceholder() {
        // Show a static number for now, will be replaced with real API call
        const placeholderCount = Math.floor(Math.random() * 100) + 50;
        this.countElement.textContent = placeholderCount;
        this.countElement.style.opacity = '0.7';

        // Add a subtle animation
        this.animateCounter(0, placeholderCount, 1000);
    }

    async updateVisitorCount() {
        if (!this.apiEndpoint) {
            console.log('API endpoint not configured yet');
            return;
        }

        try {
            // Show loading state
            this.countElement.textContent = 'Loading...';
            this.countElement.style.opacity = '0.5';

            // Make API call to increment and get visitor count
            const response = await fetch(this.apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({}),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            const count = data.count || data.visitor_count || 0;

            // Animate the counter update
            this.animateCounter(0, count, 1500);
            this.countElement.style.opacity = '1';

        } catch (error) {
            console.error('Error updating visitor count:', error);
            this.showError();
        }
    }

    animateCounter(start, end, duration) {
        const startTime = performance.now();
        const range = end - start;

        const updateCounter = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function for smooth animation
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const current = Math.floor(start + (range * easeOutQuart));

            this.countElement.textContent = current.toLocaleString();

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            }
        };

        requestAnimationFrame(updateCounter);
    }

    showError() {
        this.countElement.textContent = 'Error';
        this.countElement.style.color = '#e74c3c';
        this.countElement.style.opacity = '0.8';
    }

    // Method to set API endpoint when it's ready
    setApiEndpoint(endpoint) {
        this.apiEndpoint = endpoint;
        console.log('API endpoint configured:', endpoint);
    }
}

// Page load functionality
document.addEventListener('DOMContentLoaded', () => {
    console.log('Cloud Resume Challenge - Frontend Loaded');

    // Initialize visitor counter
    window.visitorCounter = new VisitorCounter();

    // Smooth scrolling for any internal links
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

    // Add loading animations for sections
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
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

    // Add hover effects for project links
    document.querySelectorAll('.project-title a').forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(5px)';
        });

        link.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0)';
        });
    });

    // Add click tracking for analytics (when API is ready)
    trackPageView();
});

// Analytics functions (will connect to API later)
function trackPageView() {
    console.log('Page view tracked at:', new Date().toISOString());

    // When API is ready, send analytics data:
    /*
    fetch('/api/analytics/pageview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            page: window.location.pathname,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            referrer: document.referrer
        })
    }).catch(console.error);
    */
}

function trackEvent(eventName, eventData = {}) {
    console.log('Event tracked:', eventName, eventData);

    // When API is ready, send event data:
    /*
    fetch('/api/analytics/event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            event: eventName,
            data: eventData,
            timestamp: new Date().toISOString()
        })
    }).catch(console.error);
    */
}

// Add click tracking to external links
document.addEventListener('click', (e) => {
    if (e.target.tagName === 'A' && e.target.href.startsWith('http')) {
        const linkText = e.target.textContent.trim();
        const linkUrl = e.target.href;

        trackEvent('external_link_click', {
            text: linkText,
            url: linkUrl,
            section: e.target.closest('.section')?.querySelector('.section-title')?.textContent || 'unknown'
        });
    }
});

// Performance monitoring
window.addEventListener('load', () => {
    // Track page load performance
    const loadTime = performance.now();
    console.log(`Page loaded in ${loadTime.toFixed(2)}ms`);

    trackEvent('page_load_complete', {
        loadTime: loadTime,
        userAgent: navigator.userAgent,
        viewport: {
            width: window.innerWidth,
            height: window.innerHeight
        }
    });
});

// Utility function to update API endpoint when backend is ready
function configureAPI(endpoint) {
    if (window.visitorCounter) {
        window.visitorCounter.setApiEndpoint('https://6xq40rciya.execute-api.us-east-1.amazonaws.com/prod');
        // Immediately try to update count
        window.visitorCounter.updateVisitorCount();
    }
}

// Export for testing/debugging
window.resumeApp = {
    configureAPI,
    trackEvent,
    trackPageView,
    visitorCounter: window.visitorCounter
};