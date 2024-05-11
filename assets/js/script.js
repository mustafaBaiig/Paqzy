'use strict';

document.addEventListener("DOMContentLoaded", function () {
  /**
   * Navbar toggle
   */
  const overlay = document.querySelector("[data-overlay]");
  const navOpenBtn = document.querySelector("[data-nav-open-btn]");
  const navbar = document.querySelector("[data-navbar]");
  const navCloseBtn = document.querySelector("[data-nav-close-btn]");

  const navElemArr = [overlay, navOpenBtn, navCloseBtn];

  for (let i = 0; i < navElemArr.length; i++) {
    navElemArr[i].addEventListener("click", function () {
      navbar.classList.toggle("active");
      overlay.classList.toggle("active");
    });
  }

  /**
   * Add active class on header when scrolled 200px from top
   */
  const header = document.querySelector("[data-header]");

  window.addEventListener("scroll", function () {
    window.scrollY >= 200 ? header.classList.add("active")
      : header.classList.remove("active");
  });

  /**
   * "Sign in" button functionality
   */
  const signinBtn = document.getElementById("signin-btn");
  const signinModal = document.getElementById("signin-modal");
  const signinCloseBtn = signinModal.querySelector(".close-btn");

  // Open sign-in modal when the button is clicked
  signinBtn.addEventListener("click", function () {
    signinModal.style.display = "block";
  });

  // Close sign-in modal when the close button is clicked
  signinCloseBtn.addEventListener("click", function () {
    signinModal.style.display = "none";
  });

  // Close sign-in modal when user clicks outside the modal
  window.addEventListener("click", function (event) {
    if (event.target == signinModal) {
      signinModal.style.display = "none";
    }
  });

  // Prevent the modal from closing when clicking inside it
  signinModal.addEventListener("click", function (event) {
    event.stopPropagation();
  });

  // Handle sign-in form submission
  const signinForm = document.getElementById("signin-form-modal");

  signinForm.addEventListener("submit", function (event) {
    event.preventDefault();
    // Your sign-in form submission logic here
  });
});
