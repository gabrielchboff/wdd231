// Home Page JavaScript Module
// Handles featured projects, stats animations, modal interactions, and form storage.
import { Modal, storage, fetchData, animateNumber } from './main.js';

// Initialize modal for the join form.
const joinModal = new Modal('joinModal');
// Initialize modal for featured project details.
const projectPreviewModal = new Modal('homeProjectModal');

// In-memory project list for modal details.
let allProjects = [];

// Load and display featured projects.
// Fetches data once and renders a small preview list.
/**
 * Fetches projects and renders featured previews plus stats.
 *
 * Affects: Network fetch, DOM rendering, localStorage cache.
 */
async function loadFeaturedProjects() {
    const container = document.getElementById('featuredProjects');
    if (!container) return;

    try {
        const result = await fetchData('data/projects.json');
        
        if (result.success) {
            const projects = result.data.projects;
            allProjects = projects;
            
            // Store projects in local storage for later use.
            storage.set('allProjects', projects);
            
            // Display first 3 projects as featured.
            const featured = projects.slice(0, 3);
            displayProjects(featured, container);
            
            // Update project count stat in the hero section.
            const projectCount = document.getElementById('projectCount');
            if (projectCount) {
                animateNumber(projectCount, 0, projects.length);
            }
        } else {
            throw new Error(result.error);
        }
    } catch (error) {
        console.error('Error loading projects:', error);
        container.innerHTML = `<p class="error-message">Unable to load projects. Please try again later.</p>`;
    }
}

// Display projects in container.
// Uses template literals to build the preview cards.
/**
 * Renders project preview cards into a container.
 *
 * Affects: DOM innerHTML for the preview section.
 */
function displayProjects(projects, container) {
    const projectsHTML = projects.map(project => `
        <article class="project-card-preview" data-project-id="${project.id}">
            <div class="project-image">
                ${project.icon}
            </div>
            <div class="project-content">
                <h3 class="project-title">${project.title}</h3>
                <span class="project-category">${getCategoryName(project.category)}</span>
                <p class="project-description">${project.description}</p>
                <div class="project-meta">
                    <span>👤 ${project.inventor}</span>
                    <span>📅 ${project.year}</span>
                </div>
            </div>
        </article>
    `).join('');
    
    container.innerHTML = projectsHTML;

    // Bind click handlers for modal details.
    document.querySelectorAll('.project-card-preview').forEach(card => {
        card.addEventListener('click', () => {
            const projectId = parseInt(card.dataset.projectId);
            showProjectPreviewDetails(projectId);
        });
    });
}

// Get human-readable category name.
/**
 * Maps category codes to human-readable labels.
 *
 * Affects: Returned string used in DOM rendering.
 */
function getCategoryName(category) {
    const categories = {
        'robotics': 'Robotics',
        'iot': 'IoT & Smart Devices',
        'renewable': 'Renewable Energy',
        'medical': 'Medical Devices',
        'automation': 'Automation',
        'software': 'Software & AI'
    };
    return categories[category] || category;
}

/**
 * Builds and opens the project preview modal.
 *
 * Affects: DOM (modal content/visibility).
 */
function showProjectPreviewDetails(projectId) {
    const project = allProjects.find(p => p.id === projectId);
    if (!project) return;

    const modalContent = `
        <div class="project-modal-header">
            <h2 id="homeProjectModalTitle">${project.title}</h2>
            <div class="project-modal-meta">
                <span class="meta-item">
                    <span class="meta-label">Category:</span>
                    <span class="meta-value">${getCategoryName(project.category)}</span>
                </span>
                <span class="meta-item">
                    <span class="meta-label">Year:</span>
                    <span class="meta-value">${project.year}</span>
                </span>
                <span class="meta-item">
                    <span class="meta-label">Inventor:</span>
                    <span class="meta-value">${project.inventor}</span>
                </span>
            </div>
        </div>
        <div class="project-modal-section">
            <h3>Overview</h3>
            <p>${project.description}</p>
        </div>
        <div class="project-modal-section">
            <h3>Impact</h3>
            <p>${project.impact}</p>
        </div>
    `;

    projectPreviewModal.setContent(modalContent);
    projectPreviewModal.open();
}

