// Thank You Page JavaScript Module
// Reads submitted data, renders a confirmation view, and stores submissions.
import { storage } from './main.js';

// Display submission data.
// Pulls from URL params first, then falls back to localStorage.
/**
 * Reads submitted form data and renders the confirmation details.
 *
 * Affects: DOM rendering and localStorage (application history).
 */
function displaySubmissionData() {
    const container = document.getElementById('submissionData');
    if (!container) return;
    
    // Get URL parameters.
    const urlParams = new URLSearchParams(window.location.search);
    
    // Get data from localStorage as backup.
    const storedData = storage.get('submissionData');
    
    // Build data object from URL params or stored data.
    const data = {};
    
    if (urlParams.has('fullName')) {
        data.fullName = urlParams.get('fullName');
        data.email = urlParams.get('email');
        data.specialty = urlParams.get('specialty');
        data.experience = urlParams.get('experience');
        data.interests = urlParams.get('interests');
        data.newsletter = urlParams.get('newsletter');
    } else if (storedData) {
        Object.assign(data, storedData);
    }
    
    // If no data available, show a helpful message.
    if (Object.keys(data).length === 0) {
        container.innerHTML = '<p>No submission data found. Please submit the form again.</p>';
        return;
    }
    
    // Map specialty codes to names for readability.
    const specialtyNames = {
        'mechanical': 'Mechanical Engineering',
        'electrical': 'Electrical Engineering',
        'software': 'Software Engineering',
        'civil': 'Civil Engineering',
        'biomedical': 'Biomedical Engineering',
        'chemical': 'Chemical Engineering',
        'aerospace': 'Aerospace Engineering',
        'other': 'Other'
    };
    
    // Display the data in a simple definition-like layout.
    const dataHTML = `
        <div class="data-item">
            <span class="data-label">Name:</span>
            <span class="data-value">${escapeHtml(data.fullName || 'Not provided')}</span>
        </div>
        <div class="data-item">
            <span class="data-label">Email:</span>
            <span class="data-value">${escapeHtml(data.email || 'Not provided')}</span>
        </div>
        <div class="data-item">
            <span class="data-label">Specialty:</span>
            <span class="data-value">${specialtyNames[data.specialty] || data.specialty || 'Not provided'}</span>
        </div>
        <div class="data-item">
            <span class="data-label">Experience:</span>
            <span class="data-value">${escapeHtml(data.experience || 'Not provided')} years</span>
        </div>
        ${data.interests ? `
        <div class="data-item">
            <span class="data-label">Interests:</span>
            <span class="data-value">${escapeHtml(data.interests)}</span>
        </div>
        ` : ''}
        <div class="data-item">
            <span class="data-label">Newsletter:</span>
            <span class="data-value">${data.newsletter === 'yes' ? 'Subscribed' : 'Not subscribed'}</span>
        </div>
    `;
    
    container.innerHTML = dataHTML;
    
    // Store application data.
    saveApplicationData(data);
}

// Escape HTML to prevent XSS.
/**
 * Escapes user-provided text to prevent HTML injection.
 *
 * Affects: Returned string used in DOM rendering.
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Save application data to localStorage.
// Keeps a history of submissions for demonstration purposes.
/**
 * Stores the submitted application in localStorage.
 *
 * Affects: localStorage (clubApplications array).
 */
function saveApplicationData(data) {
    const applications = storage.get('clubApplications') || [];
    
    applications.push({
        ...data,
        timestamp: new Date().toISOString(),
        status: 'pending'
    });
    
    storage.set('clubApplications', applications);
    
    // Clear the temporary submission data.
    storage.remove('submissionData');
}

// Track page view.
/**
 * Records a thank-you page view count.
 *
 * Affects: localStorage (thankYouViews).
 */
function trackThankYouView() {
    const views = storage.get('thankYouViews') || 0;
    storage.set('thankYouViews', views + 1);
}

// Save page preferences.
/**
 * Saves last page and visit timestamp.
 *
 * Affects: localStorage (userPreferences).
 */
function savePagePreferences() {
    const preferences = storage.get('userPreferences') || {};
    preferences.lastPage = 'thank-you';
    preferences.lastVisit = new Date().toISOString();
    storage.set('userPreferences', preferences);
}

// Initialize thank you page.
/**
 * Initializes all thank-you page behaviors.
 *
 * Affects: DOM rendering and localStorage.
 */
document.addEventListener('DOMContentLoaded', () => {
    displaySubmissionData();
    trackThankYouView();
    savePagePreferences();
});

export { displaySubmissionData };
