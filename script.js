// ---- Pokaz slajdów ----
const slajdy = document.querySelectorAll('.hero-slajd');
let aktualny = 0;

setInterval(() => {
  slajdy[aktualny].classList.remove('aktywny');
  aktualny = (aktualny + 1) % slajdy.length;
  slajdy[aktualny].classList.add('aktywny');
}, 5000);

// ---- Menu hamburgerowe ----
const hamburger = document.querySelector('.hamburger');
const menu = document.querySelector('.pasek-linki');
let scrollOtwarcia = 0;

hamburger.addEventListener('click', () => {
  menu.classList.toggle('otwarte');
  scrollOtwarcia = window.scrollY;
});

window.addEventListener('scroll', () => {
  if (Math.abs(window.scrollY - scrollOtwarcia) > 60) {
    menu.classList.remove('otwarte');
  }
});

// ---- Chowanie linków przy zawijaniu ----
function sprawdzPasek() {
  menu.classList.remove('otwarte');
  menu.classList.remove('zwiniete');
  const linki = menu.querySelectorAll('a');
  const pierwszy = linki[0].offsetTop;
  const ostatni = linki[linki.length - 1].offsetTop;
  if (ostatni > pierwszy) {
    menu.classList.add('zwiniete');
  }
}

window.addEventListener('resize', sprawdzPasek);
sprawdzPasek();