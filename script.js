/* ===== Resume Portfolio - Main Script ===== */

// Hide typing cursor initially to prevent flash
document.addEventListener('DOMContentLoaded', function() {
    const cursor = document.querySelector('.typed-cursor');
    if (cursor) cursor.style.opacity = '0';
});

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    'use strict';

// ==========================================
    // 0. DISABLE RIGHT CLICK & TEXT SELECTION
    // ==========================================
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        return false;
    });

    document.addEventListener('selectstart', function(e) {
        // Allow text selection inside form inputs
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
        e.preventDefault();
        return false;
    });

    document.addEventListener('dragstart', function(e) {
        e.preventDefault();
        return false;
    });

    document.addEventListener('copy', function(e) {
        // Allow copy for email copy button
        if (e.target.closest('#copyEmail') || e.target.closest('.copy-email-btn')) return;
        e.preventDefault();
        return false;
    });

    // Also prevent middle-click paste attempts
    document.addEventListener('mousedown', function(e) {
        if (e.button === 1 || e.button === 2) {
            e.preventDefault();
            return false;
        }
    });

    // Ensure download resume still works
    const downloadResumeBtn = document.getElementById('downloadResume');
    if (downloadResumeBtn) {
        downloadResumeBtn.addEventListener('click', function(e) {
            // Let the native download behavior work
        });
    }

    // ==========================================
    // 0. PARTICLE NETWORK CANVAS
    // ==========================================
    (function initParticleNetwork() {
        const canvas = document.getElementById('particleCanvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let particles = [];
        let mouseX = 0, mouseY = 0;
        let isDark = document.documentElement.getAttribute('data-theme') === 'dark';

        function resize() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }

        resize();
        window.addEventListener('resize', resize);

        const PARTICLE_COUNT = 55;
        const CONNECTION_DIST = 140;
        const MOUSE_DIST = 200;

        class Particle {
            constructor() {
                this.reset();
            }
            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                this.radius = Math.random() * 2.5 + 1;
            }
            update() {
                this.x += this.vx;
                this.y += this.vy;

                if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
                if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

                // Mouse interaction
                const dx = this.x - mouseX;
                const dy = this.y - mouseY;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < MOUSE_DIST) {
                    const force = (MOUSE_DIST - dist) / MOUSE_DIST;
                    this.vx += (dx / dist) * force * 0.02;
                    this.vy += (dy / dist) * force * 0.02;
                    // Limit velocity
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

        for (let i = 0; i < PARTICLE_COUNT; i++) {
            particles.push(new Particle());
        }

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

            particles.forEach(p => {
                p.update();
                p.draw();
            });
            drawConnections();
            requestAnimationFrame(animate);
        }

        animate();

        // Pause animation when tab is not visible (improves battery life)
        let animFrameId = 0;
        function handleVisibilityChange() {
            if (document.hidden) {
                cancelAnimationFrame(animFrameId);
            } else {
                animate();
            }
        }
        document.addEventListener('visibilitychange', handleVisibilityChange);

        // Track mouse for particle interaction
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        // Update theme when changed
        const observer = new MutationObserver(() => {
            isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        });
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    })();

    // ==========================================
    // 1. DARK / LIGHT MODE TOGGLE
    // ==========================================
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = themeToggle?.querySelector('i');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedTheme = localStorage.getItem('theme');
    const activeTheme = savedTheme || (prefersDark ? 'dark' : 'light');

    if (themeToggle) {
        document.documentElement.setAttribute('data-theme', activeTheme);
        if (themeIcon) {
            themeIcon.className = activeTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }

        themeToggle.addEventListener('click', function() {
            const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            if (themeIcon) {
                themeIcon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
            }
        });
    }

    // ==========================================
    // 1a. SET COPYRIGHT YEAR
    // ==========================================
    const yearElement = document.getElementById('currentYear');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

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

    // Show cursor after initialization
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

    updateTypedRole();

