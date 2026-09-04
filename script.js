/* ==========================================================================
   NIVED SUNIL PORTFOLIO — INTERACTIVE JAVASCRIPT CONTROLLER
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    
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

    revealElements.forEach((el) => revealObserver.observe(el));

    /* ----------------------------------------------------------------------
       8. 3D OCEAN WAVE INTERACTIVE BACKGROUND ENGINE (Three.js WebGL Shader)
       ---------------------------------------------------------------------- */
    function init3DOceanWave() {
        const canvas = document.getElementById("ocean-canvas");
        if (!canvas || typeof THREE === "undefined") return;

        // Prefers-reduced-motion check
        const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        // Detect mobile for resolution / geometry grid adjustment
        const isMobile = window.innerWidth < 768;
        const gridSegments = isMobile ? 60 : 130;

        // Scene, Camera, Renderer
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 100);
        camera.position.set(0, 15, 20);
        camera.lookAt(0, -0.5, 0);

        const renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            alpha: true,
            antialias: !isMobile,
            powerPreference: "high-performance"
        });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
        renderer.setSize(window.innerWidth, window.innerHeight);

        // Plane Geometry tilted horizontally (generous coverage)
        const geometry = new THREE.PlaneGeometry(75, 55, gridSegments, gridSegments);

        // Mouse & Raycasting Setup for Pixel-Perfect 3D Pointer Tracking
        const raycaster = new THREE.Raycaster();
        const mouseNDC = new THREE.Vector2(0, 0);
        const targetMouseLocal = new THREE.Vector2(0, 0);
        const currentMouseLocal = new THREE.Vector2(0, 0);
        let mouseActiveTarget = 0.0;
        let mouseActiveCurrent = 0.0;

        // GLSL Custom Shaders
        const vertexShader = `
            uniform float u_time;
            uniform vec2 u_mouseLocal;
            uniform float u_mouseActive;
            uniform float u_reducedMotion;

            varying vec3 vNormal;
            varying vec3 vPosition;
            varying float vDisplacement;
            varying float vMouseDist;

            // Compound sine & wave function for continuous ambient liquid swells
            float calculateWave(vec2 pos, float time) {
                if (u_reducedMotion > 0.5) return 0.0;

                float z = 0.0;
                z += sin(pos.x * 0.22 + time * 0.95) * 0.55;
                z += cos(pos.y * 0.28 + time * 0.75) * 0.45;
                z += sin((pos.x * 0.6 + pos.y * 0.8) * 0.2 + time * 1.2) * 0.35;
                z += cos(sqrt(pos.x * pos.x + pos.y * pos.y) * 0.35 - time * 1.1) * 0.25;
                return z;
            }

            void main() {
                vec3 pos = position;
                float time = u_time;

                // Continuous ambient wave elevation (always active)
                float waveZ = calculateWave(pos.xy, time);

                // Interactive liquid ripple displacement under pointer
                float dist = distance(pos.xy, u_mouseLocal);
                vMouseDist = dist;

                float rippleRadius = 8.5;
                if (dist < rippleRadius && u_reducedMotion < 0.5) {
                    float factor = pow(1.0 - dist / rippleRadius, 1.4) * u_mouseActive;
                    // Dynamic concentric liquid ripple rings + smooth finger dip at center
                    float ripple = sin(dist * 3.8 - time * 7.5) * 0.75 * factor;
                    float dip = -0.9 * exp(-dist * 0.45) * factor;
                    waveZ += ripple + dip;
                }

                pos.z += waveZ;
                vDisplacement = waveZ;
                vPosition = pos;

                // Compute exact surface normal for vivid specular lighting
                float delta = 0.08;
                float waveX = calculateWave(pos.xy + vec2(delta, 0.0), time);
                float waveY = calculateWave(pos.xy + vec2(0.0, delta), time);
                vec3 normalApprox = normalize(vec3(
                    (pos.z - waveX) / delta,
                    (pos.z - waveY) / delta,
                    1.0
                ));
                vNormal = normalMatrix * normalApprox;

                gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
            }
        `;

        const fragmentShader = `
            uniform float u_time;
            uniform vec2 u_mouseLocal;
            uniform float u_mouseActive;

            varying vec3 vNormal;
            varying vec3 vPosition;
            varying float vDisplacement;
            varying float vMouseDist;

            void main() {
                vec3 normal = normalize(vNormal);
                vec3 viewDir = normalize(-vPosition);

                // High Contrast Deep Crystal-Red Palette
                vec3 deepCrimsonBase = vec3(0.08, 0.005, 0.015); // Deep wine trough (#140104)
                vec3 richCrimson     = vec3(0.42, 0.02, 0.05);   // Rich deep red body (#6B050D)
                vec3 crystalRed      = vec3(0.88, 0.05, 0.10);   // Pure vibrant crystal red crest (#E00D1A)
                vec3 brightGlint     = vec3(1.00, 0.28, 0.30);   // Bright specular highlight (#FF474D)

                // Elevation gradient (troughs dark crimson, crests vibrant crystal red)
                float elev = clamp((vDisplacement + 1.1) / 2.2, 0.0, 1.0);
                vec3 liquidSurface = mix(deepCrimsonBase, richCrimson, smoothstep(0.05, 0.55, elev));
                liquidSurface = mix(liquidSurface, crystalRed, smoothstep(0.45, 0.95, elev));

                // Metallic Liquid Specular Highlights
                vec3 lightDir1 = normalize(vec3(0.4, 0.7, 0.9));
                vec3 lightDir2 = normalize(vec3(-0.5, -0.3, 0.7));

                vec3 halfDir = normalize(lightDir1 + viewDir);
                float spec = pow(max(dot(normal, halfDir), 0.0), 24.0);
                vec3 specHighlight = mix(crystalRed, brightGlint, spec) * spec * 1.35;

                // Secondary soft fill light
                float diff2 = max(dot(normal, lightDir2), 0.0);
                vec3 secondaryGlow = richCrimson * diff2 * 0.45;

                // Fresnel Edge Sheen
                float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 3.0);
                vec3 fresnelEdge = mix(richCrimson, brightGlint, fresnel) * fresnel * 0.75;

                // Interactive Pointer Liquid Ripple Highlight Ring
                float mouseGlow = 0.0;
                if (vMouseDist < 8.5) {
                    float factor = (1.0 - vMouseDist / 8.5) * u_mouseActive;
                    float ringPattern = sin(vMouseDist * 3.8 - u_time * 7.5) * 0.5 + 0.5;
                    mouseGlow = pow(factor, 1.3) * (0.5 + ringPattern * 0.5) * 0.9;
                }
                vec3 mouseHighlight = mix(crystalRed, brightGlint, mouseGlow) * mouseGlow * 1.2;

                // Composite final crystal-red liquid surface
                vec3 finalColor = liquidSurface + specHighlight + secondaryGlow + fresnelEdge + mouseHighlight;

                // Atmospheric opacity fade at outer viewport edges
                float edgeFade = smoothstep(26.0, 12.0, length(vPosition.xy));
                float alpha = clamp(0.78 + elev * 0.2 + mouseGlow * 0.25, 0.60, 0.98) * edgeFade;

                gl_FragColor = vec4(finalColor, alpha);
            }
        `;

        const material = new THREE.ShaderMaterial({
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            uniforms: {
                u_time: { value: 0.0 },
                u_mouseLocal: { value: new THREE.Vector2(0, 0) },
                u_mouseActive: { value: 0.0 },
                u_reducedMotion: { value: prefersReducedMotion ? 1.0 : 0.0 }
            },
            transparent: true,
            side: THREE.DoubleSide,
            depthWrite: false
        });

        const mesh = new THREE.Mesh(geometry, material);
        mesh.rotation.x = -Math.PI / 2.3;
        mesh.position.set(0, -2, -4);
        scene.add(mesh);

        // Invisible Mathematical Plane matching mesh orientation for exact Raycasting
        const MathPlane = new THREE.Plane();
        MathPlane.setFromNormalAndCoplanarPoint(
            new THREE.Vector3(0, Math.sin(Math.PI / 2.3), Math.cos(Math.PI / 2.3)),
            mesh.position
        );

        // Mouse Listeners anywhere on page
        window.addEventListener("mousemove", (e) => {
            mouseNDC.x = (e.clientX / window.innerWidth) * 2 - 1;
            mouseNDC.y = -(e.clientY / window.innerHeight) * 2 + 1;
            mouseActiveTarget = 1.0;

            // Raycast mouse position onto the wave plane
            raycaster.setFromCamera(mouseNDC, camera);
            const hitPoint = new THREE.Vector3();
            if (raycaster.ray.intersectPlane(MathPlane, hitPoint)) {
                // Convert world hit point into mesh local space
                mesh.worldToLocal(hitPoint);
                targetMouseLocal.set(hitPoint.x, hitPoint.y);
            }
        }, { passive: true });

        window.addEventListener("mouseenter", () => {
            mouseActiveTarget = 1.0;
        });

        window.addEventListener("mouseleave", () => {
            mouseActiveTarget = 0.0;
        });

        // Touch movement support for mobile/tablets
        window.addEventListener("touchmove", (e) => {
            if (e.touches.length > 0) {
                const touch = e.touches[0];
                mouseNDC.x = (touch.clientX / window.innerWidth) * 2 - 1;
                mouseNDC.y = -(touch.clientY / window.innerHeight) * 2 + 1;
                mouseActiveTarget = 1.0;

                raycaster.setFromCamera(mouseNDC, camera);
                const hitPoint = new THREE.Vector3();
                if (raycaster.ray.intersectPlane(MathPlane, hitPoint)) {
                    mesh.worldToLocal(hitPoint);
                    targetMouseLocal.set(hitPoint.x, hitPoint.y);
                }
            }
        }, { passive: true });

        // Window Resize Handler
        window.addEventListener("resize", () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
        });

        // Animation Loop
        let clock = new THREE.Clock();
        let isTabVisible = !document.hidden;
        let isCanvasVisible = true;

        document.addEventListener("visibilitychange", () => {
            isTabVisible = !document.hidden;
        });

        if ("IntersectionObserver" in window) {
            const canvasObserver = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    isCanvasVisible = entry.isIntersecting;
                });
            }, { threshold: 0.01 });
            canvasObserver.observe(canvas);
        }

        function animate() {
            requestAnimationFrame(animate);

            if (!isTabVisible || !isCanvasVisible) return;

            const elapsedTime = clock.getElapsedTime();
            material.uniforms.u_time.value = elapsedTime;

            // Smooth fluid lerp for mouse ripple position & active state
            currentMouseLocal.lerp(targetMouseLocal, 0.09);
            material.uniforms.u_mouseLocal.value.copy(currentMouseLocal);

            mouseActiveCurrent += (mouseActiveTarget - mouseActiveCurrent) * 0.08;
            material.uniforms.u_mouseActive.value = mouseActiveCurrent;

            // Continuous subtle ambient mesh movement
            if (!prefersReducedMotion) {
                mesh.rotation.z = Math.sin(elapsedTime * 0.12) * 0.03;
            }

            renderer.render(scene, camera);
        }

        animate();
    }

    init3DOceanWave();

    /* ----------------------------------------------------------------------
       9. CINEMATIC DESK INTRO CONTROLLER & 3D ZOOM TRANSITION
       ---------------------------------------------------------------------- */
    function initCinematicIntro() {
        const introOverlay = document.getElementById("cinematic-intro");
        const enterBtn = document.getElementById("enterPortfolioBtn");
        const deskScene = document.querySelector(".desk-scene");
        if (!introOverlay) return;

        // Check session storage so repeat navigations skip intro smoothly
        const introSeen = sessionStorage.getItem("ns_portfolio_intro_seen");

        if (introSeen === "true") {
            introOverlay.classList.add("hidden-intro");
            document.body.classList.remove("intro-active");
            return;
        }

        // Freeze body scrolling during intro
        document.body.classList.add("intro-active");

        let isTransitioning = false;

        function triggerPortfolioZoom() {
            if (isTransitioning) return;
            isTransitioning = true;

            introOverlay.classList.add("zooming-in");
            sessionStorage.setItem("ns_portfolio_intro_seen", "true");

            setTimeout(() => {
                document.body.classList.remove("intro-active");
                introOverlay.classList.add("hidden-intro");
            }, 900);
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

        // Keyboard ENTER or SPACE trigger
        window.addEventListener("keydown", (e) => {
            if (!introOverlay.classList.contains("hidden-intro") && (e.key === "Enter" || e.key === " ")) {
                triggerPortfolioZoom();
            }
        });
    }

    initCinematicIntro();
});