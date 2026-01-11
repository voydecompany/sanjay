document.addEventListener('DOMContentLoaded', () => {

    // ================= SMOOTH SCROLL (LENIS) =================
    // Initialize Lenis for premium smooth scrolling
    const lenis = new Lenis({
        duration: 0.8, // Reduced from 1.2 for faster, less laggy feel on mobile
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: true, // Enable smooth scrolling on mobile/touch devices
        touchMultiplier: 1.5, // Reduced from 2 for more responsive touch
        infinite: false,
        syncTouch: true, // Better touch synchronization
        syncTouchLerp: 0.1, // Smoother touch interpolation
        touchInertiaMultiplier: 20, // Reduced for less momentum/lag
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // ================= LOADER LOGIC =================
    const loader = document.getElementById('loader');
    const body = document.body;

    // Wait for signature animation to complete (3s animation + 0.5s pause)
    setTimeout(() => {
        hideLoader();
    }, 3500);

    function hideLoader() {
        loader.style.transition = 'opacity 0.8s ease, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
        loader.style.opacity = '0';
        loader.style.transform = 'translateY(-100%)';

        setTimeout(() => {
            loader.style.display = 'none';
            body.classList.add('loaded');

            // Trigger Hero Animations manually after load
            document.querySelectorAll('.hero-content .reveal-text, .hero-bg-text, .hero-img, .hero-role-small, .hero-cta').forEach((el, index) => {
                // Ensure browser repaints to trigger CSS animations if needed
                el.style.animationPlayState = 'running';
            });

        }, 800);
    }

    // ================= INTERSECTION OBSERVER (Old School + Efficient) =================
    // We use this for fading in elements as they scroll into view
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal-up, .reveal-text').forEach(el => {
        observer.observe(el);
    });

    // ================= PARALLAX EFFECT (Optimized for Performance) =================
    let ticking = false;
    let lastScrollY = 0;

    // Detect if device is mobile
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    function updateParallax() {
        const scrolled = lastScrollY;

        // Hero Background Text Parallax (only on desktop for performance)
        if (!isMobile) {
            const heroBgText = document.querySelector('.hero-bg-text-container');
            if (heroBgText) {
                heroBgText.style.transform = `translate(-50%, calc(-50% + ${scrolled * 0.15}px))`;
                heroBgText.style.opacity = 1 - (scrolled / 500);
            }

            // Aerostellar Background Parallax
            const shape = document.querySelector('.abstract-shape');
            if (shape) {
                shape.style.transform = `translateY(${scrolled * 0.15}px) rotate(${scrolled * 0.05}deg)`;
            }
        }

        ticking = false;
    }

    window.addEventListener('scroll', () => {
        lastScrollY = window.scrollY;

        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }, { passive: true }); // Passive listener for better scroll performance

    // ================= NAVIGATION SCROLL =================
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // ================= MOBILE MENU =================
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const closeMenu = document.querySelector('.close-menu');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = mobileMenu.querySelectorAll('a');

    function toggleMenu() {
        mobileMenu.classList.toggle('active');
        if (mobileMenu.classList.contains('active')) {
            lenis.stop(); // Stop scrolling when menu is open
        } else {
            lenis.start();
        }
    }

    menuToggle.addEventListener('click', toggleMenu);
    closeMenu.addEventListener('click', toggleMenu);
    mobileLinks.forEach(link => {
        link.addEventListener('click', toggleMenu);
    });

    // ================= MAGNET BUTTON EFFECT (Optional Polish) =================
    // Applies to primary buttons for a "sticky" feel
    const buttons = document.querySelectorAll('.btn-primary, .social-icon');

    buttons.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px) scale(1.1)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0, 0) scale(1)';
        });
    });

    // Smooth Scroll for Anchors (connecting with Lenis)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                lenis.scrollTo(target);
            }
        });
    });

});
