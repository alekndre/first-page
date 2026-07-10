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

/* ==== Podmiana grafik wg motywu ==== */
function syncThemeAssets() {
  const theme = document.documentElement.dataset.theme || 'dark';

  // loga partnerów
  document.querySelectorAll('.logo-marquee__item img').forEach(img => {
    img.src = img.src.replace(/partners-(light|dark)/, `partners-${theme}`);
  });

  // logo Montech w navbarze
  const logo = document.querySelector('.logo-img');
  if (logo) {
    logo.src = logo.src.replace(/logo_ms-(light|dark)/, `logo_ms-${theme}`);
  }
}

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

  syncThemeAssets(); // najpierw właściwe pliki, potem klonowanie je skopiuje

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

 console.log(`logo-marquee: ${totalCopies} kompletów`);

  // stała prędkość: licz dopiero, gdy WSZYSTKIE obrazki w tracku mają wymiary
  const SPEED = 35; // px na sekundę — pokrętło prędkości
  const imgs = [...track.querySelectorAll('img')];

  Promise.all(
    imgs.map(img => img.complete
      ? Promise.resolve()
      : new Promise(resolve => { img.onload = resolve; img.onerror = resolve; })
    )
  ).then(() => {
    const duration = (track.scrollWidth / 2) / SPEED;
    track.style.animationDuration = duration + 's';
    console.log(`logo-marquee: prędkość ustawiona, track = ${track.scrollWidth}px`);
  });
});

/* ==== Przełącznik motywu ==== */
const themeToggle = document.querySelector('.theme-toggle');
let themeAnimTimer;

themeToggle.addEventListener('click', () => {
  const root = document.documentElement;

  root.classList.add('theme-anim');
  clearTimeout(themeAnimTimer);
  themeAnimTimer = setTimeout(() => root.classList.remove('theme-anim'), 400);

  const next = root.dataset.theme === 'light' ? 'dark' : 'light';
  root.dataset.theme = next;
  localStorage.setItem('theme', next);
  syncThemeAssets();
});

// ---- Przełącznik języka ----
const translations = {
  pl: {
    nav_about: "O firmie",
    nav_services: "Usługi",
    nav_projects: "Projekty",
    nav_contact: "Kontakt",
    nav_certificate: "Certyfikaty",
    nav_galery: "Galeria",
    hero_subtitle: "Montaż i serwis instalacji",
  },
  en: {
    nav_about: "About us",
    nav_services: "Services",
    nav_projects: "Projects",
    nav_contact: "Contact",
    nav_certificate: "Certificates",
    nav_galery: "Galery",
    hero_subtitle: "Installation and maintenance services",
  },
};

function setLanguage(lang) {
  // podmień teksty we wszystkich oznaczonych elementach
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.dataset.i18n;
    if (translations[lang][key]) {
      el.textContent = translations[lang][key];
    }
  });

  // zaktualizuj podświetlenie PL/EN
  document.querySelectorAll(".lang-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.lang === lang);
  });

  // język dokumentu (dostępność + SEO)
  document.documentElement.lang = lang;

  // zapamiętaj wybór między podstronami i wizytami
  localStorage.setItem("lang", lang);
}

document.querySelectorAll(".lang-btn").forEach((btn) => {
  btn.addEventListener("click", () => setLanguage(btn.dataset.lang));
});

// przy wczytaniu strony: przywróć zapisany język
const savedLang = localStorage.getItem("lang") || "pl";
if (savedLang !== "pl") {
  setLanguage(savedLang);
}