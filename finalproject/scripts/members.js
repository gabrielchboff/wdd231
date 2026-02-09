// Members Page JavaScript Module
// Loads member data, renders cards, enables search/filter, and manages modals.
import { Modal, storage, fetchData } from "./main.js";

// In-memory lists for rendering and filtering.
let allMembers = [];
let filteredMembers = [];

// Modal instance for member details.
const memberModal = new Modal("memberModal");

// Member specialties mapping for avatars.
const specialtyEmojis = {
  mechanical: "⚙️",
  electrical: "⚡",
  software: "💻",
  civil: "🏗️",
  biomedical: "🧬",
  chemical: "🧪",
  aerospace: "🚀",
};

// Load members from local JSON file.
// Uses localStorage caching to reduce repeated fetches.
/**
 * Loads member data (cached or fetched) and renders the list.
 *
 * Affects: Network fetch, DOM rendering, localStorage cache.
 */
async function loadMembers() {
  const container = document.getElementById("membersGrid");
  if (!container) return;

  try {
    // Check if we have cached members.
    const cachedMembers = storage.get("clubMembers");
    const cacheTime = storage.get("membersCacheTime");
    const now = new Date().getTime();

    // Use cache if less than 1 hour old.
    if (cachedMembers && cacheTime && now - cacheTime < 3600000) {
      allMembers = cachedMembers;
      filteredMembers = [...allMembers];
      displayMembers(filteredMembers);
      updateStats();
      return;
    }

    // Fetch from local JSON file.
    const result = await fetchData("data/members.json");

    if (result.success) {
      allMembers = result.data.members;
      filteredMembers = [...allMembers];

      // Cache the members data.
      storage.set("clubMembers", allMembers);
      storage.set("membersCacheTime", now);

      displayMembers(filteredMembers);
      updateStats();
    } else {
      throw new Error(result.error);
    }
  } catch (error) {
    console.error("Error loading members:", error);
    container.innerHTML = `<p class="error-message">Unable to load members. Please try again later.</p>`;
  }
}

// Display members.
// Builds card markup and wires up click handlers.
/**
 * Renders member cards and binds click handlers.
 *
 * Affects: DOM innerHTML and event listeners.
 */
function displayMembers(members) {
  const container = document.getElementById("membersGrid");
  const noResults = document.getElementById("noResults");

  if (!container) return;

  if (members.length === 0) {
    container.innerHTML = "";
    noResults.removeAttribute("hidden");
    return;
  }

  noResults.setAttribute("hidden", "");

  const membersHTML = members
    .map(
      (member) => `
        <article class="member-card" data-member-id="${member.id}">
            <div class="member-avatar">
                ${specialtyEmojis[member.specialty] || "👤"}
            </div>
            <h3 class="member-name">${member.name}</h3>
            <span class="member-specialty">${getSpecialtyName(member.specialty)}</span>
            <p class="member-bio">${member.bio}</p>
            <div class="member-stats">
                <div class="member-stat">
                    <span class="member-stat-value">${member.projects}</span>
                    <span class="member-stat-label">Projects</span>
                </div>
                <div class="member-stat">
                    <span class="member-stat-value">${member.patents}</span>
                    <span class="member-stat-label">Patents</span>
                </div>
                <div class="member-stat">
                    <span class="member-stat-value">${member.experience}</span>
                    <span class="member-stat-label">Years</span>
                </div>
            </div>
        </article>
    `,
    )
    .join("");

  container.innerHTML = membersHTML;

  // Add click handlers for opening member details.
  document.querySelectorAll(".member-card").forEach((card) => {
    card.addEventListener("click", () => {
      const memberId = parseInt(card.dataset.memberId);
      showMemberDetails(memberId);
    });
  });
}

// Get specialty name for display.
/**
 * Maps specialty codes to readable labels.
 *
 * Affects: Returned string used in DOM rendering.
 */
function getSpecialtyName(specialty) {
  const names = {
    mechanical: "Mechanical Engineering",
    electrical: "Electrical Engineering",
    software: "Software Engineering",
    civil: "Civil Engineering",
    biomedical: "Biomedical Engineering",
    chemical: "Chemical Engineering",
    aerospace: "Aerospace Engineering",
  };
  return names[specialty] || specialty;
}

// Show member details in modal.
// Renders a richer view with skills and achievements.
/**
 * Builds and opens the member detail modal.
 *
 * Affects: DOM (modal content/visibility) and localStorage tracking.
 */
