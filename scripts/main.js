// ============================================
// WDD 231 - Course Home Page - Main JavaScript
// ============================================

// ============================================
// NAVIGATION - Hamburger Menu Toggle
// ============================================
document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.getElementById("menu-toggle");
  const nav = document.getElementById("main-nav");

  if (menuToggle && nav) {
    menuToggle.addEventListener("click", () => {
      const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
      menuToggle.setAttribute("aria-expanded", !isExpanded);
      nav.classList.toggle("open");
    });
  }
});

// ============================================
// COURSES - Data, Display, Filter and Modal
// ============================================

// Course Array
const courses = [
  {
    subject: "CSE",
    number: 110,
    title: "Introduction to Programming",
    credits: 2,
    certificate: "Web and Computer Programming",
    description:
      "This course will introduce students to programming and problem solving.",
    technology: ["Python"],
    completed: true,
  },
  {
    subject: "WDD",
    number: 130,
    title: "Web Fundamentals",
    credits: 2,
    certificate: "Web and Computer Programming",
    description:
      "This course introduces students to the World Wide Web and web development.",
    technology: ["HTML", "CSS"],
    completed: true,
  },
  {
    subject: "CSE",
    number: 111,
    title: "Programming with Functions",
    credits: 2,
    certificate: "Web and Computer Programming",
    description:
      "Students learn to write, test, and debug functions.",
    technology: ["Python"],
    completed: true,
  },
  {
    subject: "WDD",
    number: 231,
    title: "Frontend Web Development I",
    credits: 2,
    certificate: "Web and Computer Programming",
    description:
      "Focus on UX, accessibility, performance, and APIs.",
    technology: ["HTML", "CSS", "JavaScript"],
    completed: false,
  },
];

// ============================================
// MODAL - Display Course Details
// ============================================
function displayCourseDetails(course) {
  const courseDetails = document.getElementById(`course-details${course.subject}`);
  const currentModal = document.getElementById(`modal${course.subject}${course.number}`);

  courseDetails.innerHTML = `
    <button id="closeModal${course.number}">❌</button>
    <h2>${course.subject} ${course.number}</h2>
    <h3>${course.title}</h3>
    <p><strong>Credits:</strong> ${course.credits}</p>
    <p><strong>Certificate:</strong> ${course.certificate}</p>
    <p>${course.description}</p>
    <p><strong>Technologies:</strong> ${course.technology.join(", ")}</p>
  `;

  courseDetails.showModal();


  const closeModal = document.getElementById(`closeModal${course.number}`);
  closeModal.addEventListener("click", () => {
    courseDetails.close();
  });
}

// ============================================
// Display Course Cards
// ============================================
function displayCourses(filteredCourses) {
  const container = document.getElementById("course-cards");
  if (!container) return;

  container.innerHTML = "";

  filteredCourses.forEach((course) => {
    const card = document.createElement("div");
    card.className = `course-card ${course.completed ? "completed" : ""}`;

    card.innerHTML = `
    <div id="modal${course.subject}${course.number}">
      <h3>${course.subject} ${course.number}</h3>
      <p>${course.title}</p>
      <p>${course.credits} Credits</p>
      ${course.completed ? "<p>✓ Completed</p>" : "<p>In Progress</p>"}
      <dialog id="course-details${course.subject}"></dialog>
    </div>

    `;

    // 🔥 CHAMADA DO MODAL AQUI
    card.addEventListener("click", () => {
      displayCourseDetails(course);
    });

    container.appendChild(card);
  });

  updateTotalCredits(filteredCourses);
}

// ============================================
// Total Credits
// ============================================
function updateTotalCredits(filteredCourses) {
  const total = filteredCourses.reduce(
    (sum, course) => sum + course.credits,
    0
  );

  const totalCredits = document.getElementById("total-credits");
  if (totalCredits) {
    totalCredits.textContent = total;
  }
}

// ============================================
// Filter Courses
// ============================================
function filterCourses(subject) {
  if (subject === "all") return courses;
  return courses.filter((course) => course.subject === subject);
}

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener("DOMContentLoaded", () => {
  displayCourses(courses);

  const filterButtons = document.querySelectorAll(".filter-btn");
  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const filter = btn.dataset.filter;
      const filteredCourses = filterCourses(filter);
      displayCourses(filteredCourses);
    });
  });
});

// ============================================
// FOOTER DATES
// ============================================
document.addEventListener("DOMContentLoaded", () => {
  const year = document.getElementById("currentyear");
  if (year) year.textContent = new Date().getFullYear();

  const modified = document.getElementById("lastModified");
  if (modified)
    modified.textContent = `Last Modified: ${document.lastModified}`;
});
