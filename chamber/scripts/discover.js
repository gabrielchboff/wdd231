import { attractions } from "../data/discover.mjs";

// Set current year in footer
document.getElementById("year").textContent = new Date().getFullYear();

// Navigation toggle functionality
const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");

navToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", isOpen);
});

// -------- Visitor Message Logic --------
const visitorMessageSection = document.getElementById("visitorMessage");
const LAST_VISIT_KEY = "discoverLastVisit";

function getDaysBetween(date1, date2) {
  const msPerDay = 24 * 60 * 60 * 1000;
  return Math.floor(Math.abs(date2 - date1) / msPerDay);
}

function displayVisitorMessage() {
  const now = Date.now();
  const lastVisit = localStorage.getItem(LAST_VISIT_KEY);

  let message = "";
  if (!lastVisit) {
    // First visit
    message = "Welcome! Let us know if you have any questions.";
  } else {
    const lastVisitDate = parseInt(lastVisit, 10);
    const days = getDaysBetween(lastVisitDate, now);

    if (days === 0) {
      // Less than a day
      message = "Back so soon! Awesome! 😊";
    } else if (days === 1) {
      // Exactly one day
      message = "You last visited 1 day ago. 🙃";
    } else {
      // Multiple days
      message = `You last visited ${days} days ago. 👀`;
    }
  }

  const visitorMessageSection = document.getElementById("visitorMessage");
  const heading = document.createElement("h2");
  visitorMessageSection.appendChild(heading);
  heading.textContent = message;

  // Store the current visit date
  localStorage.setItem(LAST_VISIT_KEY, now.toString());
}

// -------- Render Attraction Cards --------
const grid = document.getElementById("attractionsGrid");

function createAttractionCard(attraction) {
  const card = document.createElement("article");
  card.className = "attraction-card";

  // Title
  const title = document.createElement("h2");
  title.textContent = attraction.name;

  // Figure/Image
  const figure = document.createElement("figure");
  const img = document.createElement("img");
  img.src = attraction.image;
  img.alt = attraction.name;
  img.loading = "lazy";
  img.width = 300;
  img.height = 200;

  // Add error handling for images
  img.onerror = function () {
    console.warn(`Failed to load image for ${attraction.name}`);
    // Display a placeholder background color instead
    figure.style.background =
      "linear-gradient(135deg, #e9ecef 0%, #dee2e6 100%)";
    figure.innerHTML = `<span style="color: #6c757d; font-size: 0.9rem; padding: 1rem; text-align: center;">Image unavailable</span>`;
  };

  figure.appendChild(img);

  // Address
  const address = document.createElement("address");
  address.textContent = attraction.address;

  // Description
  const desc = document.createElement("p");
  desc.textContent = attraction.description;

  // Button
  const button = document.createElement("a");
  button.className = "learn-more-btn";
  button.textContent = "Learn more";
  button.setAttribute("aria-label", `Learn more about ${attraction.name}`);
  button.setAttribute("href", attraction.url);
  button.setAttribute("target", "_blank");
  button.setAttribute("rel", "noopener noreferrer");

  // Assemble card
  card.appendChild(title);
  card.appendChild(figure);
  card.appendChild(address);
  card.appendChild(desc);
  card.appendChild(button);

  return card;
}

function renderAttractions() {
  grid.innerHTML = "";
  attractions.forEach((attraction) => {
    const card = createAttractionCard(attraction);
    grid.appendChild(card);
  });
}

// -------- On DOMContentLoaded --------
document.addEventListener("DOMContentLoaded", () => {
  displayVisitorMessage();
  renderAttractions();
});
