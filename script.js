document.addEventListener("DOMContentLoaded", function () {
    // ========================================
    // ELEMENTS
    // ========================================
    const header = document.querySelector(".header");
    const menuToggle = document.getElementById("menu-toggle");
    const navMenu = document.getElementById("nav-links");
    const navLinks = document.querySelectorAll(".nav-links a");
    const sections = document.querySelectorAll("main section[id]");
    const scrollTopButton = document.getElementById("scroll-top");
    const yearElement = document.getElementById("year");

    // ========================================
    // AUTOMATIC FOOTER YEAR
    // ========================================
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    // ========================================
    // MOBILE NAVIGATION MENU
    // ========================================
    function closeMenu() {
        if (!menuToggle || !navMenu) return;

        navMenu.classList.remove("active");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation menu");
        menuToggle.textContent = "☰";
    }

    if (menuToggle && navMenu) {
        menuToggle.addEventListener("click", function () {
            const isOpen = navMenu.classList.toggle("active");

            menuToggle.setAttribute("aria-expanded", String(isOpen));
            menuToggle.setAttribute(
                "aria-label",
                isOpen ? "Close navigation menu" : "Open navigation menu"
            );

            menuToggle.textContent = isOpen ? "✕" : "☰";
        });

        navLinks.forEach(function (link) {
            link.addEventListener("click", function () {
                closeMenu();
            });
        });

        document.addEventListener("click", function (event) {
            const clickedInsideMenu = navMenu.contains(event.target);
            const clickedToggle = menuToggle.contains(event.target);

            if (!clickedInsideMenu && !clickedToggle) {
                closeMenu();
            }
        });

        document.addEventListener("keydown", function (event) {
            if (event.key === "Escape" &&
                navMenu.classList.contains("active")) {
                closeMenu();
                menuToggle.focus();
            }
        });

        window.addEventListener("resize", function () {
            if (window.innerWidth > 768) {
                closeMenu();
            }
        });
    }

    // ========================================
    // SMOOTH VERTICAL NAVIGATION
    // ========================================
    navLinks.forEach(function (link) {
        link.addEventListener("click", function (event) {
            const targetId = link.getAttribute("href");

            if (!targetId || !targetId.startsWith("#")) return;

            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                event.preventDefault();

                const headerHeight = header
                    ? header.offsetHeight
                    : 0;

                const targetPosition =
                    targetSection.getBoundingClientRect().top +
                    window.scrollY -
                    headerHeight;

                window.scrollTo({
                    top: Math.max(0, targetPosition),
                    behavior: "smooth"
                });

                if (window.location.hash !== targetId) {
                    history.pushState(null, "", targetId);
                }
            }
        });
    });

    // ========================================
    // ACTIVE NAVIGATION LINK
    // ========================================
    function updateActiveLink() {
        let currentSection = "home";
        const scrollPosition = window.scrollY;
        const headerHeight = header ? header.offsetHeight : 0;

        sections.forEach(function (section) {
            const sectionTop =
                section.getBoundingClientRect().top + window.scrollY;

            if (scrollPosition + headerHeight + 100 >= sectionTop) {
                currentSection = section.id;
            }
        });

        navLinks.forEach(function (link) {
            const linkTarget = link.getAttribute("href");
            const isActive = linkTarget === "#" + currentSection;

            link.classList.toggle("active", isActive);

            if (isActive) {
                link.setAttribute("aria-current", "location");
            } else {
                link.removeAttribute("aria-current");
            }
        });
    }

    // ========================================
    // SCROLL-TO-TOP BUTTON
    // ========================================
    function updateScrollTopButton() {
        if (!scrollTopButton) return;

        scrollTopButton.style.display =
            window.scrollY > 400 ? "flex" : "none";

        scrollTopButton.style.alignItems = "center";
        scrollTopButton.style.justifyContent = "center";
    }

    if (scrollTopButton) {
        scrollTopButton.addEventListener("click", function () {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });
    }

    // ========================================
    // CLICKABLE PROFESSIONAL SUMMARY CARDS
    // ========================================
    const summaryCards = document.querySelectorAll(".summary-card");

    summaryCards.forEach(function (card) {
        const description = card.querySelector(".summary-description");

        if (!description) return;

        card.classList.remove("active");
        card.setAttribute("aria-expanded", "false");
        card.setAttribute("role", "button");
        card.setAttribute("tabindex", "0");

        function toggleCard() {
            const isOpen = card.classList.toggle("active");

            card.setAttribute("aria-expanded", String(isOpen));

            const footerText = card.querySelector(
                ".summary-card-footer span"
            );

            const arrow = card.querySelector(".summary-arrow");

            if (footerText) {
                footerText.textContent = isOpen
                    ? "Hide description"
                    : "View description";
            }

            if (arrow) {
                arrow.textContent = isOpen ? "↑" : "↓";
            }
        }

        card.addEventListener("click", function () {
            toggleCard();
        });

        card.addEventListener("keydown", function (event) {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                toggleCard();
            }
        });
    });

    // ========================================
    // SCROLL EVENTS
    // ========================================
    let ticking = false;

    function handleScroll() {
        if (ticking) return;

        ticking = true;

        window.requestAnimationFrame(function () {
            updateActiveLink();
            updateScrollTopButton();
            ticking = false;
        });
    }

    window.addEventListener("scroll", handleScroll, {
        passive: true
    });

    // ========================================
    // INITIAL PAGE STATE
    // ========================================
    updateActiveLink();
    updateScrollTopButton();

    // Correctly position a section if the page opens with a URL hash.
    if (window.location.hash) {
        const initialTarget = document.querySelector(
            window.location.hash
        );

        if (initialTarget) {
            window.requestAnimationFrame(function () {
                const headerHeight = header
                    ? header.offsetHeight
                    : 0;

                const targetPosition =
                    initialTarget.getBoundingClientRect().top +
                    window.scrollY -
                    headerHeight;

                window.scrollTo({
                    top: Math.max(0, targetPosition),
                    behavior: "auto"
                });

                updateActiveLink();
            });
        }
    }
});