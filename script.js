
document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    // ========================================
    // ELEMENTS
    // ========================================

    const header = document.querySelector(".header");
    const main = document.querySelector("main");

    const sections = document.querySelectorAll(
        "main section[id]"
    );

    const navLinks = document.querySelectorAll(
        ".nav-links a"
    );

    const menuToggle = document.getElementById("menu-toggle");
    const navMenu = document.getElementById("nav-links");
    const scrollTopButton = document.getElementById("scroll-top");
    const yearElement = document.getElementById("year");

    const mobileQuery = window.matchMedia("(max-width: 768px)");

    const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    // ========================================
    // CURRENT YEAR
    // ========================================

    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    // ========================================
    // MOBILE NAVIGATION
    // ========================================

    function closeMobileMenu() {
        if (!menuToggle || !navMenu) return;

        navMenu.classList.remove("active");
        menuToggle.classList.remove("active");

        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute(
            "aria-label",
            "Open navigation menu"
        );

        menuToggle.textContent = "☰";
    }

    if (menuToggle && navMenu) {
        menuToggle.addEventListener("click", () => {
            const isOpen = navMenu.classList.toggle("active");

            menuToggle.classList.toggle("active", isOpen);

            menuToggle.setAttribute(
                "aria-expanded",
                String(isOpen)
            );

            menuToggle.setAttribute(
                "aria-label",
                isOpen
                    ? "Close navigation menu"
                    : "Open navigation menu"
            );

            menuToggle.textContent = isOpen ? "✕" : "☰";
        });

        navLinks.forEach(link => {
            link.addEventListener("click", closeMobileMenu);
        });

        document.addEventListener("click", event => {
            if (
                navMenu.classList.contains("active") &&
                !navMenu.contains(event.target) &&
                !menuToggle.contains(event.target)
            ) {
                closeMobileMenu();
            }
        });

        document.addEventListener("keydown", event => {
            if (event.key === "Escape") {
                closeMobileMenu();
            }
        });
    }

    // ========================================
    // ACTIVE NAVIGATION LINK
    // ========================================

    function setActiveLink(sectionId) {
        navLinks.forEach(link => {
            const href = link.getAttribute("href");
            const isActive = href === `#${sectionId}`;

            link.classList.toggle("active", isActive);

            if (isActive) {
                link.setAttribute("aria-current", "location");
            } else {
                link.removeAttribute("aria-current");
            }
        });
    }

    // ========================================
    // SECTION NAVIGATION
    // ========================================

    function scrollToSection(target) {
        if (!target) return;

        const headerHeight = header
            ? header.offsetHeight
            : 0;

        if (mobileQuery.matches) {
            const targetPosition =
                window.scrollY +
                target.getBoundingClientRect().top -
                headerHeight;

            window.scrollTo({
                top: Math.max(0, targetPosition),
                behavior: reduceMotion ? "auto" : "smooth"
            });
        } else {
            target.scrollIntoView({
                behavior: reduceMotion ? "auto" : "smooth",
                block: "start"
            });
        }
    }

    navLinks.forEach(link => {
        link.addEventListener("click", event => {
            const href = link.getAttribute("href");

            if (!href || !href.startsWith("#")) return;

            const target = document.getElementById(
                href.substring(1)
            );

            if (!target) return;

            event.preventDefault();

            scrollToSection(target);
            setActiveLink(target.id);
            closeMobileMenu();

            if (window.location.hash !== href) {
                history.replaceState(null, "", href);
            }
        });
    });

    // ========================================
    // OPEN SECTION FROM URL HASH
    // ========================================

    function openInitialSection() {
        const hash = window.location.hash;

        if (!hash || hash === "#") {
            setActiveLink("home");
            return;
        }

        const target = document.getElementById(
            hash.substring(1)
        );

        if (!target) {
            setActiveLink("home");
            return;
        }

        requestAnimationFrame(() => {
            scrollToSection(target);
            setActiveLink(target.id);
        });
    }

    openInitialSection();

    // ========================================
    // TRACK CURRENT SECTION WHILE SCROLLING
    // ========================================

    function updateActiveSection() {
        if (!sections.length) return;

        const headerHeight = header
            ? header.offsetHeight
            : 0;

        let currentSection = sections[0];
        let smallestDistance = Infinity;

        sections.forEach(section => {
            const rect = section.getBoundingClientRect();

            const visibleHeight = Math.min(
                rect.bottom,
                window.innerHeight
            ) - Math.max(rect.top, headerHeight);

            if (visibleHeight <= 0) return;

            const distance = Math.abs(
                rect.top - headerHeight
            );

            if (distance < smallestDistance) {
                smallestDistance = distance;
                currentSection = section;
            }
        });

        if (currentSection && currentSection.id) {
            setActiveLink(currentSection.id);
        }
    }

    window.addEventListener(
        "scroll",
        updateActiveSection,
        { passive: true }
    );

    // ========================================
    // SCROLL-TO-TOP BUTTON
    // ========================================

    function updateScrollTopButton() {
        if (!scrollTopButton) return;

        const shouldShow = window.scrollY > 300;

        scrollTopButton.classList.toggle(
            "visible",
            shouldShow
        );

        scrollTopButton.setAttribute(
            "aria-hidden",
            String(!shouldShow)
        );

        scrollTopButton.tabIndex = shouldShow ? 0 : -1;
    }

    if (scrollTopButton) {
        scrollTopButton.addEventListener("click", () => {
            window.scrollTo({
                top: 0,
                behavior: reduceMotion ? "auto" : "smooth"
            });

            setActiveLink("home");
        });
    }

    window.addEventListener(
        "scroll",
        updateScrollTopButton,
        { passive: true }
    );

    // ========================================
    // RESIZE HANDLING
    // ========================================

    function handleResize() {
        closeMobileMenu();
        updateActiveSection();
        updateScrollTopButton();
    }

    window.addEventListener("resize", handleResize);

    if (mobileQuery.addEventListener) {
        mobileQuery.addEventListener("change", handleResize);
    } else {
        mobileQuery.addListener(handleResize);
    }

    // ========================================
    // REVEAL ANIMATIONS
    // ========================================

    const revealElements = document.querySelectorAll(
        ".section-heading, " +
        ".about-text, " +
        ".summary-item, " +
        ".timeline-item, " +
        ".skills-group, " +
        ".skill-card, " +
        ".education-item, " +
        ".project-card, " +
        ".contact-container"
    );

    if (
        "IntersectionObserver" in window &&
        !reduceMotion
    ) {
        const revealObserver = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("revealed");
                        revealObserver.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.1
            }
        );

        revealElements.forEach(element => {
            element.classList.add("reveal");
            revealObserver.observe(element);
        });
    } else {
        revealElements.forEach(element => {
            element.classList.add("revealed");
        });
    }

    // ========================================
    // PROFILE IMAGE ERROR HANDLING
    // ========================================

    const profileImage = document.querySelector(
        ".profile-initials img"
    );

    if (profileImage) {
        function handleImageError() {
            profileImage.classList.add("image-error");
            profileImage.alt = "Profile photo unavailable";
        }

        profileImage.addEventListener(
            "error",
            handleImageError
        );

        if (
            profileImage.complete &&
            profileImage.naturalWidth === 0
        ) {
            handleImageError();
        }
    }

    // ========================================
    // SOCIAL MEDIA LINKS
    // ========================================

    document.querySelectorAll(
        ".contact-social-links a"
    ).forEach(link => {
        const href = link.getAttribute("href");

        if (href && /^https?:\/\//i.test(href)) {
            link.setAttribute("target", "_blank");
            link.setAttribute(
                "rel",
                "noopener noreferrer"
            );
        }
    });

    // ========================================
    // EMAIL LINKS
    // ========================================

    document.querySelectorAll(
        'a[href*="darrel.gunnacao21@gmail.com"]'
    ).forEach(link => {
        link.setAttribute("target", "_blank");
        link.setAttribute(
            "rel",
            "noopener noreferrer"
        );
    });

    // ========================================
    // INITIALIZE PAGE
    // ========================================

    requestAnimationFrame(() => {
        updateActiveSection();
        updateScrollTopButton();
    });

});
