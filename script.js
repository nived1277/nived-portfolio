/* ==========================================================================
   NIVED SUNIL PORTFOLIO — INTERACTIVE JAVASCRIPT CONTROLLER
   ========================================================================== */

function initApp() {
    
    /* ----------------------------------------------------------------------
       0. THEME TOGGLE CONTROLLER
       ---------------------------------------------------------------------- */
    const themeToggleBtn = document.getElementById("themeToggleBtn");
    const savedTheme = localStorage.getItem("portfolio-theme");

    if (savedTheme === "light") {
        document.documentElement.setAttribute("data-theme", "light");
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener("click", () => {
            const isLight = document.documentElement.getAttribute("data-theme") === "light";
            if (isLight) {
                document.documentElement.removeAttribute("data-theme");
                localStorage.setItem("portfolio-theme", "dark");
            } else {
                document.documentElement.setAttribute("data-theme", "light");
                localStorage.setItem("portfolio-theme", "light");
            }
        });
    }

    /* ----------------------------------------------------------------------
       0.1 MOBILE NAVIGATION MENU CONTROLLER
       ---------------------------------------------------------------------- */
    const mobileMenuBtn = document.getElementById("mobileMenuBtn");
    const navLinksContainer = document.getElementById("navLinks");
    const navOverlay = document.getElementById("navOverlay");

    function openMobileMenu() {
        if (!mobileMenuBtn || !navLinksContainer) return;
        mobileMenuBtn.classList.add("open");
        mobileMenuBtn.setAttribute("aria-expanded", "true");
        navLinksContainer.classList.add("mobile-open");
        if (navOverlay) navOverlay.classList.add("active");
        if (!document.body.classList.contains("intro-active")) {
            document.body.style.overflow = "hidden";
        }
    }

    function closeMobileMenu() {
        if (!mobileMenuBtn || !navLinksContainer) return;
        mobileMenuBtn.classList.remove("open");
        mobileMenuBtn.setAttribute("aria-expanded", "false");
        navLinksContainer.classList.remove("mobile-open");
        if (navOverlay) navOverlay.classList.remove("active");
        if (!document.body.classList.contains("intro-active")) {
            document.body.style.overflow = "";
        }
    }

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            const isOpen = navLinksContainer.classList.contains("mobile-open");
            if (isOpen) {
                closeMobileMenu();
            } else {
                openMobileMenu();
            }
        });
    }

    if (navOverlay) {
        navOverlay.addEventListener("click", closeMobileMenu);
    }

    if (navLinksContainer) {
        const links = navLinksContainer.querySelectorAll(".nav-link");
        links.forEach((link) => {
            link.addEventListener("click", () => {
                closeMobileMenu();
            });
        });
    }

    /* ----------------------------------------------------------------------
       1. HERO SUBTITLE TYPEWRITER EFFECT
       ---------------------------------------------------------------------- */
    const typingElement = document.getElementById("typing");
    const fullText = "Computer Science & Engineering Specialized in Artificial Intelligence & Machine Learning Graduate | Web Intern";
    let charIndex = 0;

    function typeWriter() {
        if (!typingElement) return;
        if (charIndex < fullText.length) {
            typingElement.textContent += fullText.charAt(charIndex);
            charIndex++;
            setTimeout(typeWriter, 22);
        }
    }

    if (typingElement) {
        typingElement.textContent = "";
        typeWriter();
    }

    /* ----------------------------------------------------------------------
       2. DYNAMIC AUTO-HIDING & HOVER-REVEALING NAVBAR
       ---------------------------------------------------------------------- */
    const navbar = document.getElementById("navbar");
    const heroSection = document.getElementById("hero");
    let isMouseNearTop = false;
    let hideTimer = null;

    function updateNavbarState() {
        if (!navbar || !heroSection) return;

        const heroRect = heroSection.getBoundingClientRect();
        const isPastHero = heroRect.bottom <= 200;

        if (!isPastHero) {
            navbar.classList.remove("hidden");
        } else {
            if (isMouseNearTop) {
                navbar.classList.remove("hidden");
            } else {
                navbar.classList.add("hidden");
            }
        }
    }

    window.addEventListener("scroll", updateNavbarState, { passive: true });

    document.addEventListener("mousemove", (e) => {
        if (!navbar) return;
        const isOverNavbar = navbar.contains(e.target);

        if (e.clientY <= 90 || isOverNavbar) {
            isMouseNearTop = true;
            clearTimeout(hideTimer);
            updateNavbarState();
        } else {
            if (isMouseNearTop) {
                isMouseNearTop = false;
                clearTimeout(hideTimer);
                hideTimer = setTimeout(updateNavbarState, 300);
            }
        }
    });

    document.addEventListener("mouseleave", () => {
        isMouseNearTop = false;
        updateNavbarState();
    });

    /* Active Link Scroll Observer */
    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll(".nav-link");

    function highlightActiveNav() {
        let currentScroll = window.scrollY + 250;

        sections.forEach((section) => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute("id");

            if (currentScroll >= sectionTop && currentScroll < sectionTop + sectionHeight) {
                navLinks.forEach((link) => {
                    link.classList.remove("active");
                    if (link.getAttribute("href") === `#${sectionId}`) {
                        link.classList.add("active");
                    }
                });
            }
        });
    }

    window.addEventListener("scroll", highlightActiveNav, { passive: true });

    /* ----------------------------------------------------------------------
       3. ABOUT ME THREE-PHOTO SCROLL CAROUSEL
       ---------------------------------------------------------------------- */
    const carouselContainer = id => document.getElementById(id);
    const photoCards = document.querySelectorAll(".carousel-container .photo-card");
    let activeCenterIndex = 1; // Start with center image (photo 2)

    function updatePhotoPositions() {
        if (!photoCards || photoCards.length === 0) return;

        photoCards.forEach((card, i) => {
            card.classList.remove("photo-left", "photo-center", "photo-right");

            if (i === activeCenterIndex) {
                card.classList.add("photo-center");
            } else if (i === (activeCenterIndex - 1 + photoCards.length) % photoCards.length) {
                card.classList.add("photo-left");
            } else {
                card.classList.add("photo-right");
            }
        });
    }

    // Scroll-driven photo carousel progression
    const aboutSection = document.getElementById("about");
    let lastScrollY = window.scrollY;

    function handleAboutScroll() {
        if (!aboutSection) return;
        const rect = aboutSection.getBoundingClientRect();
        const viewportHeight = window.innerHeight;

        // If about section is in view
        if (rect.top < viewportHeight && rect.bottom > 0) {
            const progress = (viewportHeight - rect.top) / (viewportHeight + rect.height);
            
            if (progress > 0.65 && activeCenterIndex !== 2) {
                activeCenterIndex = 2;
                updatePhotoPositions();
            } else if (progress > 0.35 && progress <= 0.65 && activeCenterIndex !== 1) {
                activeCenterIndex = 1;
                updatePhotoPositions();
            } else if (progress <= 0.35 && activeCenterIndex !== 0) {
                activeCenterIndex = 0;
                updatePhotoPositions();
            }
        }
    }

    window.addEventListener("scroll", handleAboutScroll, { passive: true });

    // Allow clicking side photos to rotate
    photoCards.forEach((card, index) => {
        card.addEventListener("click", () => {
            activeCenterIndex = index;
            updatePhotoPositions();
        });
    });

    // Touch swipe support for photo carousel
    const photoCarouselElem = document.getElementById("photoCarousel");
    if (photoCarouselElem) {
        let photoTouchStartX = 0;
        photoCarouselElem.addEventListener("touchstart", (e) => {
            if (e.touches.length > 0) {
                photoTouchStartX = e.touches[0].clientX;
            }
        }, { passive: true });

        photoCarouselElem.addEventListener("touchend", (e) => {
            if (e.changedTouches.length > 0) {
                const photoTouchEndX = e.changedTouches[0].clientX;
                const diffX = photoTouchEndX - photoTouchStartX;
                if (diffX < -35) {
                    // Swipe Left -> next photo
                    activeCenterIndex = (activeCenterIndex + 1) % photoCards.length;
                    updatePhotoPositions();
                } else if (diffX > 35) {
                    // Swipe Right -> prev photo
                    activeCenterIndex = (activeCenterIndex - 1 + photoCards.length) % photoCards.length;
                    updatePhotoPositions();
                }
            }
        }, { passive: true });
    }

    updatePhotoPositions();

    /* ----------------------------------------------------------------------
       4. SEAMLESS INFINITE SKILLS MARQUEE DUPING
       ---------------------------------------------------------------------- */
    const marqueeTracks = document.querySelectorAll(".marquee-track");

    marqueeTracks.forEach((track) => {
        const group = track.querySelector(".marquee-group");
        if (group && track.children.length === 1) {
            // Clone group 1 time so each track has 2 identical sets for 100% seamless looping
            const clone = group.cloneNode(true);
            clone.setAttribute("aria-hidden", "true");
            track.appendChild(clone);
        }
    });

    /* ----------------------------------------------------------------------
       5. CINEMATIC PROJECT SCROLL SHOWCASE (3D Curved Parallax)
       ---------------------------------------------------------------------- */
    const projectCards = document.querySelectorAll(".project-card");

    function animateProjects() {
        const viewportCenter = window.innerHeight / 2;
        const halfHeight = window.innerHeight / 2;

        projectCards.forEach((card, idx) => {
            const rect = card.getBoundingClientRect();
            const cardCenter = rect.top + rect.height / 2;
            
            // Normalized distance from screen center (-1 to 1)
            let distance = (cardCenter - viewportCenter) / halfHeight;
            distance = Math.max(-1.2, Math.min(1.2, distance));

            const isEven = idx % 2 === 0;
            const sign = isEven ? 1 : -1;

            const scale = 1 - Math.min(0.08, Math.abs(distance) * 0.08);
            const opacity = 1 - Math.min(0.35, Math.abs(distance) * 0.35);
            const translateY = distance * -15;
            const rotateX = distance * -3;

            card.style.transform = `perspective(1000px) translateY(${translateY}px) rotateX(${rotateX}deg) scale(${scale})`;
            card.style.opacity = opacity;
        });

        requestAnimationFrame(animateProjects);
    }

    requestAnimationFrame(animateProjects);

    /* ----------------------------------------------------------------------
       6. PROJECT IMAGE SLIDER (FutureMe AI)
       ---------------------------------------------------------------------- */
    const sliderContainer = document.getElementById("futureMeSlider");

    if (sliderContainer) {
        const slides = sliderContainer.querySelectorAll(".slide");
        const prevBtn = sliderContainer.querySelector(".prev");
        const nextBtn = sliderContainer.querySelector(".next");
        const currentCounter = sliderContainer.querySelector(".current-slide");
        let slideIndex = 0;

        function renderSlide(index) {
            slides.forEach((s) => s.classList.remove("active"));
            slides[index].classList.add("active");
            if (currentCounter) {
                currentCounter.textContent = index + 1;
            }
        }

        if (nextBtn) {
            nextBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                slideIndex = (slideIndex + 1) % slides.length;
                renderSlide(slideIndex);
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                slideIndex = (slideIndex - 1 + slides.length) % slides.length;
                renderSlide(slideIndex);
            });
        }

        // Touch Swipe Gesture for Project Slider
        let sliderTouchStartX = 0;
        sliderContainer.addEventListener("touchstart", (e) => {
            if (e.touches.length > 0) {
                sliderTouchStartX = e.touches[0].clientX;
            }
        }, { passive: true });

        sliderContainer.addEventListener("touchend", (e) => {
            if (e.changedTouches.length > 0) {
                const sliderTouchEndX = e.changedTouches[0].clientX;
                const diffX = sliderTouchEndX - sliderTouchStartX;

                if (diffX < -35) {
                    // Swipe Left -> next slide
                    slideIndex = (slideIndex + 1) % slides.length;
                    renderSlide(slideIndex);
                } else if (diffX > 35) {
                    // Swipe Right -> prev slide
                    slideIndex = (slideIndex - 1 + slides.length) % slides.length;
                    renderSlide(slideIndex);
                }
            }
        }, { passive: true });
    }

    /* ----------------------------------------------------------------------
       7. SECTION REVEAL INTERSECTION OBSERVER
       ---------------------------------------------------------------------- */
    const revealElements = document.querySelectorAll(".reveal");

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("active");
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach((el) => revealObserver.observe(el));    /* ----------------------------------------------------------------------
       8. DEDICATED 3D GOTHIC HERO STAGE ENGINE (High-Performance Canvas 2D Engine)
       ---------------------------------------------------------------------- */
    function initHeroGothicStage() {
        const canvas = document.getElementById("gothic-stage-canvas");
        const container = document.getElementById("gothicStage");
        if (!canvas || !container) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        function getStageWidth() { return container.clientWidth || 800; }
        function getStageHeight() { return container.clientHeight || 380; }

        let stageW = getStageWidth();
        let stageH = getStageHeight();
        canvas.width = stageW;
        canvas.height = stageH;

        let mouseX = 0, mouseY = 0;
        let targetMouseX = 0, targetMouseY = 0;

        window.addEventListener("mousemove", (e) => {
            const rect = canvas.getBoundingClientRect();
            targetMouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
            targetMouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
        }, { passive: true });

        window.addEventListener("touchmove", (e) => {
            if (e.touches && e.touches.length > 0) {
                const rect = canvas.getBoundingClientRect();
                const touch = e.touches[0];
                targetMouseX = ((touch.clientX - rect.left) / rect.width - 0.5) * 2;
                targetMouseY = ((touch.clientY - rect.top) / rect.height - 0.5) * 2;
            }
        }, { passive: true });

        // Cloud objects
        const canvasClouds = [];
        for (let i = 0; i < 8; i++) {
            canvasClouds.push({
                x: Math.random() * 900,
                y: 15 + Math.random() * 120,
                r: 65 + Math.random() * 75,
                speed: 0.3 + Math.random() * 0.5,
                opacity: 0.35 + Math.random() * 0.4
            });
        }

        // Bat objects
        const canvasBats = [];
        for (let b = 0; b < 7; b++) {
            canvasBats.push({
                x: Math.random() * 900,
                y: 35 + Math.random() * 160,
                speedX: 1.8 + Math.random() * 2.4,
                speedY: (Math.random() - 0.5) * 0.9,
                scale: 0.75 + Math.random() * 0.65,
                wingAngle: Math.random() * Math.PI * 2
            });
        }

        let animTime = 0;

        function draw2DStage() {
            requestAnimationFrame(draw2DStage);
            animTime += 0.035;

            mouseX += (targetMouseX - mouseX) * 0.06;
            mouseY += (targetMouseY - mouseY) * 0.06;

            const newW = container.clientWidth || 800;
            const newH = container.clientHeight || 380;
            if (canvas.width !== newW) canvas.width = newW;
            if (canvas.height !== newH) canvas.height = newH;
            stageW = canvas.width;
            stageH = canvas.height;

            // 1. Background Atmosphere: Deep Black into Crimson Core
            const bgGrad = ctx.createRadialGradient(
                stageW * 0.38 + mouseX * 25, stageH * 0.35 + mouseY * 15, 20,
                stageW * 0.5, stageH * 0.5, stageW * 0.8
            );
            bgGrad.addColorStop(0, "#2d0309");
            bgGrad.addColorStop(0.35, "#140105");
            bgGrad.addColorStop(0.75, "#060002");
            bgGrad.addColorStop(1, "#020001");
            ctx.fillStyle = bgGrad;
            ctx.fillRect(0, 0, stageW, stageH);

            // 2. Large Glowing Crystal-Red Moon (Positioned Left-Center)
            const moonX = stageW * 0.30 + mouseX * 18;
            const moonY = stageH * 0.32 + mouseY * 12;
            const moonR = 56;

            // Outer Volumetric Crimson Glow Aura
            const moonOuterGlow = ctx.createRadialGradient(moonX, moonY, moonR * 0.2, moonX, moonY, moonR * 3.5);
            moonOuterGlow.addColorStop(0, "rgba(255, 30, 50, 0.75)");
            moonOuterGlow.addColorStop(0.35, "rgba(200, 0, 25, 0.4)");
            moonOuterGlow.addColorStop(0.7, "rgba(100, 0, 15, 0.15)");
            moonOuterGlow.addColorStop(1, "rgba(0, 0, 0, 0)");
            ctx.fillStyle = moonOuterGlow;
            ctx.beginPath();
            ctx.arc(moonX, moonY, moonR * 3.5, 0, Math.PI * 2);
            ctx.fill();

            // Moon Body with Crystal Red Texture Gradient
            const moonGrad = ctx.createRadialGradient(moonX - 15, moonY - 15, 6, moonX, moonY, moonR);
            moonGrad.addColorStop(0, "#ff7b8e");
            moonGrad.addColorStop(0.3, "#ff1a2a");
            moonGrad.addColorStop(0.65, "#b3000d");
            moonGrad.addColorStop(0.9, "#590005");
            moonGrad.addColorStop(1, "#260002");
            ctx.fillStyle = moonGrad;
            ctx.beginPath();
            ctx.arc(moonX, moonY, moonR, 0, Math.PI * 2);
            ctx.fill();

            // Moon Surface Craters/Crystals
            ctx.fillStyle = "rgba(255, 180, 190, 0.35)";
            ctx.beginPath();
            ctx.arc(moonX - 18, moonY - 10, 8, 0, Math.PI * 2);
            ctx.arc(moonX + 12, moonY + 18, 11, 0, Math.PI * 2);
            ctx.arc(moonX + 22, moonY - 14, 6, 0, Math.PI * 2);
            ctx.fill();

            // 3. Volumetric Dark-Red Drifting Clouds
            canvasClouds.forEach((c) => {
                c.x += c.speed;
                if (c.x - c.r > stageW + 50) c.x = -c.r - 20;

                const cx = c.x + mouseX * 28;
                const cy = c.y + mouseY * 14;

                const cGrad = ctx.createRadialGradient(cx, cy, 8, cx, cy, c.r);
                cGrad.addColorStop(0, `rgba(185, 12, 32, ${c.opacity})`);
                cGrad.addColorStop(0.5, `rgba(90, 4, 16, ${c.opacity * 0.55})`);
                cGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
                ctx.fillStyle = cGrad;
                ctx.beginPath();
                ctx.arc(cx, cy, c.r, 0, Math.PI * 2);
                ctx.fill();
            });

            // 4. Distant Red Gothic Mansion (Positioned Right Side)
            const mX = stageW * 0.72 + mouseX * 32;
            const mY = stageH * 0.54 + mouseY * 20;

            // Mansion Base Structure & Towers
            ctx.fillStyle = "#0c0205";
            // Central Citadel Body
            ctx.fillRect(mX - 40, mY - 50, 80, 75);
            // Main Roof Triangular Spire
            ctx.beginPath();
            ctx.moveTo(mX - 46, mY - 50);
            ctx.lineTo(mX, mY - 115);
            ctx.lineTo(mX + 46, mY - 50);
            ctx.fill();

            // Left Spire Tower
            ctx.fillRect(mX - 80, mY - 35, 35, 90);
            ctx.beginPath();
            ctx.moveTo(mX - 86, mY - 35);
            ctx.lineTo(mX - 62, mY - 88);
            ctx.lineTo(mX - 38, mY - 35);
            ctx.fill();

            // Right Spire Tower
            ctx.fillRect(mX + 45, mY - 35, 35, 90);
            ctx.beginPath();
            ctx.moveTo(mX + 39, mY - 35);
            ctx.lineTo(mX + 62, mY - 88);
            ctx.lineTo(mX + 85, mY - 35);
            ctx.fill();

            // Glowing Crimson Windows with Soft Flicker
            const winFlicker = Math.sin(animTime * 3.5) * 0.22 + 0.78;
            ctx.fillStyle = `rgba(255, 35, 50, ${winFlicker})`;

            // Main Citadel Windows
            ctx.fillRect(mX - 18, mY - 30, 10, 16);
            ctx.fillRect(mX + 8, mY - 30, 10, 16);
            ctx.fillRect(mX - 18, mY + 0, 10, 16);
            ctx.fillRect(mX + 8, mY + 0, 10, 16);

            // Tower Windows
            ctx.fillRect(mX - 68, mY - 18, 8, 14);
            ctx.fillRect(mX + 58, mY - 18, 8, 14);

            // Gothic Rose Window Center
            ctx.beginPath();
            ctx.arc(mX, mY - 75, 12, 0, Math.PI * 2);
            ctx.fill();

            // 5. Stylized Red Gothic Trees (Flanking Left and Right Foreground)
            // Left Gothic Tree
            const ltX = stageW * 0.10 + mouseX * 45;
            const ltY = stageH * 1.0;
            ctx.fillStyle = "#080104";
            ctx.beginPath();
            ctx.moveTo(ltX, ltY);
            ctx.lineTo(ltX + 18, ltY - 165);
            ctx.lineTo(ltX + 36, ltY);
            ctx.fill();

            // Left Foliage Clusters (Layered Crimson Shading)
            ctx.fillStyle = "rgba(180, 5, 22, 0.85)";
            ctx.beginPath();
            ctx.arc(ltX + 18, ltY - 175, 55, 0, Math.PI * 2);
            ctx.arc(ltX - 15, ltY - 145, 40, 0, Math.PI * 2);
            ctx.arc(ltX + 48, ltY - 145, 40, 0, Math.PI * 2);
            ctx.fill();

            // Right Gothic Tree
            const rtX = stageW * 0.90 + mouseX * 45;
            const rtY = stageH * 1.0;
            ctx.fillStyle = "#080104";
            ctx.beginPath();
            ctx.moveTo(rtX, rtY);
            ctx.lineTo(rtX - 18, rtY - 175);
            ctx.lineTo(rtX - 36, rtY);
            ctx.fill();

            // Right Foliage Clusters
            ctx.fillStyle = "rgba(225, 12, 35, 0.9)";
            ctx.beginPath();
            ctx.arc(rtX - 18, rtY - 185, 58, 0, Math.PI * 2);
            ctx.arc(rtX - 50, ltY - 152, 42, 0, Math.PI * 2);
            ctx.arc(rtX + 14, ltY - 152, 42, 0, Math.PI * 2);
            ctx.fill();

            // 6. Flying Crimson 3D Bats with Animated Wing Flaps
            canvasBats.forEach((bat) => {
                bat.x += bat.speedX;
                bat.y += Math.sin(animTime * 2.4 + bat.x * 0.02) * bat.speedY;
                bat.wingAngle += 0.32;

                if (bat.x > stageW + 50) bat.x = -50;

                const bx = bat.x + mouseX * 65;
                const by = bat.y + mouseY * 45;
                const wing = Math.sin(bat.wingAngle) * 14 * bat.scale;

                ctx.fillStyle = "#ff2233";
                ctx.beginPath();
                // Bat Head & Body
                ctx.arc(bx, by, 4 * bat.scale, 0, Math.PI * 2);
                // Left Wing
                ctx.moveTo(bx, by);
                ctx.lineTo(bx - 18 * bat.scale, by - wing);
                ctx.lineTo(bx - 8 * bat.scale, by + 5 * bat.scale);
                // Right Wing
                ctx.moveTo(bx, by);
                ctx.lineTo(bx + 18 * bat.scale, by - wing);
                ctx.lineTo(bx + 8 * bat.scale, by + 5 * bat.scale);
                ctx.fill();
            });
        }

        draw2DStage();
    }

    /* ----------------------------------------------------------------------
       9. CINEMATIC DESK INTRO CONTROLLER & 3D ZOOM TRANSITION
       ---------------------------------------------------------------------- */
    function initCinematicIntro() {
        const introOverlay = document.getElementById("cinematic-intro");
        const enterBtn = document.getElementById("enterPortfolioBtn");
        const deskScene = document.querySelector(".desk-scene");
        if (!introOverlay) return;

        let introSeen = null;
        try {
            introSeen = sessionStorage.getItem("ns_portfolio_intro_seen");
        } catch(e) {}

        if (introSeen === "true" || window.location.search.includes("skip_intro=1")) {
            introOverlay.classList.add("hidden-intro");
            introOverlay.style.display = "none";
            document.body.classList.remove("intro-active");
            return;
        }

        document.body.classList.add("intro-active");

        let isTransitioning = false;

        function triggerPortfolioZoom() {
            if (isTransitioning) return;
            isTransitioning = true;

            introOverlay.classList.add("zooming-in");
            try { sessionStorage.setItem("ns_portfolio_intro_seen", "true"); } catch(e){}

            setTimeout(() => {
                document.body.classList.remove("intro-active");
                introOverlay.classList.add("hidden-intro");
                introOverlay.style.display = "none";
            }, 900);
        }

        if (introOverlay) {
            introOverlay.addEventListener("click", triggerPortfolioZoom);
        }

        if (deskScene) {
            deskScene.addEventListener("click", triggerPortfolioZoom);
        }

        if (enterBtn) {
            enterBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                triggerPortfolioZoom();
            });
        }

        window.addEventListener("click", () => {
            if (introOverlay && !introOverlay.classList.contains("hidden-intro")) {
                triggerPortfolioZoom();
            }
        });

        window.addEventListener("keydown", (e) => {
            if (!introOverlay.classList.contains("hidden-intro") && (e.key === "Enter" || e.key === " ")) {
                triggerPortfolioZoom();
            }
        });
    }

    // Call intro first, then stage initialization safely
    try {
        initCinematicIntro();
    } catch(e) {
        console.error("Cinematic intro error:", e);
    }

    try {
        initHeroGothicStage();
    } catch(e) {
        console.error("Gothic stage init error:", e);
    }
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initApp);
} else {
    initApp();
}