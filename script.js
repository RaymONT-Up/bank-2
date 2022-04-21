"use strict";

const modalWindow = document.querySelector(".modal-window"),
  overlay = document.querySelector(".overlay"),
  btnCloseModalWindow = document.querySelector(".btn--close-modal-window"),
  btnsOpenModalWindow = document.querySelectorAll(".btn--show-modal-window");

const btnSrollTo = document.querySelector(".btn--scroll-to"),
  section1 = document.querySelector("#section--1");

const tabs = document.querySelectorAll(".operations__tab"),
  tabContainer = document.querySelector(".operations__tab-container"),
  tabsContents = document.querySelectorAll(".operations__content");

const navContainer = document.querySelector(".nav");
const header = document.querySelector(".header");

const allSection = document.querySelectorAll(".section");

/////////
// Modals

const openModalWindow = function (e) {
  e.preventDefault();
  modalWindow.classList.remove("hidden");
  overlay.classList.remove("hidden");
};
const closeModalWindow = function () {
  modalWindow.classList.add("hidden");
  overlay.classList.add("hidden");
};
// show Modal Window
btnsOpenModalWindow.forEach(w => {
  w.addEventListener("click", openModalWindow);

  btnCloseModalWindow.addEventListener("click", closeModalWindow);
  overlay.addEventListener("click", closeModalWindow);

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !modalWindow.classList.contains("hidden"))
      closeModalWindow();
  });
});

/////////
// Scroll to

btnSrollTo.addEventListener("click", e =>
  section1.scrollIntoView({ behavior: "smooth" })
);
document.querySelector(".nav__links").addEventListener("click", function (e) {
  e.preventDefault();
  if (e.target.classList.contains("nav__link")) {
    const href = e.target.getAttribute("href");
    if (e.target.classList.contains("btn--show-modal-window")) return;
    document.querySelector(href).scrollIntoView({ behavior: "smooth" });
  }
});

/////////
// Tabs

tabContainer.addEventListener("click", e => {
  const clickedButton = e.target.closest(".operations__tab");

  // Guard clause - if clickedButton haven't(undefined or null) we stop a func.
  if (!clickedButton) return;

  // Delete Active classes on tab btn and tab content
  tabs.forEach(tab => tab.classList.remove("operations__tab--active"));
  tabsContents.forEach(tabContent =>
    tabContent.classList.remove("operations__content--active")
  );

  // Add active classes
  clickedButton.classList.add("operations__tab--active");
  document
    .querySelector(`.operations__content--${clickedButton.dataset.tab}`)
    .classList.add("operations__content--active");
});

/////////
// Nav links fade animation

const navLinksHoverAnimation = function (event) {
  if (event.target.classList.contains("nav__link")) {
    const linkOver = event.target;
    const siblingLinks = linkOver
      .closest(".nav__links")
      .querySelectorAll(".nav__link");
    const logo = linkOver.closest(".nav").querySelector("img");
    const logoText = linkOver.closest(".nav").querySelector(".nav__text");
    siblingLinks.forEach(el => {
      if (el !== linkOver) el.style.opacity = this;
      logo.style.opacity = this;
      logoText.style.opacity = this;
    });
  }
};
navContainer.addEventListener("mouseover", navLinksHoverAnimation.bind(0.4));
navContainer.addEventListener("mouseout", navLinksHoverAnimation.bind(1));

/////////
// Header nav sticky

const navHeight = navContainer.getBoundingClientRect().height;
const getSctickyNav = function (entries) {
  const entry = entries[0];
  if (!entry.isIntersecting) navContainer.classList.add("sticky");
  else navContainer.classList.remove("sticky");
};
const headerObserver = new IntersectionObserver(getSctickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});
headerObserver.observe(header);

/////////
// Appearance  sections
// const appearanceSection = function (entries, observer) {
//   const entry = entries[0];
//   if (!entry.isIntersecting) return;
//   entry.target.classList.remove("section--hidden");
//   observer.unobserve(entry.target);
// };
// const sectionObserver = new IntersectionObserver(appearanceSection, {
//   root: null,
//   threshold: 0.1,
// });

// allSection.forEach(section => {
//   sectionObserver.observe(section);
//   section.classList.add("section--hidden");
// });

/////////
// Lazy Loading

const lazyImages = document.querySelectorAll("img[data-src]");

const loadImages = function (entries, observer) {
  const entry = entries[0];

  if (!entry.isIntersecting) return;

  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener("load", () =>
    entry.target.classList.remove("lazy-img")
  );
  observer.unobserve(entry.target);
};

const lazyImagesObserver = new IntersectionObserver(loadImages, {
  root: null,
  threshold: 0.8,
});

lazyImages.forEach(image => lazyImagesObserver.observe(image));

/////////
// Slider
let currentSlide = 0;
const slides = document.querySelectorAll(".slide");
const slidesNumber = slides.length;
const btnLeftSlide = document.querySelector(".slider__btn--left");
const btnRightSlide = document.querySelector(".slider__btn--right");
const dotsContainer = document.querySelector(".dots");

const createDots = function () {
  slides.forEach((_, index) => {
    dotsContainer.insertAdjacentHTML(
      "beforeend",
      `<button class="dots__btn" data-slide="${index}"></button>`
    );
  });
};
createDots();
const activateCurrentDot = function (slide) {
  document
    .querySelectorAll(".dots__btn")
    .forEach(dot => dot.classList.remove("dots__btn--active"));

  document
    .querySelector(`.dots__btn[data-slide="${slide}"`)
    .classList.add("dots__btn--active");
};
activateCurrentDot(currentSlide);

const moveToSlide = function (slide) {
  slides.forEach(
    (s, index) => (s.style.transform = `translateX(${(index - slide) * 100}%)`)
  );
};

const nextSlide = function () {
  slidesNumber - 1 === currentSlide ? (currentSlide = 0) : currentSlide++;
  moveToSlide(currentSlide);
  activateCurrentDot(currentSlide);
};
const previousSlide = function () {
  currentSlide === 0 ? (currentSlide = slidesNumber - 1) : currentSlide--;
  moveToSlide(currentSlide);
  activateCurrentDot(currentSlide);
};
moveToSlide(0);

btnRightSlide.addEventListener("click", nextSlide);
btnLeftSlide.addEventListener("click", previousSlide);

document.addEventListener("keydown", e => {
  if (e.key === "ArrowRight") nextSlide();
  if (e.key === "ArrowLeft") previousSlide();
});

dotsContainer.addEventListener("click", e => {
  if (e.target.classList.contains("dots__btn")) {
    const slide = e.target.dataset.slide;
    moveToSlide(slide);
    activateCurrentDot(slide);
  }
});

/////////////