function showMemberDetails(memberId) {
  const member = allMembers.find((m) => m.id === memberId);
  if (!member) return;

  const modalContent = `
        <div class="member-modal-header">
            <div class="member-modal-avatar">
                ${specialtyEmojis[member.specialty] || "👤"}
            </div>
            <h2 id="memberModalTitle" class="member-modal-name">${member.name}</h2>
            <span class="member-modal-specialty">${getSpecialtyName(member.specialty)}</span>
        </div>

        <div class="member-modal-section">
            <h3>About</h3>
            <p>${member.bio}</p>
        </div>

        <div class="member-modal-section">
            <h3>Professional Information</h3>
            <div class="member-info-grid">
                <div class="info-item">
                    <div class="info-label">Company</div>
                    <div class="info-value">${member.company}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Location</div>
                    <div class="info-value">${member.city}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Experience</div>
                    <div class="info-value">${member.experience} years</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Projects</div>
                    <div class="info-value">${member.projects}</div>
                </div>
            </div>
        </div>

        <div class="member-modal-section">
            <h3>Skills & Expertise</h3>
            <div class="member-skills">
                ${member.skills.map((skill) => `<span class="skill-tag">${skill}</span>`).join("")}
            </div>
        </div>

        <div class="member-modal-section">
            <h3>Achievements</h3>
            <ul class="member-projects">
                ${member.achievements.map((achievement) => `<li>${achievement}</li>`).join("")}
            </ul>
        </div>

        <div class="member-contact">
            <a href="mailto:${member.email}" class="contact-button">Contact ${member.name.split(" ")[0]}</a>
        </div>
    `;

  memberModal.setContent(modalContent);
  memberModal.open();

  // Track member view to demonstrate localStorage usage.
  trackMemberView(memberId);
}

// Update statistics in the banner.
/**
 * Updates the stats banner counts.
 *
 * Affects: DOM text content for stats.
 */
function updateStats() {
  const totalMembers = document.getElementById("totalMembers");
  const countries = document.getElementById("countries");
  const specialties = document.getElementById("specialties");

  if (totalMembers) totalMembers.textContent = allMembers.length;

  // Count unique cities (used as a proxy for countries).
  if (countries) {
    const uniqueCities = new Set(allMembers.map((m) => m.city));
    countries.textContent = uniqueCities.size;
  }

  // Count unique specialties.
  if (specialties) {
    const uniqueSpecialties = new Set(allMembers.map((m) => m.specialty));
    specialties.textContent = uniqueSpecialties.size;
  }
}

// Setup search and filters.
// Restores saved preferences and wires up events.
/**
 * Restores filters and wires up search/filter events.
 *
 * Affects: DOM event listeners and filter state.
 */
function setupSearchAndFilters() {
  const searchInput = document.getElementById("memberSearch");
  const specialtyFilter = document.getElementById("specialtyFilter");

  // Load saved filters.
  const savedFilters = storage.get("memberFilters");
  if (savedFilters) {
    if (searchInput) searchInput.value = savedFilters.search || "";
    if (specialtyFilter)
      specialtyFilter.value = savedFilters.specialty || "all";
  }

  if (searchInput) {
    searchInput.addEventListener("input", filterMembers);
  }

  if (specialtyFilter) {
    specialtyFilter.addEventListener("change", filterMembers);
  }
}

// Filter members based on text and specialty.
/**
 * Filters members by text and specialty and re-renders.
 *
 * Affects: DOM rendering and localStorage filter preferences.
 */
function filterMembers() {
  const searchInput = document.getElementById("memberSearch");
  const specialtyFilter = document.getElementById("specialtyFilter");

  const searchTerm = searchInput ? searchInput.value.toLowerCase() : "";
  const specialty = specialtyFilter ? specialtyFilter.value : "all";

  filteredMembers = allMembers.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchTerm) ||
      getSpecialtyName(member.specialty).toLowerCase().includes(searchTerm);
    const matchesSpecialty =
      specialty === "all" || member.specialty === specialty;

    return matchesSearch && matchesSpecialty;
  });

  displayMembers(filteredMembers);

  // Save filter preferences for next visit.
  storage.set("memberFilters", {
    search: searchTerm,
    specialty: specialty,
  });
}

// Track member views in localStorage.
/**
 * Records a member view count.
 *
 * Affects: localStorage (memberViews object).
 */
function trackMemberView(memberId) {
  const views = storage.get("memberViews") || {};
  views[memberId] = (views[memberId] || 0) + 1;
  storage.set("memberViews", views);
}

// Save page preferences.
/**
 * Saves last page and visit timestamp.
 *
 * Affects: localStorage (userPreferences).
 */
function savePagePreferences() {
  const preferences = storage.get("userPreferences") || {};
  preferences.lastPage = "members";
  preferences.lastVisit = new Date().toISOString();
  storage.set("userPreferences", preferences);
}

// Initialize members page.
/**
 * Initializes all members page behaviors.
 *
 * Affects: DOM rendering, localStorage, event listeners.
 */
document.addEventListener("DOMContentLoaded", () => {
  loadMembers();
  setupSearchAndFilters();
  savePagePreferences();
});

export { loadMembers, filterMembers, showMemberDetails };
