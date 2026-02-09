// Main JavaScript Module - Shared Functionality
// Provides shared UI behaviors, storage helpers, and data utilities for all pages.

// Set current year in footer.
// Keeps the footer copyright up to date without manual edits.
/**
 * Updates the footer year to the current year.
 *
 * Affects: DOM text content for the #year element.
 */
export function setCurrentYear() {
    const yearElement = document.getElementById('year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

// Navigation toggle functionality.
// Handles the hamburger menu behavior for small screens.
/**
 * Wires up the hamburger menu and close behaviors.
 *
 * Affects: DOM attributes (aria-expanded) and user interaction behavior.
 */
export function initializeNavigation() {
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');

    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !isExpanded);
            navLinks.setAttribute('aria-expanded', !isExpanded);
        });

        // Close menu when clicking outside the nav.
        document.addEventListener('click', (e) => {
            if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) {
                navToggle.setAttribute('aria-expanded', 'false');
                navLinks.setAttribute('aria-expanded', 'false');
            }
        });

        // Close menu on escape key for accessibility.
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                navToggle.setAttribute('aria-expanded', 'false');
                navLinks.setAttribute('aria-expanded', 'false');
            }
        });
    }
}

// Modal utilities.
// Encapsulates open/close behavior, focus management, and content insertion.
export class Modal {
    /**
     * Creates a modal instance and binds close behaviors.
     *
     * Affects: DOM event listeners for the modal and document.
     */
    constructor(modalId) {
        this.modal = document.getElementById(modalId);
        if (!this.modal) return;

        this.closeButton = this.modal.querySelector('.modal-close');
        this.init();
    }

    /**
     * Registers click and keyboard handlers for closing the modal.
     *
     * Affects: DOM event listeners and modal visibility behavior.
     */
    init() {
        // Close on button click.
        if (this.closeButton) {
            this.closeButton.addEventListener('click', () => this.close());
        }

        // Close on background click.
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.close();
            }
        });

        // Close on escape key for accessibility.
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !this.modal.hasAttribute('hidden')) {
                this.close();
            }
        });
    }

    /**
     * Opens the modal and moves focus inside it.
     *
     * Affects: DOM attributes, body scroll, and focus.
     */
    open() {
        this.modal.removeAttribute('hidden');
        document.body.style.overflow = 'hidden';
        
        // Focus management for accessibility: move focus inside the modal.
        const firstFocusable = this.modal.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (firstFocusable) {
            firstFocusable.focus();
        }
    }

    /**
     * Closes the modal and restores body scroll.
     *
     * Affects: DOM attributes and body style.
     */
    close() {
        this.modal.setAttribute('hidden', '');
        document.body.style.overflow = '';
    }

    /**
     * Injects HTML into the modal content area.
     *
     * Affects: DOM innerHTML of the modal content container.
     */
    setContent(content) {
        const contentArea = this.modal.querySelector('#' + this.modal.id + 'Content');
        if (contentArea) {
            contentArea.innerHTML = content;
        }
    }
}

// Local Storage utilities.
// Wraps localStorage with JSON handling and error safety.
export const storage = {
    /**
     * Saves JSON data in localStorage.
     *
     * Affects: Browser localStorage.
     */
    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error('Error saving to localStorage:', error);
            return false;
        }
    },

    /**
     * Reads JSON data from localStorage.
     *
     * Affects: Browser localStorage (read only).
     */
    get(key) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (error) {
            console.error('Error reading from localStorage:', error);
            return null;
        }
    },

    /**
     * Removes a key from localStorage.
     *
     * Affects: Browser localStorage.
     */
    remove(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('Error removing from localStorage:', error);
            return false;
        }
    },

    /**
     * Clears all localStorage keys for this origin.
     *
     * Affects: Browser localStorage.
     */
    clear() {
        try {
            localStorage.clear();
            return true;
        } catch (error) {
            console.error('Error clearing localStorage:', error);
            return false;
        }
    }
};

// Fetch data with error handling.
// Returns a consistent { success, data | error } shape for callers.
/**
 * Fetches JSON data from a URL with error handling.
 *
 * Affects: Network (Fetch API) and returns parsed data.
 */
export async function fetchData(url) {
    try {
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return { success: true, data };
    } catch (error) {
        console.error('Error fetching data:', error);
        return { success: false, error: error.message };
    }
}

// Animate numbers counting up.
// Used for stats to create a simple count-up effect.
/**
 * Animates a number from start to end over time.
 *
 * Affects: DOM text content of the provided element.
 */
export function animateNumber(element, start, end, duration = 2000) {
    const range = end - start;
    const increment = range / (duration / 16); // 60fps
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
            current = end;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current);
    }, 16);
}

// Lazy loading for images.
// Uses IntersectionObserver for images with loading="lazy".
/**
 * Lazily loads images with loading="lazy" when they enter the viewport.
 *
 * Affects: DOM image src attributes and scroll performance behavior.
 */
export function lazyLoadImages() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }
}

// Initialize common functionality shared across all pages.
/**
 * Initializes shared behaviors on page load.
 *
 * Affects: DOM (year, navigation, lazy-loaded images).
 */
document.addEventListener('DOMContentLoaded', () => {
    setCurrentYear();
    initializeNavigation();
    lazyLoadImages();
});

export default {
    setCurrentYear,
    initializeNavigation,
    Modal,
    storage,
    fetchData,
    animateNumber,
    lazyLoadImages
};
