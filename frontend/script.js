// Cloud Resume Challenge - Visitor Counter
// Replace with your actual API Gateway endpoint
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
        const count = data.count;

        // Update the display with animation
        animateCounter(0, count, 1000);
        countElement.style.opacity = '1';

        console.log(`Visitor count updated: ${count}`);

    } catch (error) {
        console.error('Error updating visitor count:', error);
        document.getElementById('visitor-count').textContent = 'Error';
        document.getElementById('visitor-count').style.opacity = '0.8';
    }
}

/**
 * Animate the counter from start to end value
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

// Page load functionality
document.addEventListener('DOMContentLoaded', () => {
    console.log('Cloud Resume Challenge - Frontend Loaded');

    // Initialize visitor counter
    updateVisitorCount();

    // Smooth scrolling for internal links
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
            this.style.transition = 'transform 0.3s ease';
        });

        link.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0)';
        });
    });
});

// Track external link clicks (for analytics when needed)
document.addEventListener('click', (e) => {
    if (e.target.tagName === 'A' && e.target.href.startsWith('http')) {
        const linkText = e.target.textContent.trim();
        const linkUrl = e.target.href;

        console.log('External link clicked:', {
            text: linkText,
            url: linkUrl,
            section: e.target.closest('.section')?.querySelector('.section-title')?.textContent || 'unknown'
        });
    }
});

// Performance monitoring
window.addEventListener('load', () => {
    const loadTime = performance.now();
    console.log(`Page loaded in ${loadTime.toFixed(2)}ms`);
});