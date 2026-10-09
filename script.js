document.addEventListener("DOMContentLoaded", () => {
const main = document.querySelector("main");
const sections = document.querySelectorAll("main > section");
const navLinks = document.querySelectorAll(".nav-links a");
const menuToggle = document.getElementById("menu-toggle");
const navMenu = document.getElementById("nav-links");
const scrollTopButton = document.getElementById("scroll-top");
const yearElement = document.getElementById("year");

```
// Update copyright year
if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
}

// Navigate between horizontal sections
function navigateToSection(targetSection) {
    if (!main || !targetSection) return;

    main.scrollTo({
        left: targetSection.offsetLeft,
        behavior: "smooth"
    });

    closeMobileMenu();
}

// Close mobile navigation menu
function closeMobileMenu() {
    if (navMenu) {
        navMenu.classList.remove("active");
    }

    if (menuToggle) {
        menuToggle.setAttribute("aria-expanded", "false");
    }
}

// Handle navigation links
navLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
        const targetId = link.getAttribute("href");

        if (!targetId || !targetId.startsWith("#")) return;

        const targetSection = document.querySelector(targetId);

        if (targetSection) {
            event.preventDefault();
            navigateToSection(targetSection);
        }
    });
});

// Mobile menu toggle
if (menuToggle && navMenu) {
    menuToggle.setAttribute("aria-expanded", "false");

    menuToggle.addEventListener("click", (event) => {
        event.stopPropagation();

        const isOpen = navMenu.classList.toggle("active");
        menuToggle.setAttribute("aria-expanded", String(isOpen));
    });

    document.addEventListener("click", (event) => {
        if (
            !menuToggle.contains(event.target) &&
            !navMenu.contains(event.target)
        ) {
            closeMobileMenu();
        }
    });

    navMenu.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", closeMobileMenu);
    });
}

// Highlight the current section in the navigation
function updateActiveNavigation() {
    if (!main || sections.length === 0) return;

    const mainCenter = main.scrollLeft + main.clientWidth / 2;
    let closestSection = null;
    let smallestDistance = Infinity;

    sections.forEach((section) => {
        const sectionCenter =
            section.offsetLeft + section.offsetWidth / 2;

        const distance = Math.abs(sectionCenter - mainCenter);

        if (distance < smallestDistance) {
            smallestDistance = distance;
            closestSection = section;
        }
    });

    if (!closestSection) return;

    navLinks.forEach((link) => {
        const active =
            link.getAttribute("href") === `#${closestSection.id}`;

        link.classList.toggle("active", active);

        if (active) {
            link.setAttribute("aria-current", "page");
        } else {
            link.removeAttribute("aria-current");
        }
    });
}

// Update navigation when scrolling or resizing
if (main) {
    main.addEventListener("scroll", updateActiveNavigation, {
        passive: true
    });

    window.addEventListener("resize", updateActiveNavigation);
}

// Scroll-to-top button, if present in the HTML
if (scrollTopButton && sections.length > 0) {
    scrollTopButton.addEventListener("click", () => {
        navigateToSection(sections[0]);
    });
}

// Keyboard navigation between sections
document.addEventListener("keydown", (event) => {
    if (!main || sections.length === 0) return;

    const activeElement = document.activeElement;

    const isTyping =
        activeElement &&
        (
            activeElement.tagName === "INPUT" ||
            activeElement.tagName === "TEXTAREA" ||
            activeElement.isContentEditable
        );

    if (isTyping || event.altKey || event.ctrlKey || event.metaKey) {
        return;
    }

    let currentIndex = 0;
    let closestDistance = Infinity;

    sections.forEach((section, index) => {
        const distance = Math.abs(section.offsetLeft - main.scrollLeft);

        if (distance < closestDistance) {
            closestDistance = distance;
            currentIndex = index;
        }
    });

    if (event.key === "ArrowRight") {
        event.preventDefault();

        const nextIndex = Math.min(
            currentIndex + 1,
            sections.length - 1
        );

        navigateToSection(sections[nextIndex]);
    }

    if (event.key === "ArrowLeft") {
        event.preventDefault();

        const previousIndex = Math.max(currentIndex - 1, 0);

        navigateToSection(sections[previousIndex]);
    }

    if (event.key === "Home") {
        event.preventDefault();
        navigateToSection(sections[0]);
    }

    if (event.key === "End") {
        event.preventDefault();
        navigateToSection(sections[sections.length - 1]);
    }

    if (event.key === "Escape") {
        closeMobileMenu();
    }
});

// Initialize the active navigation link
updateActiveNavigation();
```

});
