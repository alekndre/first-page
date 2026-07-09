// ---- Pokaz slajdów ----
const slides = document.querySelectorAll('.hero-slide');
let current = 0;

setInterval(() => {
  slides[current].classList.remove('active');
  current = (current + 1) % slides.length;
  slides[current].classList.add('active');
}, 5000);

// ---- Menu hamburgerowe ----
const hamburger = document.querySelector('.hamburger');
const menu = document.querySelector('.nav-links');
let scrollOpen = 0;

hamburger.addEventListener('click', () => {
  menu.classList.toggle('open');
  scrollOpen = window.scrollY;
});

window.addEventListener('scroll', () => {
  if (Math.abs(window.scrollY - scrollOpen) > 60) {
    menu.classList.remove('open');
  }
});

// ---- Chowanie linków przy zawijaniu ----
function checkNavbar() {
  menu.classList.remove('open');
  menu.classList.remove('collapsed');
  const links = menu.querySelectorAll('a');
  const first = links[0].offsetTop;
  const last = links[links.length - 1].offsetTop;
  if (last > first) {
    menu.classList.add('collapsed');
  }
}

window.addEventListener('resize', checkNavbar);
checkNavbar();