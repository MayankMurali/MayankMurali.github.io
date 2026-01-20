// Animated counter for statistics
function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000; // 2 seconds
    const increment = target / (duration / 16); // 60fps
    let current = 0;

    const updateCounter = () => {
        current += increment;
        if (current < target) {
            element.textContent = Math.floor(current);
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target;
        }
    };

    updateCounter();
}

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Animate stat numbers
            const statNumbers = entry.target.querySelectorAll('.stat-number');
            statNumbers.forEach(num => {
                if (num.textContent === '0') {
                    animateCounter(num);
                }
            });
            
            // Add fade-in animations to other elements
            const cards = entry.target.querySelectorAll('.publication-card, .project-card');
            cards.forEach((card, index) => {
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, index * 100);
            });
        }
    });
}, observerOptions);

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const researchSection = document.querySelector('.research-page');
    if (researchSection) {
        observer.observe(researchSection);
        
        // Set initial state for cards
        const cards = researchSection.querySelectorAll('.publication-card, .project-card');
        cards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        });
    }

    // Mobile Navigation Toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        // Close mobile menu when a link is clicked
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }

    // Active nav link highlighting on scroll
    const sections = document.querySelectorAll('.section');
    const navItems = document.querySelectorAll('.nav-links a');

    const highlightNav = () => {
        let scrollPos = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navItems.forEach(item => {
                    item.classList.remove('active');
                    if (item.getAttribute('href') === '#' + sectionId) {
                        item.classList.add('active');
                    }
                });
            }
        });
    };

    window.addEventListener('scroll', highlightNav);
    highlightNav(); // Initial call

    // Hide/show navigation based on landing page visibility
    const topNav = document.querySelector('.top-nav');
    const landingPage = document.getElementById('landing-page');
    
    if (topNav && landingPage) {
        const handleNavVisibility = () => {
            const landingBottom = landingPage.offsetTop + landingPage.offsetHeight;
            const scrollPos = window.scrollY;
            
            // Hide nav when scrolled past landing page
            if (scrollPos > landingBottom - 100) {
                topNav.classList.add('nav-hidden');
            } else {
                topNav.classList.remove('nav-hidden');
            }
        };

        window.addEventListener('scroll', handleNavVisibility);
        handleNavVisibility(); // Initial call
    }
});
