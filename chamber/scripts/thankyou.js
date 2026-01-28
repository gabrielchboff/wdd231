// Thank You Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search);

    // Extract form data from URL
    const firstName = urlParams.get('firstName') || '';
    const lastName = urlParams.get('lastName') || '';
    const email = urlParams.get('email') || '';
    const mobile = urlParams.get('mobile') || '';
    const businessName = urlParams.get('businessName') || '';
    const timestamp = urlParams.get('timestamp') || '';

    // Display the data
    const displayName = document.getElementById('displayName');
    const displayEmail = document.getElementById('displayEmail');
    const displayMobile = document.getElementById('displayMobile');
    const displayBusiness = document.getElementById('displayBusiness');
    const displayTimestamp = document.getElementById('displayTimestamp');

    if (displayName) {
        displayName.textContent = `${firstName} ${lastName}`;
    }

    if (displayEmail) {
        displayEmail.textContent = email;
    }

    if (displayMobile) {
        displayMobile.textContent = mobile;
    }

    if (displayBusiness) {
        displayBusiness.textContent = businessName;
    }

    if (displayTimestamp && timestamp) {
        // Format the timestamp for better readability
        const date = new Date(timestamp);
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        };
        displayTimestamp.textContent = date.toLocaleString('en-US', options);
    }

    // If no data is present, redirect to join page
    if (!firstName || !lastName || !email || !mobile || !businessName) {
        console.warn('Missing form data, redirecting to join page...');
        // Optionally redirect after a delay
        // setTimeout(() => {
        //     window.location.href = 'join.html';
        // }, 3000);
    }

    // Update year in footer
    const yearElement = document.getElementById('year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
});
