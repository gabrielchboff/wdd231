// Projects Page JavaScript Module
// Loads project data, renders cards, filters lists, and manages modals.
import { Modal, storage, fetchData } from './main.js';

// In-memory lists for rendering and filtering.
let allProjects = [];
let filteredProjects = [];

// Modal instance for project details.
const projectModal = new Modal('projectModal');

// Load all projects.
// Uses localStorage first, then fetches JSON if needed.
/**
 * Loads project data (cached or fetched) and renders the list.
 *
 * Affects: Network fetch, DOM rendering, localStorage cache.
 */
async function loadProjects() {
    const container = document.getElementById('projectsGrid');
    if (!container) return;

    try {
        // Try to get from localStorage first.
        const cachedProjects = storage.get('allProjects');
        
        if (cachedProjects) {
            allProjects = cachedProjects;
            filteredProjects = [...allProjects];
            displayProjects(filteredProjects);
        } else {
            // Fetch from JSON file.
            const result = await fetchData('data/projects.json');
            
            if (result.success) {
                allProjects = result.data.projects;
                filteredProjects = [...allProjects];
                storage.set('allProjects', allProjects);
                displayProjects(filteredProjects);
            } else {
                throw new Error(result.error);
            }
        }
    } catch (error) {
        console.error('Error loading projects:', error);
        container.innerHTML = `<p class="error-message">Unable to load projects. Please try again later.</p>`;
    }
}

// Display projects.
// Uses template literals to build cards and attach click handlers.
/**
 * Renders project cards and binds click handlers.
 *
 * Affects: DOM innerHTML and event listeners.
 */
function displayProjects(projects) {
    const container = document.getElementById('projectsGrid');
    const noResults = document.getElementById('noResults');
    
    if (!container) return;
    
    if (projects.length === 0) {
        container.innerHTML = '';
        noResults.removeAttribute('hidden');
        return;
    }
    
    noResults.setAttribute('hidden', '');
    
    const projectsHTML = projects.map(project => `
        <article class="project-card" data-project-id="${project.id}">
            <div class="project-header">
                <div class="project-icon">${project.icon}</div>
                <span class="project-status status-${project.status}">${project.status}</span>
            </div>
            <div class="project-body">
                <h3 class="project-title">${project.title}</h3>
                <span class="project-category">${getCategoryName(project.category)}</span>
                <p class="project-description">${project.description}</p>
                <div class="project-footer">
                    <span class="project-inventor">👤 ${project.inventor}</span>
                    <span class="project-year">📅 ${project.year}</span>
                </div>
            </div>
        </article>
    `).join('');
    
    container.innerHTML = projectsHTML;
    
    // Add click handlers to project cards.
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('click', () => {
            const projectId = parseInt(card.dataset.projectId);
            showProjectDetails(projectId);
        });
    });
}

// Get human-readable category name.
/**
 * Maps category codes to readable labels.
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

// Show project details in modal.
// Builds a detailed view using template literals.
/**
 * Builds and opens the project detail modal.
 *
 * Affects: DOM (modal content/visibility) and localStorage tracking.
 */
function showProjectDetails(projectId) {
    const project = allProjects.find(p => p.id === projectId);
    if (!project) return;
    
    const modalContent = `
        <div class="project-modal-header">
            <h2 id="projectModalTitle">${project.title}</h2>
            <div class="project-modal-meta">
                <span class="meta-item">
                    <span class="meta-label">Category:</span>
                    <span class="meta-value">${getCategoryName(project.category)}</span>
                </span>
                <span class="meta-item">
                    <span class="meta-label">Status:</span>
                    <span class="meta-value">${project.status}</span>
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
            <h3>Key Features</h3>
            <ul class="project-features">
                ${project.features.map(feature => `<li>${feature}</li>`).join('')}
            </ul>
        </div>
        
        <div class="project-modal-section">
            <h3>Technologies Used</h3>
            <div class="project-technologies">
                ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
            </div>
        </div>
        
        <div class="project-modal-section">
            <h3>Impact</h3>
            <p>${project.impact}</p>
        </div>
        
        <div class="project-cta">
            <a href="#" class="project-cta-button">Learn More About This Project</a>
        </div>
    `;
    
    projectModal.setContent(modalContent);
    projectModal.open();
    
    // Track project view to demonstrate localStorage usage.
    trackProjectView(projectId);
}

// Filter projects.
// Applies category/status filters and saves preferences.
/**
 * Filters projects and re-renders the list.
 *
 * Affects: DOM rendering and localStorage filter preferences.
 */
function filterProjects() {
    const categoryFilter = document.getElementById('categoryFilter').value;
    const statusFilter = document.getElementById('statusFilter').value;
    
    filteredProjects = allProjects.filter(project => {
        const matchesCategory = categoryFilter === 'all' || project.category === categoryFilter;
        const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
        return matchesCategory && matchesStatus;
    });
    
    displayProjects(filteredProjects);
    
    // Save filter preferences for next visit.
    storage.set('projectFilters', {
        category: categoryFilter,
        status: statusFilter
    });
}

// Setup filter handlers.
// Restores saved filters and wires up events.
/**
 * Restores filters and wires up filter events.
 *
 * Affects: DOM event listeners and filter state.
 */
function setupFilters() {
    const categoryFilter = document.getElementById('categoryFilter');
    const statusFilter = document.getElementById('statusFilter');
    const resetButton = document.getElementById('resetFilters');
    
    // Load saved filters.
    const savedFilters = storage.get('projectFilters');
    if (savedFilters) {
        if (categoryFilter) categoryFilter.value = savedFilters.category || 'all';
        if (statusFilter) statusFilter.value = savedFilters.status || 'all';
    }
    
    if (categoryFilter) {
        categoryFilter.addEventListener('change', filterProjects);
    }
    
    if (statusFilter) {
        statusFilter.addEventListener('change', filterProjects);
    }
    
    if (resetButton) {
        resetButton.addEventListener('click', () => {
            if (categoryFilter) categoryFilter.value = 'all';
            if (statusFilter) statusFilter.value = 'all';
            filterProjects();
        });
    }
}

// Track project views in localStorage.
/**
 * Records a project view count.
 *
 * Affects: localStorage (projectViews object).
 */
function trackProjectView(projectId) {
    const views = storage.get('projectViews') || {};
    views[projectId] = (views[projectId] || 0) + 1;
    storage.set('projectViews', views);
}

// Save page preferences.
/**
 * Saves last page and visit timestamp.
 *
 * Affects: localStorage (userPreferences).
 */
function savePagePreferences() {
    const preferences = storage.get('userPreferences') || {};
    preferences.lastPage = 'projects';
    preferences.lastVisit = new Date().toISOString();
    storage.set('userPreferences', preferences);
}

// Initialize projects page.
/**
 * Initializes all projects page behaviors.
 *
 * Affects: DOM rendering, localStorage, event listeners.
 */
document.addEventListener('DOMContentLoaded', () => {
    loadProjects();
    setupFilters();
    savePagePreferences();
});

export { loadProjects, filterProjects, showProjectDetails };