// Animate statistics on page load.
// Values are kept in localStorage so the site feels consistent.
/**
 * Animates homepage stats using stored or default values.
 *
 * Affects: DOM text content and localStorage values.
 */
function animateStats() {
    const memberCount = document.getElementById('memberCount');
    const projectCount = document.getElementById('projectCount');
    const patentCount = document.getElementById('patentCount');
    
    // Get stored values or use defaults.
    // lastVisit is available for future enhancements (not used directly here).
    const lastVisit = storage.get('lastVisit');
    const stats = storage.get('clubStats') || {
        members: 247,
        projects: 22,
        patents: 18
    };
    
    if (memberCount) animateNumber(memberCount, 0, stats.members);
    if (patentCount) animateNumber(patentCount, 0, stats.patents);
    
    // Save current visit time and stats.
    storage.set('lastVisit', new Date().toISOString());
    storage.set('clubStats', stats);
}

// Handle join button clicks.
// Opens the modal and logs usage for simple analytics.
/**
 * Binds click events to open the join modal.
 *
 * Affects: DOM event listeners and modal state.
 */
function setupJoinButtons() {
    const joinBtn = document.getElementById('joinBtn');
    const joinBtnBottom = document.getElementById('joinBtnBottom');
    
    if (joinBtn) {
        joinBtn.addEventListener('click', () => {
            joinModal.open();
            trackEvent('join_modal_opened', 'hero_button');
        });
    }
    
    if (joinBtnBottom) {
        joinBtnBottom.addEventListener('click', () => {
            joinModal.open();
            trackEvent('join_modal_opened', 'cta_button');
        });
    }
}

// Track user events in localStorage.
// This supports the localStorage requirement with meaningful data.
/**
 * Logs simple user events for demonstration.
 *
 * Affects: localStorage (userEvents array).
 */
function trackEvent(eventName, source) {
    const events = storage.get('userEvents') || [];
    events.push({
        event: eventName,
        source: source,
        timestamp: new Date().toISOString()
    });
    
    // Keep only last 50 events to prevent unbounded growth.
    if (events.length > 50) {
        events.shift();
    }
    
    storage.set('userEvents', events);
}

// Handle form submission.
// Saves data for display on the thank-you page.
/**
 * Captures form submission data for the thank-you page.
 *
 * Affects: localStorage (submissionData).
 */
function setupFormHandling() {
    const form = document.getElementById('joinForm');
    if (!form) return;
    
    form.addEventListener('submit', (e) => {
        // Form will submit naturally to thank-you.html.
        // Store form data for display on thank-you page.
        const formData = new FormData(form);
        const formObject = {};
        
        formData.forEach((value, key) => {
            formObject[key] = value;
        });
        
        storage.set('submissionData', formObject);
        trackEvent('form_submitted', 'join_modal');
    });
}

// Save user preferences.
// Used across pages to remember the last visit.
/**
 * Records the user's last page and visit time.
 *
 * Affects: localStorage (userPreferences).
 */
function saveUserPreferences() {
    const preferences = storage.get('userPreferences') || {};
    preferences.lastPage = 'home';
    preferences.lastVisit = new Date().toISOString();
    storage.set('userPreferences', preferences);
}

// Initialize home page behaviors.
/**
 * Initializes all home page behaviors.
 *
 * Affects: DOM rendering, localStorage, modal events.
 */
document.addEventListener('DOMContentLoaded', () => {
    animateStats();
    loadFeaturedProjects();
    setupJoinButtons();
    setupFormHandling();
    saveUserPreferences();
});

export { loadFeaturedProjects, animateStats, trackEvent };
