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

/* ==== PASEK PARTNERZY: klonowanie logotypów do pełnej pętli ==== */
window.addEventListener('load', function () {
  const track = document.querySelector('.logo-marquee__track');
  if (!track) {
    console.warn('logo-marquee: nie znaleziono .logo-marquee__track');
    return;
  }

  const originals = [...track.children];
  const setWidth = track.scrollWidth; // szerokość jednego kompletu z gapami
  if (setWidth === 0) return;

  // ile kompletów potrzeba, żeby połowa tracku pokryła całe okno
  const perHalf = Math.max(1, Math.ceil(window.innerWidth / setWidth));
  const totalCopies = perHalf * 2; // parzysta liczba => -50% trafia w szew

  for (let c = 1; c < totalCopies; c++) {
    originals.forEach(el => {
      const clone = el.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      clone.querySelectorAll('img').forEach(i => i.setAttribute('alt', ''));
      track.appendChild(clone);
    });
  }

  // stała prędkość niezależna od szerokości okna i liczby klonów
  const SPEED = 35; // px na sekundę — pokrętło prędkości
  const duration = (track.scrollWidth / 2) / SPEED;
  track.style.animationDuration = duration + 's';
  
  console.log(`logo-marquee: ${totalCopies} kompletów, track = ${track.scrollWidth}px`);
});