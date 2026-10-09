
document.addEventListener("DOMContentLoaded", () => {
    // ========================================
    // ELEMENTS
    // ========================================

    const main = document.querySelector("main");
    const header = document.querySelector(".header");
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
    // FOOTER YEAR
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
    }

    if (menuToggle && navMenu) {
        menuToggle.setAttribute("aria-expanded", "false");

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
    // SECTION NAVIGATION
    // ========================================

    function setActiveLink(sectionId) {
        navLinks.forEach(link => {
            const isActive =
                link.getAttribute("href") === `#${sectionId}`;

            link.classList.toggle("active", isActive);

            if (isActive) {
                link.setAttribute("aria-current", "location");
            } else {
                link.removeAttribute("aria-current");
            }
        });
    }

    function scrollToSection(target) {
        if (!target) return;

        if (mobileQuery.matches) {
            const headerHeight = header
                ? header.offsetHeight
                : 0;

            const targetPosition =
                window.scrollY +
                target.getBoundingClientRect().top -
                headerHeight;

            window.scrollTo({
                top: Math.max(0, targetPosition),
                behavior: reduceMotion ? "auto" : "smooth"
            });
        } else if (main && main.contains(target)) {
            main.scrollTo({
                left: target.offsetLeft,
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

            const target = document.querySelector(href);

            if (!target) return;

            event.preventDefault();

            scrollToSection(target);

            if (target.id) {
                setActiveLink(target.id);
            }

            closeMobileMenu();
        });
    });

    // ========================================
    // OPEN THE LINKED SECTION ON PAGE LOAD
    // ========================================

    function openInitialSection() {
        const hash = window.location.hash;

        if (!hash) {
            setActiveLink("home");
            return;
        }

        let target;

        try {
            target = document.querySelector(hash);
        } catch (error) {
            target = null;
        }

        if (!target) return;

        requestAnimationFrame(() => {
            scrollToSection(target);

            if (target.id) {
                setActiveLink(target.id);
            }
        });
    }

    openInitialSection();

    // ========================================
    // TRACK THE ACTIVE SECTION
    // ========================================

    function updateActiveSection() {
        if (!sections.length) return;

        let currentSection = sections[0];
        let closestDistance = Infinity;

        if (mobileQuery.matches) {
            const headerHeight = header
                ? header.offsetHeight
                : 0;

            sections.forEach(section => {
                const rect = section.getBoundingClientRect();

                const distance = Math.abs(
                    rect.top - headerHeight
                );

                if (
                    rect.bottom > headerHeight &&
                    distance < closestDistance
                ) {
                    closestDistance = distance;
                    currentSection = section;
                }
            });
        } else if (main) {
            sections.forEach(section => {
                const distance = Math.abs(
                    section.offsetLeft - main.scrollLeft
                );

                if (distance < closestDistance) {
                    closestDistance = distance;
                    currentSection = section;
                }
            });
        }

        if (currentSection && currentSection.id) {
            setActiveLink(currentSection.id);
        }
    }

    if (main) {
        main.addEventListener(
            "scroll",
            updateActiveSection,
            { passive: true }
        );
    }

    window.addEventListener(
        "scroll",
        updateActiveSection,
        { passive: true }
    );

    // ========================================
    // SCROLL-TO-TOP BUTTON
    // ========================================

    function getScrollPosition() {
        if (mobileQuery.matches) {
            return window.scrollY;
        }

        return main ? main.scrollLeft : window.scrollY;
    }

    function updateScrollTopButton() {
        if (!scrollTopButton) return;

        const shouldShow = getScrollPosition() > 300;

        scrollTopButton.classList.toggle(
            "visible",
            shouldShow
        );

        scrollTopButton.setAttribute(
            "aria-hidden",
            String(!shouldShow)
        );
    }

    if (scrollTopButton) {
        scrollTopButton.addEventListener("click", () => {
            if (mobileQuery.matches) {
                window.scrollTo({
                    top: 0,
                    behavior: reduceMotion ? "auto" : "smooth"
                });
            } else if (main) {
                main.scrollTo({
                    left: 0,
                    behavior: reduceMotion ? "auto" : "smooth"
                });
            } else {
                window.scrollTo({
                    top: 0,
                    behavior: reduceMotion ? "auto" : "smooth"
                });
            }

            setActiveLink("home");
        });
    }

    if (main) {
        main.addEventListener(
            "scroll",
            updateScrollTopButton,
            { passive: true }
        );
    }

    window.addEventListener(
        "scroll",
        updateScrollTopButton,
        { passive: true }
    );

    updateScrollTopButton();

    // ========================================
    // RESPONSIVE LAYOUT UPDATES
    // ========================================

    function handleResize() {
        closeMobileMenu();
        updateActiveSection();
        updateScrollTopButton();
    }

    if (mobileQuery.addEventListener) {
        mobileQuery.addEventListener("change", handleResize);
    } else {
        mobileQuery.addListener(handleResize);
    }

    window.addEventListener("resize", handleResize);

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
    // PROFILE IMAGE FALLBACK
    // ========================================

    const profileImage = document.querySelector(
        ".profile-initials img"
    );

    if (profileImage) {
        function handleImageError() {
            profileImage.classList.add("image-error");
            profileImage.alt = "Profile photo unavailable";
        }

        profileImage.addEventListener("error", handleImageError);

        if (
            profileImage.complete &&
            profileImage.naturalWidth === 0
        ) {
            handleImageError();
        }
    }

    // ========================================
    // SOCIAL LINKS
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
    // EMAIL BUTTON
    // ========================================

    const emailLinks = document.querySelectorAll(
        'a[href*="darrel.gunnacao21@gmail.com"]'
    );

    emailLinks.forEach(link => {
        link.setAttribute("target", "_blank");
        link.setAttribute("rel", "noopener noreferrer");
    });

    // ========================================
    // INITIALIZE PAGE
    // ========================================

    requestAnimationFrame(() => {
        updateActiveSection();
        updateScrollTopButton();
    });
});