// ==========================================
    // 1b. DYNAMIC STATUS BADGE CYCLING
    // ==========================================
    const statusBadge = document.querySelector('.hero-avatar-badge');
    if (statusBadge) {
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

        // Cycle every 4 seconds
        setInterval(cycleStatusBadge, 4000);

        // Add smooth transition for the badge
        statusBadge.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    }

    const heroAvatar = document.querySelector('.hero-avatar');
    function createSoloBurst(x, y) {
        const burst = document.createElement('div');
        burst.className = 'solo-shadow-particle';
        burst.style.left = `${x}px`;
        burst.style.top = `${y}px`;
        burst.style.setProperty('--burst-x', `${(Math.random() - 0.5) * 80}px`);
        burst.style.setProperty('--burst-y', `${(Math.random() - 0.5) * 80}px`);
        document.body.appendChild(burst);
        setTimeout(() => burst.remove(), 1200);
    }

    if (heroAvatar) {
        heroAvatar.addEventListener('click', (event) => {
            createSoloBurst(event.clientX, event.clientY);
        });
    }

    const animatedElements = document.querySelectorAll('.about-text, .stat, .timeline-item, .skill-category, .education-card, .portfolio-card, .contact-item, .contact-form, .section-title, .section-divider');

    animatedElements.forEach((element, index) => {
        element.classList.add('animate-on-scroll');
        element.style.transitionDelay = `${index * 70}ms`;
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

    const copyEmailBtn = document.getElementById('copyEmail');
    if (copyEmailBtn) {
        copyEmailBtn.addEventListener('click', function() {
            copyTextToClipboard('Dileep Kumar Bardhan@email.com');
        });
    }

    function copyTextToClipboard(text) {
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(text).then(() => {
                showToast('Email copied to clipboard!');
            }).catch(() => {
                showToast('Unable to copy email automatically.');
            });
        } else {
            const textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.style.position = 'fixed';
            textarea.style.left = '-9999px';
            document.body.appendChild(textarea);
            textarea.focus();
            textarea.select();
            try {
                document.execCommand('copy');
                showToast('Email copied to clipboard!');
            } catch (err) {
                showToast('Unable to copy email automatically.');
            }
            textarea.remove();
        }
    }

    function showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'toast-message';
        toast.textContent = message;
        document.body.appendChild(toast);
        requestAnimationFrame(() => toast.classList.add('show'));

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 220);
        }, 2600);
    }

    // ==========================================
    // 2. MOBILE HAMBURGER MENU
    // ==========================================
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', function() {
            this.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }

    // ==========================================
    // 3. NAVBAR SCROLL EFFECT
    // ==========================================
    const navbar = document.getElementById('navbar');
    const backToTop = document.getElementById('backToTop');

    window.addEventListener('scroll', function() {
        if (navbar) {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }

        if (backToTop) {
            if (window.scrollY > 500) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        }

        updateActiveNavLink();
    });

    // ==========================================
    // 4. ACTIVE NAV LINK HIGHLIGHT
    // ==========================================
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const navLinkAnchors = document.querySelectorAll('.nav-links a');
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 150;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navLinkAnchors.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
        });
    }

    // ==========================================
    // 5. SKILL BARS ANIMATION ON SCROLL
    // ==========================================
    const skillBars = document.querySelectorAll('.skill-progress');
    let skillAnimated = false;

    function animateSkillBars() {
        if (skillAnimated) return;

        const triggerPoint = window.innerHeight * 0.85;
        const skillsSection = document.getElementById('skills');

        if (skillsSection) {
            const sectionTop = skillsSection.getBoundingClientRect().top;

            if (sectionTop < triggerPoint) {
                skillBars.forEach(bar => {
                    const progress = bar.getAttribute('data-progress');
                    bar.style.width = progress + '%';
                });
                skillAnimated = true;
            }
        }
    }

    window.addEventListener('load', animateSkillBars);
    window.addEventListener('scroll', animateSkillBars);

    // ==========================================
    // 6. SMOOTH SCROLL FOR NAV LINKS (fallback)
    // ==========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    if (backToTop) {
        backToTop.addEventListener('click', function() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ==========================================
    // 7. PROJECT MODAL
    // ==========================================
    const modal = document.getElementById('projectModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalDescription = document.getElementById('modalDescription');
    const modalHighlights = document.getElementById('modalHighlights');
    const modalClose = document.getElementById('modalClose');

    document.querySelectorAll('.portfolio-btn').forEach(button => {
        button.addEventListener('click', function() {
            const card = this.closest('.portfolio-card');
            if (!card || !modal) return;

            if (modalTitle) modalTitle.textContent = card.dataset.title || 'Project Details';
            if (modalDescription) modalDescription.textContent = card.dataset.description || '';

            const highlights = (card.dataset.highlights || '').split('|');
            if (modalHighlights) {
                modalHighlights.innerHTML = highlights
                    .filter(Boolean)
                    .map(item => `<li>${item}</li>`)
                    .join('');
            }

            modal.classList.add('active');
            modal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
        });
    });

    let lastFocusedButton = null;

    function closeModal() {
        if (!modal) return;
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        // Restore focus to the button that opened the modal
        if (lastFocusedButton) lastFocusedButton.focus();
    }

    const focusableElements = modal ? Array.from(modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')) : [];
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }

    if (modal) {
        // Focus trap
        modal.addEventListener('keydown', function(e) {
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === firstFocusable) {
                        e.preventDefault();
                        if (lastFocusable) lastFocusable.focus();
                    }
                } else {
                    if (document.activeElement === lastFocusable) {
                        e.preventDefault();
                        if (firstFocusable) firstFocusable.focus();
                    }
                }
            }
            if (e.key === 'Escape') {
                closeModal();
            }
        });

        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal();
            }
        });

        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeModal();
            }
        });
    }

    // Store last focused button when modal opens
    document.querySelectorAll('.portfolio-btn').forEach(function(button) {
        button.addEventListener('click', function() {
            lastFocusedButton = this;
        });
    });

    // ==========================================
    // 8. CONTACT FORM HANDLING - Google Sheets Integration
    // ==========================================
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        const formFields = [
            document.getElementById('formName'),
            document.getElementById('formEmail'),
            document.getElementById('formMessage')
        ];

        formFields.forEach(field => {
            if (!field) return;
            field.addEventListener('input', function() {
                this.classList.toggle('invalid', this.value.trim() === '' && this.hasAttribute('required'));
            });
        });

        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const name = document.getElementById('formName')?.value.trim() || '';
            const email = document.getElementById('formEmail')?.value.trim() || '';
            const message = document.getElementById('formMessage')?.value.trim() || '';
            const nameField = document.getElementById('formName');
            const emailField = document.getElementById('formEmail');
            const messageField = document.getElementById('formMessage');

            [nameField, emailField, messageField].forEach(field => {
                if (field) {
                    field.classList.toggle('invalid', !field.value.trim());
                }
            });

            if (!name || !email || !message) {
                showFormMessage('Please fill in all required fields.', 'error');
                return;
            }

            if (!isValidEmail(email)) {
                emailField?.classList.add('invalid');
                showFormMessage('Please enter a valid email address.', 'error');
                return;
            }

            const submitBtn = contactForm.querySelector('.btn-primary');
            if (!submitBtn) return;

            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;

            try {
                // Send data to Google Sheets via Google Apps Script web app
                const formData = new URLSearchParams();
                formData.append('name', name);
                formData.append('email', email);
                formData.append('message', message);

                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    mode: 'no-cors', // Required for Google Apps Script CORS handling
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: formData.toString()
                });

                // With no-cors mode, we can't read response status directly
                // Assume success if no network error occurred
                showFormMessage('Thank you! Your message has been sent successfully. I will get back to you soon.', 'success');
                contactForm.reset();
                formFields.forEach(field => field?.classList.remove('invalid'));
            } catch (error) {
                showFormMessage('Unable to send your message right now. Please try again later.', 'error');
            } finally {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        });
    }

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function showFormMessage(text, type) {
        if (!contactForm) return;

        const existingMsg = contactForm.querySelector('.form-message');
        if (existingMsg) {
            existingMsg.remove();
        }

        const msgDiv = document.createElement('div');
        msgDiv.className = `form-message form-message-${type}`;
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

        // Auto remove after 5 seconds
        setTimeout(() => {
            msgDiv.remove();
        }, 5000);
    }

    // ==========================================
    // 9. RESUME PREVIEW MODAL
    // ==========================================
    const previewResumeBtn = document.getElementById('previewResume');
    const resumeModal = document.getElementById('resumeModal');
    const resumeModalClose = document.getElementById('resumeModalClose');

    function openResumeModal() {
        if (!resumeModal) return;
        resumeModal.classList.add('active');
        resumeModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeResumeModal() {
        if (!resumeModal) return;
        resumeModal.classList.remove('active');
        resumeModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    if (previewResumeBtn) {
        previewResumeBtn.addEventListener('click', openResumeModal);
    }

    if (resumeModalClose) {
        resumeModalClose.addEventListener('click', closeResumeModal);
    }

    if (resumeModal) {
        resumeModal.addEventListener('click', function(e) {
            if (e.target === resumeModal) {
                closeResumeModal();
            }
        });
    }

    const downloadBtn = document.getElementById('downloadResume');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', function(e) {
            // Let the native download behavior work - don't intercept
            // The HTML `download` attribute and `href` handle it properly
        });
    }

    // ==========================================
    // 10. INTERSECTION OBSERVER FOR ANIMATIONS
    // ==========================================
    function observeSections() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, { threshold: 0.1 });

        // Observe sections
        document.querySelectorAll('.section').forEach(section => {
            observer.observe(section);
        });

        // Observe timeline items
        document.querySelectorAll('.timeline-item').forEach((item, index) => {
            item.style.animationDelay = `${index * 0.2}s`;
            observer.observe(item);
        });

        // Observe portfolio cards
        document.querySelectorAll('.portfolio-card').forEach((card, index) => {
            card.style.animationDelay = `${index * 0.15}s`;
            observer.observe(card);
        });

        // Observe education cards
        document.querySelectorAll('.education-card').forEach((card, index) => {
            card.style.animationDelay = `${index * 0.15}s`;
            observer.observe(card);
        });
    }

    observeSections();

    // ==========================================
    // 11. KEYBOARD ACCESSIBILITY
    // ==========================================
    document.addEventListener('keydown', function(e) {
        // Escape key closes mobile menu
        if (e.key === 'Escape' && navLinks.classList.contains('active')) {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        }
    });

    // ==========================================
    // 12. SCROLL PROGRESS BAR
    // ==========================================
    const scrollProgress = document.getElementById('scrollProgress');
    if (scrollProgress) {
        window.addEventListener('scroll', function() {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;
            scrollProgress.style.width = scrollPercent + '%';
        });
    }

    // ==========================================
    // 13. 3D TILT EFFECT ON CARDS
    // ==========================================
    const tiltCards = document.querySelectorAll('.skill-category, .cert-card, .education-card, .portfolio-card, .stat');
    
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

    // ==========================================
    // 14. BUTTON RIPPLE EFFECT
    // ==========================================
    const rippleButtons = document.querySelectorAll('.btn, .portfolio-btn, .theme-btn, .filter-btn');
    
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
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    // ==========================================
    // 15. ANIMATED STAT COUNTERS
    // ==========================================
    const statNumbers = document.querySelectorAll('.stat-number');
    let countersAnimated = false;
    
    function animateCounters() {
        if (countersAnimated) return;
        
        const triggerPoint = window.innerHeight * 0.85;
        const aboutSection = document.getElementById('about');
        
        if (aboutSection) {
            const sectionTop = aboutSection.getBoundingClientRect().top;
            
            if (sectionTop < triggerPoint) {
                statNumbers.forEach(stat => {
                    const text = stat.textContent.trim();
                    const suffix = text.includes('+') ? '+' : '';
                    const targetValue = parseInt(text.replace(/[^0-9]/g, ''));
                    
                    if (!isNaN(targetValue)) {
                        const duration = 2000;
                        const startTime = performance.now();
                        
                        function updateCounter(currentTime) {
                            const elapsed = currentTime - startTime;
                            const progress = Math.min(elapsed / duration, 1);
                            // Ease-out cubic
                            const easeOut = 1 - Math.pow(1 - progress, 3);
                            const currentValue = Math.floor(easeOut * targetValue);
                            stat.textContent = currentValue + suffix;
                            
                            if (progress < 1) {
                                requestAnimationFrame(updateCounter);
                            }
                        }
                        
                        requestAnimationFrame(updateCounter);
                    }
                });
                countersAnimated = true;
            }
        }
    }
    
    window.addEventListener('load', animateCounters);
    window.addEventListener('scroll', animateCounters);

    // ==========================================
    // 16. FLOATING PARTICLES IN HERO
    // ==========================================
    const heroSection = document.getElementById('home');
    if (heroSection) {
        for (let i = 0; i < 8; i++) {
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
    // 17. HERO MOUSE PARALLAX
    // ==========================================
    const heroAvatarEl = document.querySelector('.hero-avatar');
    const heroContentEl = document.querySelector('.hero-content');
    
    if (heroAvatarEl && heroContentEl) {
        heroContentEl.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            
            heroAvatarEl.style.transform = `translateX(${x * 15}px) translateY(${y * 15}px)`;
        });
        
        heroContentEl.addEventListener('mouseleave', function() {
            heroAvatarEl.style.transform = '';
        });
    }

    // ==========================================
    // 18. SOLO LEVELING - SHADOW PARTICLES ON SCROLL
    // ==========================================
    let shadowParticleTimer = null;
    window.addEventListener('scroll', function() {
        if (shadowParticleTimer) clearTimeout(shadowParticleTimer);
        shadowParticleTimer = setTimeout(() => {
            // Create shadow particles occasionally
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
                setTimeout(() => particle.remove(), 5000);
            }
        }, 200);
    });

    // ==========================================
    // 19. SOLO LEVELING - SYSTEM MESSAGE ON LOAD
    // ==========================================
    setTimeout(() => {
        const msgs = [
            'SYSTEM: Profile Loaded Successfully',
            'SYSTEM: New Skills Unlocked',
            'SYSTEM: Stats Initialized',
            'SYSTEM: Ready for Deployment'
        ];
        const msg = document.createElement('div');
        msg.className = 'solo-system-msg';
        msg.textContent = msgs[Math.floor(Math.random() * msgs.length)];
        document.body.appendChild(msg);
        setTimeout(() => msg.remove(), 3500);
    }, 1500);

    // ==========================================
    // 20. SOLO LEVELING - POWER PULSE ON STAT COUNTERS
    // ==========================================
    // Enhanced counter animation with power pulse
    const originalAnimateCounters = animateCounters;
    animateCounters = function() {
        if (countersAnimated) return;
        
        const triggerPoint = window.innerHeight * 0.85;
        const aboutSection = document.getElementById('about');
        
        if (aboutSection) {
            const sectionTop = aboutSection.getBoundingClientRect().top;
            
            if (sectionTop < triggerPoint) {
                statNumbers.forEach((stat, index) => {
                    const text = stat.textContent.trim();
                    const suffix = text.includes('+') ? '+' : '';
                    const targetValue = parseInt(text.replace(/[^0-9]/g, ''));
                    
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
                            // Ease-out cubic
                            const easeOut = 1 - Math.pow(1 - progress, 3);
                            const currentValue = Math.floor(easeOut * targetValue);
                            stat.textContent = currentValue + suffix;
                            
                            if (progress < 1) {
                                requestAnimationFrame(updateCounter);
                            } else {
                                // Add power pulse effect on completion
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
    };
    
    // Re-trigger counter animation
    window.addEventListener('scroll', animateCounters);
    setTimeout(animateCounters, 500);

    // ==========================================
    // 21. SOLO LEVELING - ADD ARISE CLASS TO SECTIONS
    // ==========================================
    // Add solo-arise to timeline items when they become visible
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

    // Add solo-gate/purple border to certification cards
    document.querySelectorAll('.cert-card').forEach(el => {
        el.classList.add('solo-border');
    });

    console.log('⚡ Resume Portfolio - Solo Leveling Mode Active! 🚀');
});

