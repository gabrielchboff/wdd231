// ============================================
// WDD 231 - Course Home Page - Main JavaScript
// Consolidated: Navigation, Courses, and Dates
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

      // Toggle aria-expanded attribute
      menuToggle.setAttribute("aria-expanded", !isExpanded);

      // Toggle navigation visibility
      nav.classList.toggle("open");

      // Animate hamburger icon
      const spans = menuToggle.querySelectorAll("span");
      if (nav.classList.contains("open")) {
        spans[0].style.transform = "rotate(45deg) translateY(10px)";
        spans[1].style.opacity = "0";
        spans[2].style.transform = "rotate(-45deg) translateY(-10px)";
      } else {
        spans[0].style.transform = "none";
        spans[1].style.opacity = "1";
        spans[2].style.transform = "none";
      }
    });

    // Close menu when clicking outside
    document.addEventListener("click", (e) => {
      if (!nav.contains(e.target) && !menuToggle.contains(e.target)) {
        if (nav.classList.contains("open")) {
          nav.classList.remove("open");
          menuToggle.setAttribute("aria-expanded", "false");
          const spans = menuToggle.querySelectorAll("span");
          spans[0].style.transform = "none";
          spans[1].style.opacity = "1";
          spans[2].style.transform = "none";
        }
      }
    });

    // Close menu on window resize to larger screens
    window.addEventListener("resize", () => {
      if (window.innerWidth >= 768) {
        nav.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
        const spans = menuToggle.querySelectorAll("span");
        spans[0].style.transform = "none";
        spans[1].style.opacity = "1";
        spans[2].style.transform = "none";
      }
    });

    // Close menu when a nav link is clicked
    const navLinks = nav.querySelectorAll("a");
    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        if (window.innerWidth < 768) {
          nav.classList.remove("open");
          menuToggle.setAttribute("aria-expanded", "false");
          const spans = menuToggle.querySelectorAll("span");
          spans[0].style.transform = "none";
          spans[1].style.opacity = "1";
          spans[2].style.transform = "none";
        }
      });
    });
  }
});

// ============================================
// COURSES - Data, Display, and Filter
// ============================================

// Course Array - Web and Computer Programming Certificate
const courses = [
  {
    subject: "CSE",
    number: 110,
    title: "Introduction to Programming",
    credits: 2,
    certificate: "Web and Computer Programming",
    description:
      "This course will introduce students to programming. It will introduce the building blocks of programming languages (variables, decisions, calculations, loops, array, and input/output) and use them to solve problems.",
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
      "This course introduces students to the World Wide Web and to careers in web site design and development. The course is hands-on with students actually participating in simple web designs and programming. It is anticipated that students who complete this course will understand the fields of web design and development and will have a good idea if they want to pursue this degree as a major.",
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
      "CSE 111 students become more organized, efficient, and powerful computer programmers by learning to research and call functions written by others; to write, call, debug, and test their own functions; and to handle errors within functions. CSE 111 students write programs with functions to solve problems in many disciplines, including business, physical science, human performance, and humanities.",
    technology: ["Python"],
    completed: true,
  },
  {
    subject: "CSE",
    number: 210,
    title: "Programming with Classes",
    credits: 2,
    certificate: "Web and Computer Programming",
    description:
      "This course will introduce the notion of classes and objects. It will present encapsulation at a conceptual level. It will also work with inheritance and polymorphism.",
    technology: ["C#"],
    completed: true,
  },
  {
    subject: "WDD",
    number: 131,
    title: "Dynamic Web Fundamentals",
    credits: 2,
    certificate: "Web and Computer Programming",
    description:
      "This course builds on prior experience in Web Fundamentals and programming. Students will learn to create dynamic websites that use JavaScript to respond to events, update content, and create responsive user experiences.",
    technology: ["HTML", "CSS", "JavaScript"],
    completed: true,
  },
  {
    subject: "WDD",
    number: 231,
    title: "Frontend Web Development I",
    credits: 2,
    certificate: "Web and Computer Programming",
    description:
      "This course builds on prior experience with Dynamic Web Fundamentals and programming. Students will focus on user experience, accessibility, compliance, performance optimization, and basic API usage.",
    technology: ["HTML", "CSS", "JavaScript"],
    completed: false,
  },
];

// Display course cards
function displayCourses(filteredCourses) {
  const courseCardsContainer = document.getElementById("course-cards");

  if (!courseCardsContainer) return;

  courseCardsContainer.innerHTML = "";

  filteredCourses.forEach((course) => {
    const courseCard = document.createElement("div");
    courseCard.className = `course-card ${course.completed ? "completed" : ""}`;

    courseCard.innerHTML = `
            <h3>${course.subject} ${course.number}</h3>
            <p>${course.title}</p>
            <p>${course.credits} Credits</p>
            ${course.completed ? "<p>✓ Completed</p>" : "<p>In Progress</p>"}
        `;

    courseCardsContainer.appendChild(courseCard);
  });

  // Update total credits
  updateTotalCredits(filteredCourses);
}

// Calculate and display total credits using reduce
function updateTotalCredits(filteredCourses) {
  const totalCredits = filteredCourses.reduce((total, course) => {
    return total + course.credits;
  }, 0);

  const totalCreditsElement = document.getElementById("total-credits");
  if (totalCreditsElement) {
    totalCreditsElement.textContent = totalCredits;
  }
}

// Filter courses by subject
function filterCourses(subject) {
  if (subject.toLowerCase() === "all") {
    return courses;
  }
  return courses.filter((course) => course.subject === subject);
}

// Initialize courses
document.addEventListener("DOMContentLoaded", () => {
  // Display all courses initially
  displayCourses(courses);

  // Set up filter buttons
  const filterButtons = document.querySelectorAll(".filter-btn");

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      // Remove active class from all buttons
      filterButtons.forEach((btn) => btn.classList.remove("active"));

      // Add active class to clicked button
      button.classList.add("active");

      // Get filter value
      const filter = button.getAttribute("data-filter");

      // Filter and display courses
      const filteredCourses = filterCourses(filter);
      displayCourses(filteredCourses);
    });
  });
});

// ============================================
// DATES - Current Year and Last Modified
// ============================================
document.addEventListener("DOMContentLoaded", () => {
  // Set current year in footer
  const currentYearElement = document.getElementById("currentyear");
  if (currentYearElement) {
    const currentYear = new Date().getFullYear();
    currentYearElement.textContent = currentYear;
  }

  // Set last modified date
  const lastModifiedElement = document.getElementById("lastModified");
  if (lastModifiedElement) {
    const lastModified = document.lastModified;
    lastModifiedElement.textContent = `Last Modified: ${lastModified}`;
  }
});
