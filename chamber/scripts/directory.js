document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("year").textContent =
                    new Date().getFullYear();
    const directory = document.getElementById("directory");
    const gridBtn = document.getElementById("gridBtn");
    const listBtn = document.getElementById("listBtn");
    const navToggle = document.getElementById("navToggle");
    const navLinks = document.getElementById("navLinks");

    let membersData = [];
    let currentView = "grid";

    async function fetchMembers() {
        try {
            const response = await fetch("data/members.json");
            if (!response.ok) throw new Error("Failed to fetch members data");
            
            const data = await response.json();
            membersData = data.members;
            displayMembers(currentView);
        } catch (error) {
            console.error("Error fetching members:", error);
            directory.innerHTML =
                '<p class="loading" role="alert">Error loading members. Please try again later.</p>';
        }
    }

    function getMembershipLevel(level) {
        switch (level) {
            case 1: return "member";
            case 2: return "silver";
            case 3: return "gold";
            default: return "member";
        }
    }

    function getMembershipLevelText(level) {
        switch (level) {
            case 1: return "Member";
            case 2: return "Silver Member";
            case 3: return "Gold Member";
            default: return "Member";
        }
    }

    function displayMembers(viewType) {
        currentView = viewType;
        directory.className = viewType === "grid" ? "member-grid" : "member-list";

        if (membersData.length === 0) {
            directory.innerHTML = '<p class="loading">No members to display.</p>';
            return;
        }

        // Performance: Efficient DOM generation
        directory.innerHTML = membersData.map((member) => {
            const levelClass = getMembershipLevel(member.membershipLevel);
            const levelText = getMembershipLevelText(member.membershipLevel);
            const cleanWebsite = member.website.replace("https://", "").replace("http://", "");

            // Accessibility & Performance Improvements:
            // 1. loading="lazy" for speed
            // 2. explicit width/height to stop CLS
            // 3. Fixed corrupted icons to standard emojis
            // 4. Added meaningful alt text
            
            return `
            <article class="member-card">
                <div class="member-image">
                    <img 
                        src="${member.image}" 
                        alt="Storefront of ${member.name}"
                        width="400" 
                        height="300" 
                        loading="lazy"
                        onerror="this.parentElement.innerHTML='<div class=\'placeholder-img\'>${member.name.substring(0,2)}</div>'"
                    >
                </div>
                <div class="member-info">
                    <span class="member-level ${levelClass}">${levelText}</span>
                    <h2 class="member-name">${member.name}</h2>
                    <p class="member-category">${member.category}</p>
                    <p class="member-description">${member.description}</p>
                    <address class="member-contact">
                        <p><span aria-hidden="true">📍</span> ${member.address}</p>
                        <p><span aria-hidden="true">📞</span> <a href="tel:${member.phone.replace(/[^0-9]/g, '')}">${member.phone}</a></p>
                        <p><span aria-hidden="true">🌐</span> <a href="${member.website}" target="_blank" rel="noopener noreferrer" aria-label="Visit ${member.name} website">${cleanWebsite}</a></p>
                        <p class="member-meta"><span aria-hidden="true">👥</span> Employees: ${member.employees} | Founded: ${member.yearFounded}</p>
                    </address>
                </div>
            </article>
            `;
        }).join("");
    }

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

    fetchMembers();
});