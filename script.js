/* ===== Resume Portfolio - Main Script (refactored) ===== */

document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    // ==========================================
    // 0. PROGRESSIVE ENHANCEMENT / ACCESSIBILITY
    // ==========================================
    document.documentElement.classList.remove('no-js');
    document.documentElement.classList.add('js');

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches || window.matchMedia('(hover: none)').matches;
    const isFinePointer = window.matchMedia('(pointer: fine)').matches;

    // ==========================================
    // 0b. PRELOADER (Solo Leveling "SYSTEM LOADING")
    // ==========================================
    const preloader = document.getElementById('preloader');
    const preloaderBar = document.getElementById('preloaderBar');
    function hidePreloader() {
        if (!preloader) return;
        preloader.classList.add('preloader-hidden');
        setTimeout(() => preloader.remove(), 400);
    }
    if (preloader) {
        if (preloaderBar) {
            let pct = 0;
            const barTimer = setInterval(() => {
                pct = Math.min(pct + Math.floor(Math.random() * 16 + 6), 100);
                preloaderBar.style.width = pct + '%';
                if (pct >= 100) clearInterval(barTimer);
            }, 110);
        }
        // Hide on full load (with small delay so the bar can finish)
        window.addEventListener('load', () => setTimeout(hidePreloader, 350));
        // Fallback so content is never trapped behind the preloader
        setTimeout(hidePreloader, 4000);
    }

    // ==========================================
    // 1. DARK / LIGHT MODE TOGGLE
    // ==========================================
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = themeToggle ? themeToggle.querySelector('i') : null;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedTheme = localStorage.getItem('theme');
    const activeTheme = savedTheme || (prefersDark ? 'dark' : 'light');

    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        if (themeIcon) {
            themeIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
    }

    if (themeToggle) {
        applyTheme(activeTheme);
        themeToggle.addEventListener('click', function() {
            const current = document.documentElement.getAttribute('data-theme') || 'light';
            applyTheme(current === 'dark' ? 'light' : 'dark');
            localStorage.setItem('theme', current === 'dark' ? 'light' : 'dark');
        });
    }

    // ==========================================
    // 2. PARTICLE NETWORK CANVAS
    // ==========================================
    (function initParticleNetwork() {
        const canvas = document.getElementById('particleCanvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let particles = [];
        let mouseX = -9999, mouseY = -9999;
        let rafId = null;
        let running = false;
        let isDark = document.documentElement.getAttribute('data-theme') === 'dark';

        function resize() {
            const dpr = window.devicePixelRatio || 1;
            canvas.width = Math.floor(window.innerWidth * dpr);
            canvas.height = Math.floor(window.innerHeight * dpr);
            canvas.style.width = window.innerWidth + 'px';
            canvas.style.height = window.innerHeight + 'px';
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        }
        resize();
        window.addEventListener('resize', resize);

        // Scale particle count to viewport (bounded for performance)
        const PARTICLE_COUNT = Math.min(55, Math.max(28, Math.floor(window.innerWidth / 26)));
        const CONNECTION_DIST = 140;
        const MOUSE_DIST = 200;

        class Particle {
            constructor() { this.reset(); }
            reset() {
                this.x = Math.random() * window.innerWidth;
                this.y = Math.random() * window.innerHeight;
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                this.radius = Math.random() * 2.5 + 1;
            }
            update() {
                this.x += this.vx;
                this.y += this.vy;
                if (this.x < 0 || this.x > window.innerWidth) this.vx *= -1;
                if (this.y < 0 || this.y > window.innerHeight) this.vy *= -1;

                // Mouse interaction (guard against divide-by-zero)
                const dx = this.x - mouseX;
                const dy = this.y - mouseY;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist > 0 && dist < MOUSE_DIST) {
                    const force = (MOUSE_DIST - dist) / MOUSE_DIST;
                    this.vx += (dx / dist) * force * 0.02;
                    this.vy += (dy / dist) * force * 0.02;
                    const maxV = 1.5;
                    const spd = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
                    if (spd > maxV) {
                        this.vx = (this.vx / spd) * maxV;
                        this.vy = (this.vy / spd) * maxV;
                    }
                }
            }
            draw() {
                const color = isDark ? '148, 163, 184' : '37, 99, 235';
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${color}, ${isDark ? '0.5' : '0.4'})`;
                ctx.fill();
            }
        }

        for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());

        function drawConnections() {
            const color = isDark ? '148, 163, 184' : '37, 99, 235';
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < CONNECTION_DIST) {
                        const opacity = (1 - dist / CONNECTION_DIST) * (isDark ? 0.25 : 0.2);
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(${color}, ${opacity})`;
                        ctx.lineWidth = 0.6;
                        ctx.stroke();
                    }
                }
            }
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            particles.forEach(p => { p.update(); p.draw(); });
            drawConnections();
            rafId = requestAnimationFrame(animate);
        }

        function start() {
            if (!running && !reduceMotion) {
                running = true;
                animate();
            }
        }

        function stop() {
            if (rafId !== null) {
                cancelAnimationFrame(rafId);
                rafId = null;
            }
            running = false;
        }

        // Pause/resume on tab visibility (single loop, battery friendly)
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                stop();
            } else {
                start();
            }
        });

        if (reduceMotion) {
            // Static single frame for reduced-motion users
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.x = Math.random() * window.innerWidth;
                p.y = Math.random() * window.innerHeight;
                p.draw();
            });
            drawConnections();
        } else {
            document.addEventListener('mousemove', (e) => {
                mouseX = e.clientX;
                mouseY = e.clientY;
            });
            document.addEventListener('mouseleave', () => {
                mouseX = -9999;
                mouseY = -9999;
            });
            const observer = new MutationObserver(() => {
                isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            });
            observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
            start();
        }
    })();

    // ==========================================
    // 3. COPYRIGHT YEAR
    // ==========================================
    const yearElement = document.getElementById('currentYear');
    if (yearElement) yearElement.textContent = new Date().getFullYear();

    // ==========================================
    // 4. TYPING EFFECT
    // ==========================================
    const typedRole = document.getElementById('typedRole');
    const cursorEl = document.querySelector('.typed-cursor');
    const roles = [
        'Desktop Support Engineer',
        'L1 Technical Support',
        'IT Support Specialist',
        'Hardware Troubleshooter'
    ];
    let roleIndex = 0;
    let charIndex = 0;
    let deleting = false;

    if (cursorEl) cursorEl.style.opacity = '1';

    function updateTypedRole() {
        if (!typedRole) return;
        const currentRole = roles[roleIndex];
        typedRole.textContent = currentRole.substring(0, charIndex);

        if (!deleting) {
            charIndex += 1;
            if (charIndex > currentRole.length) {
                deleting = true;
                setTimeout(updateTypedRole, 1800);
                return;
            }
        } else {
            charIndex -= 1;
            if (charIndex < 0) {
                deleting = false;
                roleIndex = (roleIndex + 1) % roles.length;
            }
        }
        setTimeout(updateTypedRole, deleting ? 80 : 120);
    }

    if (reduceMotion) {
        if (typedRole) typedRole.textContent = roles[0];
    } else {
        updateTypedRole();
    }

    // ==========================================
    // 5. STATUS BADGE CYCLING
    // ==========================================
    const statusBadge = document.querySelector('.hero-avatar-badge');
    if (statusBadge) {
        if (!reduceMotion) {
            const statusMessages = [
                'Open to opportunities',
                'Available for hire',
                'Ready to work',
                'Seeking new role',
                'Open to work'
            ];
            let statusIndex = 0;
            function cycleStatusBadge() {
                statusIndex = (statusIndex + 1) % statusMessages.length;
                statusBadge.style.opacity = '0';
                statusBadge.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    statusBadge.textContent = statusMessages[statusIndex];
                    statusBadge.style.opacity = '1';
                    statusBadge.style.transform = 'scale(1)';
                }, 300);
            }
            statusBadge.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            setInterval(cycleStatusBadge, 4000);
        } else {
            statusBadge.textContent = 'Open to opportunities';
        }
    }

    // ==========================================
    // 6. AVATAR CLICK SHADOW BURST
    // ==========================================
    const heroAvatar = document.querySelector('.hero-avatar');
    function createSoloBurst(x, y) {
        const burst = document.createElement('div');
        burst.className = 'solo-shadow-particle';
        burst.style.left = `${x}px`;
        burst.style.top = `${y}px`;
        burst.style.setProperty('--burst-x', `${(Math.random() - 0.5) * 80}px`);
        burst.style.setProperty('--burst-y', `${(Math.random() - 0.5) * 80}px`);
        burst.style.animationDuration = '1.2s'; // needed for the burst keyframes
        document.body.appendChild(burst);
        setTimeout(() => burst.remove(), 1300);
    }

    if (heroAvatar && !reduceMotion) {
        heroAvatar.addEventListener('click', (event) => {
            createSoloBurst(event.clientX, event.clientY);
        });
    }

    // ==========================================
    // 7. SCROLL REVEAL ANIMATIONS
    // ==========================================
    const animatedElements = document.querySelectorAll('.about-text, .stat, .timeline-item, .skill-category, .education-card, .portfolio-card, .contact-item, .contact-form, .section-title, .section-divider, .highlight-card');

    animatedElements.forEach((element, index) => {
        element.classList.add('animate-on-scroll');
        // Cap the stagger delay so later elements don't wait long (reduces laggy feel)
        element.style.transitionDelay = `${Math.min(index, 8) * 60}ms`;
    });

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });
    animatedElements.forEach(element => revealObserver.observe(element));

    // Highlight cards have their own dedicated reveal (fixes E1)
    const highlightCards = document.querySelectorAll('.highlight-card');
    highlightCards.forEach((card, index) => {
        card.style.transitionDelay = `${index * 100}ms`;
        revealObserver.observe(card);
    });

    // ==========================================
    // 8. COPY EMAIL + TOAST
    // ==========================================
    const EMAIL = 'dilipkumar8923@outlook.com';
    const copyEmailBtn = document.getElementById('copyEmail');

    function copyTextToClipboard(text) {
        return new Promise((resolve) => {
            const fallback = () => {
                const textarea = document.createElement('textarea');
                textarea.value = text;
                textarea.setAttribute('readonly', '');
                textarea.style.position = 'fixed';
                textarea.style.top = '0';
                textarea.style.left = '-9999px';
                textarea.style.opacity = '0';
                document.body.appendChild(textarea);
                textarea.focus();
                textarea.select();
                textarea.setSelectionRange(0, text.length);
                let ok = false;
                try {
                    ok = document.execCommand('copy');
                } catch (err) {
                    ok = false;
                }
                textarea.remove();
                resolve(ok);
            };

            if (navigator.clipboard && window.isSecureContext) {
                navigator.clipboard.writeText(text).then(() => resolve(true)).catch(() => fallback());
            } else {
                fallback();
            }
        });
    }

    function showToast(message, type) {
        const existing = document.querySelector('.toast-message');
        if (existing) existing.remove();

        const toast = document.createElement('div');
        toast.className = 'toast-message';
        toast.setAttribute('role', 'status');
        toast.setAttribute('aria-live', 'polite');
        if (type === 'error') toast.classList.add('toast-error');
        toast.textContent = message;
        document.body.appendChild(toast);
        requestAnimationFrame(() => toast.classList.add('show'));
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 250);
        }, 2600);
    }

    if (copyEmailBtn) {
        copyEmailBtn.addEventListener('click', async () => {
            const icon = copyEmailBtn.querySelector('i');
            const originalClass = icon ? icon.className : '';
            const ok = await copyTextToClipboard(EMAIL);
            if (ok) {
                if (icon) {
                    icon.className = 'fas fa-check';
                    icon.style.color = '#10b981';
                }
                showToast('Email copied to clipboard!');
            } else {
                showToast('Unable to copy email automatically. Please copy it manually.', 'error');
            }
            setTimeout(() => {
                if (icon) {
                    icon.className = originalClass;
                    icon.style.color = '';
                }
            }, 1600);
        });
    }

    // ==========================================
    // 9. MOBILE HAMBURGER MENU
    // ==========================================
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', function() {
            const isOpen = navLinks.classList.toggle('active');
            this.classList.toggle('active', isOpen);
            this.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        });

        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
            });
        });
    }

    function closeMobileMenu() {
        if (navLinks && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            if (hamburger) {
                hamburger.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
            }
        }
    }

    // Close the mobile menu when resizing to a desktop-width viewport
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) closeMobileMenu();
    });

    // ==========================================
    // 10. UNIFIED SCROLL HANDLER (rAF-throttled)
    // ==========================================
    const navbar = document.getElementById('navbar');
    const backToTop = document.getElementById('backToTop');
    const scrollProgress = document.getElementById('scrollProgress');

    function updateNavbar() {
        if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 50);
    }

    function updateBackToTop() {
        if (backToTop) backToTop.classList.toggle('visible', window.scrollY > 500);
    }

    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const navLinkAnchors = document.querySelectorAll('.nav-links a');
        let current = '';
        sections.forEach(section => {
            if (window.scrollY >= section.offsetTop - 150) {
                current = section.getAttribute('id');
            }
        });
        navLinkAnchors.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
        });
    }

    function updateScrollProgress() {
        if (!scrollProgress) return;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0;
        scrollProgress.style.width = scrollPercent + '%';
    }

    // Back-to-top circular progress ring
    const backToTopProgress = document.getElementById('backToTopProgress');
    function updateBackToTopProgress() {
        if (!backToTopProgress) return;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = docHeight > 0 ? (window.scrollY / docHeight) : 0;
        const circumference = 2 * Math.PI * 25; // matches SVG r="25"
        backToTopProgress.style.strokeDashoffset = (circumference * (1 - scrollPercent)).toFixed(2);
    }

    // Skill rings (circular progress)
    const skillRings = document.querySelectorAll('.skill-ring');
    let skillRingsAnimated = false;
    function animateSkillRings() {
        if (skillRingsAnimated || !skillRings.length) return;
        const triggerPoint = window.innerHeight * 0.85;
        const skillsSection = document.getElementById('skills');
        if (skillsSection) {
            const sectionTop = skillsSection.getBoundingClientRect().top;
            if (sectionTop < triggerPoint) {
                skillRings.forEach(ring => {
                    const value = parseInt(ring.getAttribute('data-progress') || '0', 10);
                    ring.style.setProperty('--progress', value + '%');
                    ring.classList.add('animate');
                    const valueEl = ring.querySelector('.skill-ring-value');
                    if (valueEl) {
                        let current = 0;
                        const step = Math.max(1, Math.round(value / 60));
                        const timer = setInterval(() => {
                            current = Math.min(current + step, value);
                            valueEl.textContent = current + '%';
                            if (current >= value) clearInterval(timer);
                        }, 30);
                    }
                });
                skillRingsAnimated = true;
            }
        }
    }

    // Certification progress bars (feature F3)
    const certFills = document.querySelectorAll('.cert-progress-fill');
    let certsAnimated = false;
    function animateCertBars() {
        if (certsAnimated) return;
        const triggerPoint = window.innerHeight * 0.9;
        const certSection = document.getElementById('certifications');
        if (certSection && certSection.getBoundingClientRect().top < triggerPoint) {
            certFills.forEach(bar => {
                bar.style.width = (bar.getAttribute('data-progress') || 0) + '%';
            });
            certsAnimated = true;
        }
    }

    // Animated stat counters (single implementation with power pulse - fixes E6)
    const statNumbers = document.querySelectorAll('.stat-number');
    let countersAnimated = false;
    function animateCounters() {
        if (countersAnimated) return;
        const triggerPoint = window.innerHeight * 0.85;
        const aboutSection = document.getElementById('about');
        if (aboutSection) {
            const sectionTop = aboutSection.getBoundingClientRect().top;
            if (sectionTop < triggerPoint) {
                statNumbers.forEach((stat, index) => {
                    const text = stat.textContent.trim();
                    const suffix = text.includes('+') ? '+' : '';
                    const targetValue = parseInt(text.replace(/[^0-9]/g, ''), 10);
                    if (!isNaN(targetValue)) {
                        const duration = 2000;
                        const delay = index * 200;
                        const startTime = performance.now() + delay;
                        function updateCounter(currentTime) {
                            const elapsed = currentTime - startTime;
                            if (elapsed < 0) {
                                requestAnimationFrame(updateCounter);
                                return;
                            }
                            const progress = Math.min(elapsed / duration, 1);
                            const easeOut = 1 - Math.pow(1 - progress, 3);
                            stat.textContent = Math.floor(easeOut * targetValue) + suffix;
                            if (progress < 1) {
                                requestAnimationFrame(updateCounter);
                            } else {
                                stat.classList.add('power-pulse');
                                setTimeout(() => stat.classList.remove('power-pulse'), 600);
                            }
                        }
                        requestAnimationFrame(updateCounter);
                    }
                });
                countersAnimated = true;
            }
        }
    }

    // Shadow particles on scroll (throttled)
    let shadowParticleTimer = null;
    let lastShadowParticleTime = 0;
    function createScrollShadowParticles() {
        if (reduceMotion || isTouchDevice) return;
        const now = Date.now();
        if (now - lastShadowParticleTime < 400) return;
        lastShadowParticleTime = now;

        if (shadowParticleTimer) clearTimeout(shadowParticleTimer);
        shadowParticleTimer = setTimeout(() => {
            if (Math.random() > 0.7) return;
            for (let i = 0; i < 3; i++) {
                const particle = document.createElement('div');
                particle.className = 'solo-shadow-particle';
                particle.style.left = (Math.random() * 80 + 10) + '%';
                particle.style.bottom = '0';
                particle.style.width = (Math.random() * 4 + 2) + 'px';
                particle.style.height = particle.style.width;
                particle.style.animationDuration = (Math.random() * 3 + 2) + 's';
                particle.style.animationDelay = (Math.random() * 0.5) + 's';
                document.body.appendChild(particle);
                setTimeout(() => particle.remove(), 5200);
            }
        }, 200);
    }

    let ticking = false;
    function handleScroll() {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(function() {
            updateNavbar();
            updateBackToTop();
            updateActiveNavLink();
            animateSkillRings();
            animateCertBars();
            animateCounters();
            updateScrollProgress();
            updateBackToTopProgress();
            createScrollShadowParticles();
            ticking = false;
        });
    }
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Initial state on load
    window.addEventListener('load', function() {
        updateNavbar();
        updateBackToTop();
        updateActiveNavLink();
        animateSkillRings();
        animateCertBars();
        animateCounters();
        updateScrollProgress();
        updateBackToTopProgress();
    });

    // ==========================================
    // 10b. AMBIENT MOUSE SPOTLIGHT (desktop only)
    // ==========================================
    const mouseSpotlight = document.getElementById('mouseSpotlight');
    if (mouseSpotlight && !reduceMotion && window.matchMedia('(pointer: fine)').matches) {
        let spotlightX = -500;
        let spotlightY = -500;
        let spotlightRAF = null;

        function moveSpotlight(e) {
            spotlightX = e.clientX;
            spotlightY = e.clientY;
        }

        function animateSpotlight() {
            const w = mouseSpotlight.offsetWidth;
            const h = mouseSpotlight.offsetHeight;
            mouseSpotlight.style.transform = `translate3d(${spotlightX - w / 2}px, ${spotlightY - h / 2}px, 0)`;
            spotlightRAF = requestAnimationFrame(animateSpotlight);
        }

        document.addEventListener('mousemove', moveSpotlight, { passive: true });
        mouseSpotlight.classList.add('active');
        animateSpotlight();
    }

    // ==========================================
    // 10c. KONAMI CODE - PORTAL AURA EASTER EGG
    // ==========================================
    const konamiAura = document.getElementById('konamiAura');
    const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let konamiIndex = 0;

    function triggerKonami() {
        if (!konamiAura || reduceMotion) return;
        konamiAura.classList.add('active');
        setTimeout(() => konamiAura.classList.remove('active'), 4000);
    }

    document.addEventListener('keydown', function(e) {
        const target = e.target;
        const isTyping = target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable);
        if (isTyping) return;

        const expectedKey = konamiSequence[konamiIndex];
        const actualKey = e.key.length === 1 ? e.key.toLowerCase() : e.key;
        if (actualKey === expectedKey) {
            konamiIndex += 1;
            if (konamiIndex >= konamiSequence.length) {
                konamiIndex = 0;
                triggerKonami();
            }
        } else {
            konamiIndex = (actualKey === konamiSequence[0]) ? 1 : 0;
        }
    });

    // ==========================================
    // 11. SMOOTH SCROLL FOR NAV LINKS
    // ==========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: reduceMotion ? 'auto' : 'smooth'
                });
            }
        });
    });

    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
        });
    }

    // ==========================================
    // 12. MODALS (Project / Resume / Help)
    // ==========================================
    const modal = document.getElementById('projectModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalDescription = document.getElementById('modalDescription');
    const modalHighlights = document.getElementById('modalHighlights');
    const modalClose = document.getElementById('modalClose');

    const resumeModal = document.getElementById('resumeModal');
    const resumeModalClose = document.getElementById('resumeModalClose');

    const helpModal = document.getElementById('helpModal');
    const helpModalClose = document.getElementById('helpModalClose');

    let lastFocusedButton = null;

    function lockScroll() {
        document.body.style.overflow = 'hidden';
    }
    function unlockScroll() {
        document.body.style.overflow = '';
    }

    function closeAllModals() {
        document.querySelectorAll('.modal, .resume-modal').forEach(m => {
            m.classList.remove('active');
            m.setAttribute('aria-hidden', 'true');
        });
        unlockScroll();
        if (lastFocusedButton) {
            lastFocusedButton.focus();
            lastFocusedButton = null;
        }
    }

    function openModal(m) {
        if (!m) return;
        m.classList.add('active');
        m.setAttribute('aria-hidden', 'false');
        lockScroll();
        // Move focus into the modal (improves keyboard accessibility)
        const closeBtn = m.querySelector('[data-modal-close], .modal-close, .resume-modal-close');
        const firstFocusable = m.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        const focusTarget = (closeBtn || firstFocusable);
        if (focusTarget) focusTarget.focus();
    }

    function closeModal(m, restoreFocus = true) {
        if (!m) return;
        m.classList.remove('active');
        m.setAttribute('aria-hidden', 'true');
        unlockScroll();
        if (restoreFocus && lastFocusedButton) lastFocusedButton.focus();
    }

    // Project modal open
    document.querySelectorAll('.portfolio-btn').forEach(button => {
        button.addEventListener('click', function() {
            const card = this.closest('.portfolio-card');
            if (!card || !modal) return;
            lastFocusedButton = this;
            if (modalTitle) modalTitle.textContent = card.dataset.title || 'Project Details';
            if (modalDescription) modalDescription.textContent = card.dataset.description || '';
            const highlights = (card.dataset.highlights || '').split('|');
            if (modalHighlights) {
                modalHighlights.innerHTML = highlights
                    .filter(Boolean)
                    .map(item => `<li>${item}</li>`)
                    .join('');
            }
            openModal(modal);
        });
    });

    if (modalClose) modalClose.addEventListener('click', () => closeModal(modal));
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) closeModal(modal);
        });
    }

    // Resume modal
    const previewResumeBtn = document.getElementById('previewResume');
    if (previewResumeBtn) {
        previewResumeBtn.addEventListener('click', function() {
            lastFocusedButton = this;
            openModal(resumeModal);
        });
    }
    if (resumeModalClose) resumeModalClose.addEventListener('click', () => closeModal(resumeModal));

    // Help modal
    function toggleHelpModal() {
        if (!helpModal) return;
        const isOpen = helpModal.classList.contains('active');
        if (isOpen) {
            closeModal(helpModal, false);
        } else {
            // Remember what had focus so it can be restored after closing (a11y fix for the ? shortcut)
            if (document.activeElement && document.activeElement !== document.body) {
                lastFocusedButton = document.activeElement;
            }
            openModal(helpModal);
        }
    }
    if (helpModalClose) helpModalClose.addEventListener('click', () => closeModal(helpModal, false));

    // Backdrop click for all modals
    document.querySelectorAll('.modal, .resume-modal').forEach(m => {
        m.addEventListener('click', function(e) {
            if (e.target === m) closeModal(m, m !== helpModal);
        });
    });

    // Focus trap for all open modals
    function setupFocusTrap(m) {
        m.addEventListener('keydown', function(e) {
            if (e.key !== 'Tab') return;
            const focusable = Array.from(m.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'))
                .filter(el => !el.hasAttribute('disabled'));
            if (!focusable.length) return;
            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            if (e.shiftKey) {
                if (document.activeElement === first || !m.contains(document.activeElement)) {
                    e.preventDefault();
                    last.focus();
                }
            } else {
                if (document.activeElement === last) {
                    e.preventDefault();
                    first.focus();
                }
            }
        });
    }
    if (modal) setupFocusTrap(modal);
    if (resumeModal) setupFocusTrap(resumeModal);
    if (helpModal) setupFocusTrap(helpModal);

    // ==========================================
    // 13. CONTACT FORM (Google Sheets + honeypot + real response)
    // ==========================================
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        const formFields = [
            document.getElementById('formName'),
            document.getElementById('formEmail'),
            document.getElementById('formMessage')
        ];
        let formFirstInteraction = null;

        formFields.forEach(field => {
            if (!field) return;
            field.addEventListener('input', function() {
                this.classList.toggle('invalid', this.value.trim() === '' && this.hasAttribute('required'));
            });
            field.addEventListener('focus', () => {
                if (formFirstInteraction === null) formFirstInteraction = Date.now();
            });
        });

        function isValidEmail(email) {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        }

        function showFormMessage(text, type) {
            const existingMsg = contactForm.querySelector('.form-message');
            if (existingMsg) existingMsg.remove();

            const msgDiv = document.createElement('div');
            msgDiv.className = `form-message form-message-${type}`;
            msgDiv.setAttribute('role', 'status');
            msgDiv.textContent = text;
            msgDiv.style.cssText = `
                padding: 12px 16px;
                border-radius: 8px;
                font-size: 0.9rem;
                font-weight: 500;
                background: ${type === 'success' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)'};
                color: ${type === 'success' ? '#10b981' : '#ef4444'};
                border: 1px solid ${type === 'success' ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'};
            `;
            contactForm.insertBefore(msgDiv, contactForm.querySelector('.btn-primary'));
            setTimeout(() => msgDiv.remove(), 6000);
        }

        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const websiteField = document.getElementById('formWebsite');
            const name = document.getElementById('formName')?.value.trim() || '';
            const email = document.getElementById('formEmail')?.value.trim() || '';
            const message = document.getElementById('formMessage')?.value.trim() || '';

            const submitBtn = contactForm.querySelector('.btn-primary');
            if (!submitBtn) return;

            // Validation
            [document.getElementById('formName'), document.getElementById('formEmail'), document.getElementById('formMessage')]
                .forEach(field => {
                    if (field) field.classList.toggle('invalid', !field.value.trim());
                });

            if (!name || !email || !message) {
                showFormMessage('Please fill in all required fields.', 'error');
                return;
            }
            if (!isValidEmail(email)) {
                document.getElementById('formEmail')?.classList.add('invalid');
                showFormMessage('Please enter a valid email address.', 'error');
                return;
            }

            // Honeypot + time-gate spam protection
            if (websiteField && websiteField.value.trim()) {
                // Silently pretend success - it's a bot
                contactForm.reset();
                return;
            }
            if (formFirstInteraction !== null && (Date.now() - formFirstInteraction) < 2000) {
                showFormMessage('Your message seemed too quick. Please try again.', 'error');
                return;
            }

            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;

            try {
                const formData = new URLSearchParams();
                formData.append('name', name);
                formData.append('email', email);
                formData.append('message', message);

                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    mode: 'cors',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: formData.toString()
                });

                const data = await response.json();
                if (data && data.result === 'success') {
                    showFormMessage('Thank you! Your message has been sent successfully. I will get back to you soon.', 'success');
                    contactForm.reset();
                    formFields.forEach(field => field && field.classList.remove('invalid'));
                } else {
                    showFormMessage('There was an issue saving your message. Please try again.', 'error');
                }
            } catch (error) {
                showFormMessage('Unable to send your message right now. Please try again later.', 'error');
            } finally {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        });
    }

    // `#downloadResume` uses a native `download` attribute + `target="_blank"`
    // so it needs no JavaScript interception (fixes duplicate empty listener M4).

    // ==========================================
    // 14. PORTFOLIO FILTERING (feature F1)
    // ==========================================
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioCards = document.querySelectorAll('.portfolio-card');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            filterButtons.forEach(b => {
                b.classList.remove('active');
                b.setAttribute('aria-pressed', 'false');
            });
            this.classList.add('active');
            this.setAttribute('aria-pressed', 'true');
            const filter = this.getAttribute('data-filter');
            portfolioCards.forEach(card => {
                const tag = (card.querySelector('.portfolio-tag')?.textContent || '').toLowerCase();
                const show = filter === 'all' || tag === filter;
                card.classList.toggle('portfolio-hidden', !show);
                if (show) {
                    card.style.display = '';
                    // Re-trigger animation
                    card.classList.remove('animate-in');
                    void card.offsetWidth;
                    card.classList.add('animate-in');
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // ==========================================
    // 16. 3D TILT EFFECT
    // ==========================================
    const tiltCards = document.querySelectorAll('.skill-category, .cert-card, .education-card, .portfolio-card, .stat');
    if (!reduceMotion && !isTouchDevice) {
        tiltCards.forEach(card => {
            card.addEventListener('mousemove', function(e) {
                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = (y - centerY) / centerY * -8;
                const rotateY = (x - centerX) / centerX * 8;
                this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
            });
            card.addEventListener('mouseleave', function() {
                this.style.transform = '';
            });
        });
    }

    // ==========================================
    // 17. BUTTON RIPPLE EFFECT
    // ==========================================
    const rippleButtons = document.querySelectorAll('.btn, .portfolio-btn, .theme-btn, .filter-btn');
    if (!reduceMotion) {
        rippleButtons.forEach(btn => {
            btn.addEventListener('click', function(e) {
                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const ripple = document.createElement('span');
                ripple.className = 'ripple-effect';
                ripple.style.left = x + 'px';
                ripple.style.top = y + 'px';
                ripple.style.width = '20px';
                ripple.style.height = '20px';
                this.appendChild(ripple);
                setTimeout(() => ripple.remove(), 650);
            });
        });
    }

    // ==========================================
    // 18. FLOATING PARTICLES IN HERO
    // ==========================================
    const heroSection = document.getElementById('home');
    if (heroSection && !reduceMotion && !isTouchDevice && window.innerWidth > 768) {
        for (let i = 0; i < 5; i++) {
            const particle = document.createElement('div');
            particle.className = 'floating-particle';
            const size = Math.random() * 4 + 3;
            particle.style.width = size + 'px';
            particle.style.height = size + 'px';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDuration = (Math.random() * 15 + 10) + 's';
            particle.style.animationDelay = (Math.random() * 10) + 's';
            particle.style.opacity = Math.random() * 0.1 + 0.05;
            heroSection.appendChild(particle);
        }
    }

    // ==========================================
    // 19. HERO MOUSE PARALLAX
    // ==========================================
    const heroContentEl = document.querySelector('.hero-content');
    if (heroAvatar && heroContentEl && !reduceMotion && !isTouchDevice && isFinePointer) {
        heroContentEl.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            // float animation now uses the `translate` property, so `transform` is free for JS
            heroAvatar.style.transform = `translateX(${x * 15}px) translateY(${y * 15}px)`;
        });
        heroContentEl.addEventListener('mouseleave', function() {
            heroAvatar.style.transform = '';
        });
    }

    // ==========================================
    // 20. SOLO LEVELING - SYSTEM MESSAGE ON LOAD
    // ==========================================
    if (!reduceMotion) {
        setTimeout(() => {
            const msgs = [
                'SYSTEM: Profile Loaded Successfully',
                'SYSTEM: New Skills Unlocked',
                'SYSTEM: Stats Initialized',
                'SYSTEM: Ready for Deployment'
            ];
            const msg = document.createElement('div');
            msg.className = 'solo-system-msg';
            msg.setAttribute('role', 'status');
            msg.textContent = msgs[Math.floor(Math.random() * msgs.length)];
            document.body.appendChild(msg);
            setTimeout(() => msg.remove(), 3600);
        }, 1500);
    }

    // ==========================================
    // 21. SOLO LEVELING - ARISE / BORDER
    // ==========================================
    const ariseObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('solo-arise');
                ariseObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    document.querySelectorAll('.timeline-item, .cert-card, .education-card, .portfolio-card').forEach(el => {
        ariseObserver.observe(el);
    });

    document.querySelectorAll('.cert-card').forEach(el => {
        el.classList.add('solo-border');
    });

    // ==========================================
    // 22. KEYBOARD SHORTCUTS
    // ==========================================
    document.addEventListener('keydown', function(e) {
        const target = e.target;
        const isTyping = target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable);
        if (isTyping) return;

        if (e.key === 'Escape') {
            if (document.querySelector('.modal.active, .resume-modal.active')) {
                closeAllModals();
            } else {
                closeMobileMenu();
            }
            return;
        }

        if (e.key === '?' || (e.key === '/' && e.shiftKey)) {
            e.preventDefault();
            toggleHelpModal();
            return;
        }

        const key = e.key.toLowerCase();
        if (key === 't') {
            themeToggle && themeToggle.click();
            e.preventDefault();
        } else if (key === 'b') {
            window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
            e.preventDefault();
        }
    });

    // ==========================================
    // 23. SECTION OBSERVER (fluid add: `.animate-in`)
    // ==========================================
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, { threshold: 0.1 });
    document.querySelectorAll('.section').forEach(section => sectionObserver.observe(section));

    // ==========================================
    // 24. CUSTOM ANIMATED CURSOR (Solo Leveling theme)
    // ==========================================
    const cursorDot = document.getElementById('cursorDot');
    const cursorRing = document.getElementById('cursorRing');

    if (cursorDot && cursorRing && !reduceMotion && window.matchMedia('(pointer: fine)').matches) {
        document.documentElement.classList.add('custom-cursor');

        const INTERACTIVE_SELECTOR = 'a, button, input, textarea, select, label, .portfolio-card, .skill-category, .cert-card, .education-card, .stat, .filter-btn, .back-to-top, .copy-email-btn, .modal-close, .resume-modal-close, .theme-btn, .hamburger, .timeline-content, .highlight-card, .portfolio-tag, .hero-badge';

        let mouseX = -100;
        let mouseY = -100;
        let ringX = -100;
        let ringY = -100;
        let isHover = false;
        let isPressed = false;
        let isVisible = false;

        function positionCursor(el, x, y, scale) {
            el.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) scale(${scale})`;
        }

        function tickCursor() {
            // Smooth trailing lerp for the ring (the dot follows instantly)
            ringX += (mouseX - ringX) * 0.2;
            ringY += (mouseY - ringY) * 0.2;

            let dotScale = 1;
            let ringScale = 1;
            if (isPressed) {
                dotScale = 1.9;
                ringScale = 0.72;
            } else if (isHover) {
                dotScale = 0.55;
            }

            positionCursor(cursorDot, mouseX, mouseY, dotScale);
            positionCursor(cursorRing, ringX, ringY, ringScale);

            requestAnimationFrame(tickCursor);
        }

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            if (!isVisible) {
                isVisible = true;
                cursorDot.classList.add('cursor-visible');
                cursorRing.classList.add('cursor-visible');
            }
        });

        document.addEventListener('mouseover', (e) => {
            const target = e.target;
            isHover = target && target.closest ? Boolean(target.closest(INTERACTIVE_SELECTOR)) : false;
            cursorDot.classList.toggle('cursor-hover', isHover);
            cursorRing.classList.toggle('cursor-hover', isHover);
        });

        document.addEventListener('mousedown', () => {
            isPressed = true;
            cursorDot.classList.add('cursor-pressed');
            cursorRing.classList.add('cursor-pressed');
        });
        window.addEventListener('mouseup', () => {
            isPressed = false;
            cursorDot.classList.remove('cursor-pressed');
            cursorRing.classList.remove('cursor-pressed');
        });

        document.addEventListener('mouseleave', () => {
            isVisible = false;
            cursorDot.classList.remove('cursor-visible');
            cursorRing.classList.remove('cursor-visible');
        });
        document.addEventListener('mouseenter', () => {
            isVisible = true;
            cursorDot.classList.add('cursor-visible');
            cursorRing.classList.add('cursor-visible');
        });

        tickCursor();
    }

    console.log('⚡ Resume Portfolio - Solo Leveling Mode Active! 🚀');
});

