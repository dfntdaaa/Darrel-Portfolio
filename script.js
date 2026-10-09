// ========================================
// ELEMENTS
// ========================================

const header = document.querySelector("header");
const main = document.querySelector("main");
const sections = document.querySelectorAll(
    "main section[id], main section.hero, main section.section, main section.contact-section"
);

const navLinks = document.querySelectorAll(
    ".nav-links a, nav a"
);

const menuToggle = document.getElementById("menu-toggle");
const navMenu = document.getElementById("nav-links");

const backToTop = document.getElementById("back-to-top");

// ========================================
// MOBILE NAVIGATION
// ========================================

function closeMobileMenu() {
    if (!menuToggle || !navMenu) return;

    navMenu.classList.remove("active");
    menuToggle.classList.remove("active");

    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation menu");
}

if (menuToggle && navMenu) {
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation menu");

    menuToggle.addEventListener("click", () => {
        const isOpen = navMenu.classList.toggle("active");

        menuToggle.classList.toggle("active", isOpen);
        menuToggle.setAttribute("aria-expanded", String(isOpen));
        menuToggle.setAttribute(
            "aria-label",
            isOpen ? "Close navigation menu" : "Open navigation menu"
        );
    });

    navLinks.forEach(link => {
        link.addEventListener("click", closeMobileMenu);
    });

    document.addEventListener("click", event => {
        if (
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
// NAVIGATION
// ========================================

function getTargetSection(link) {
    const href = link.getAttribute("href");

    if (!href || !href.startsWith("#")) return null;

    return document.querySelector(href);
}

function setActiveLink(targetId) {
    navLinks.forEach(link => {
        const href = link.getAttribute("href");
        const isActive = href === `#${targetId}`;

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

    const isMobile = window.matchMedia("(max-width: 768px)").matches;

    if (isMobile) {
        target.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    } else if (main && main.contains(target)) {
        main.scrollTo({
            left: target.offsetLeft,
            behavior: "smooth"
        });
    } else {
        target.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }
}

navLinks.forEach(link => {
    link.addEventListener("click", event => {
        const target = getTargetSection(link);

        if (!target) return;

        event.preventDefault();

        scrollToSection(target);

        if (target.id) {
            setActiveLink(target.id);
        }
    });
});

// Support direct links such as yourwebsite.com/#contact
function openInitialSection() {
    const hash = window.location.hash;

    if (!hash) return;

    const target = document.querySelector(hash);

    if (!target) return;

    // Avoid interfering with the browser's initial page rendering.
    requestAnimationFrame(() => {
        scrollToSection(target);

        if (target.id) {
            setActiveLink(target.id);
        }
    });
}

openInitialSection();

// ========================================
// ACTIVE SECTION TRACKING
// ========================================

function updateActiveSection() {
    const isMobile = window.matchMedia("(max-width: 768px)").matches;

    if (isMobile) {
        let currentSection = null;
        let closestDistance = Infinity;

        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            const distance = Math.abs(rect.top - 100);

            if (
                rect.top <= window.innerHeight &&
                rect.bottom >= 100 &&
                distance < closestDistance
            ) {
                closestDistance = distance;
                currentSection = section;
            }
        });

        if (currentSection && currentSection.id) {
            setActiveLink(currentSection.id);
        }
    } else if (main) {
        let currentSection = null;
        let closestDistance = Infinity;

        sections.forEach(section => {
            const distance = Math.abs(
                section.offsetLeft - main.scrollLeft
            );

            if (distance < closestDistance) {
                closestDistance = distance;
                currentSection = section;
            }
        });

        if (currentSection && currentSection.id) {
            setActiveLink(currentSection.id);
        }
    }
}

if (main) {
    main.addEventListener("scroll", updateActiveSection, {
        passive: true
    });
}

window.addEventListener("scroll", updateActiveSection, {
    passive: true
});

window.addEventListener("resize", () => {
    closeMobileMenu();
    updateActiveSection();
});

updateActiveSection();

// ========================================
// SCROLL-TO-TOP BUTTON
// ========================================

function toggleBackToTop() {
    if (!backToTop) return;

    const isMobile = window.matchMedia("(max-width: 768px)").matches;

    const scrollPosition = isMobile
        ? window.scrollY
        : main
            ? main.scrollLeft
            : window.scrollY;

    backToTop.classList.toggle("visible", scrollPosition > 300);
}

if (backToTop) {
    backToTop.addEventListener("click", () => {
        const isMobile = window.matchMedia("(max-width: 768px)").matches;

        if (isMobile) {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        } else if (main) {
            main.scrollTo({
                left: 0,
                behavior: "smooth"
            });
        } else {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        }
    });
}

if (main) {
    main.addEventListener("scroll", toggleBackToTop, {
        passive: true
    });
}

window.addEventListener("scroll", toggleBackToTop, {
    passive: true
});

toggleBackToTop();

// ========================================
// REVEAL ANIMATIONS
// ========================================

const revealElements = document.querySelectorAll(
    ".section-title, .about-content, .experience-card, " +
    ".skill-card, .education-card, .project-card, " +
    ".contact-container"
);

const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
).matches;

if ("IntersectionObserver" in window && !reduceMotion) {
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
            threshold: 0.12
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
    ".profile-image img, .hero img, img.profile-photo"
);

if (profileImage) {
    profileImage.addEventListener("error", () => {
        profileImage.classList.add("image-error");
    });

    if (profileImage.complete && profileImage.naturalWidth === 0) {
        profileImage.classList.add("image-error");
    }
}

// ========================================
// FOOTER YEAR
// ========================================

const yearElement = document.getElementById("current-year");

if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
}

// ========================================
// EXTERNAL SOCIAL LINKS
// ========================================

document.querySelectorAll(
    ".contact-social-links a"
).forEach(link => {
    const href = link.getAttribute("href");

    if (href && /^https?:\/\//i.test(href)) {
        link.setAttribute("target", "_blank");
        link.setAttribute("rel", "noopener noreferrer");
    }
});

});
