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

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Reveal-on-scroll for cards. Each card is observed individually (rather than
    // watching the whole parent section) so this works no matter how tall the
    // containing section is — a single big threshold on a tall section can fail
    // to ever fire because the target percentage of it is never simultaneously
    // on-screen.
    const revealCards = document.querySelectorAll('.publication-card, .project-card');
    revealCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });

    const cardObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    revealCards.forEach(card => cardObserver.observe(card));

    // Animated stat counters, same per-element observation strategy.
    const statNumbers = document.querySelectorAll('.stat-number');
    const statObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3, rootMargin: '0px 0px -40px 0px' });

    statNumbers.forEach(num => statObserver.observe(num));

    // Fallback: if for any reason a card/stat never intersects (e.g. it's already
    // in the viewport on load and the browser doesn't fire an initial callback,
    // or JS runs after the user has already scrolled past it), make sure nothing
    // is left permanently hidden or stuck at 0.
    window.addEventListener('load', () => {
        revealCards.forEach(card => {
            const rect = card.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0 && card.style.opacity !== '1') {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }
        });
        statNumbers.forEach(num => {
            if (num.textContent === '0') {
                const rect = num.getBoundingClientRect();
                if (rect.top < window.innerHeight && rect.bottom > 0) {
                    animateCounter(num);
                }
            }
        });
    });

    // Mobile Navigation Toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            const isActive = navToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
            navToggle.setAttribute('aria-expanded', isActive ? 'true' : 'false');
        });

        // Close mobile menu when a link is clicked
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                navLinks.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
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
