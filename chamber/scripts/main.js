
document.addEventListener("DOMContentLoaded", () => {
    const navToggle = document.getElementById("navToggle");
    const navLinks = document.getElementById("navLinks");
    const yearSpan = document.getElementById("year");
    const gridBtn = document.getElementById("gridBtn");

    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // DIRECTORY PAGE ONLY
    if (gridBtn && listBtn) {
        gridBtn.addEventListener("click", () => {
            gridBtn.classList.add("active");
            gridBtn.setAttribute("aria-pressed", "true");
            listBtn.classList.remove("active");
            listBtn.setAttribute("aria-pressed", "false");
            displayMembers("grid");
        });

        listBtn.addEventListener("click", () => {
            listBtn.classList.add("active");
            listBtn.setAttribute("aria-pressed", "true");
            gridBtn.classList.remove("active");
            gridBtn.setAttribute("aria-pressed", "false");
            displayMembers("list");
        });
    }

    // GLOBAL NAVIGATION
    if (navToggle && navLinks) {
        navToggle.addEventListener("click", () => {
            const isOpen = navLinks.classList.toggle("open");
            navToggle.setAttribute("aria-expanded", isOpen);
        });

        document.addEventListener("click", (e) => {
            if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) {
                navLinks.classList.remove("open");
                navToggle.setAttribute("aria-expanded", "false");
            }
        });
    }
});
