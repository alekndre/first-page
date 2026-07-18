// ---- Preferencja reduced motion (używana w kilku miejscach) ----
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ---- Pokaz slajdów ----
const slides = document.querySelectorAll('.hero-slide');
let current = 0;

if (slides.length) {
  setInterval(() => {
    slides[current].classList.remove('active');
    current = (current + 1) % slides.length;
    slides[current].classList.add('active');
  }, 5000);
}

// ---- Menu hamburgerowe ----
const hamburger = document.querySelector('.hamburger');
const menu = document.querySelector('.nav-links');
let scrollOpen = 0;

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

if (hamburger && menu) {
  hamburger.addEventListener('click', () => {
    menu.classList.toggle('open');
    scrollOpen = window.scrollY;
  });

  window.addEventListener('scroll', () => {
    if (Math.abs(window.scrollY - scrollOpen) > 60) {
      menu.classList.remove('open');
    }
  });

  window.addEventListener('resize', checkNavbar);
  checkNavbar();
}

/* ==== Podmiana grafik wg motywu ==== */
function syncThemeAssets() {
  const theme = document.documentElement.dataset.theme || 'dark';

  // loga partnerów
  document.querySelectorAll('.logo-marquee__item img').forEach(img => {
    img.src = img.src.replace(/partners-(light|dark)/, `partners-${theme}`);
  });

  // logo Montech (navbar + ewentualnie stopka)
  document.querySelectorAll('.logo-img, .footer-logo').forEach(logo => {
    logo.src = logo.src.replace(/logo_ms-(light|dark)/, `logo_ms-${theme}`);
  });
}

syncThemeAssets();

/* ==== PASEK PARTNERZY: klonowanie logotypów do pełnej pętli ==== */
window.addEventListener('load', function () {
  syncThemeAssets();

  const track = document.querySelector('.logo-marquee__track');
  const originals = [...track.children];
  const setWidth = track.scrollWidth; // szerokość jednego kompletu z gapami
  if (setWidth === 0) return;

  // ile kompletów potrzeba, żeby połowa tracku pokryła całe okno
  const perHalf = Math.max(1, Math.ceil(window.innerWidth / setWidth));
  const totalCopies = perHalf * 8; // parzysta liczba => -50% trafia w szew

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

if (themeToggle) {
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
}

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
  applyAriaI18n(lang);
}

document.querySelectorAll(".lang-btn").forEach((btn) => {
  btn.addEventListener("click", () => setLanguage(btn.dataset.lang));
});

// przy wczytaniu strony: przywróć zapisany język
const savedLang = localStorage.getItem("lang") || "en";
setLanguage(savedLang);

/* ==== Strefy: wejście przy scrollu ==== */
const zones = document.querySelectorAll('.zone');

const zoneObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      zoneObserver.unobserve(entry.target); // animacja tylko raz
    }
  });
}, { threshold: 0.25 }); // odpala, gdy 1/4 strefy jest widoczna

zones.forEach(z => zoneObserver.observe(z));

/* ==== Strefa 02: lista usług steruje podglądem ==== */
const svcLinks = document.querySelectorAll('.svc');
const svcImgs = document.querySelectorAll('.svc-img');

svcLinks.forEach(link => {
  link.addEventListener('mouseenter', () => {
    svcImgs.forEach(img => img.classList.remove('active'));
    svcImgs[Number(link.dataset.img)].classList.add('active');
    svcLinks.forEach(l => l.classList.remove('hot'));
    link.classList.add('hot');
  });
});

/* ==== Strefa 03: mini-slider projektów ==== */
const projSlides = document.querySelectorAll('.slider .slide');
const projCount = document.querySelector('.slider-count');
let projIndex = 0;

document.querySelectorAll('.slider-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    projSlides[projIndex].classList.remove('active');
    projIndex = (projIndex + Number(btn.dataset.dir) + projSlides.length) % projSlides.length;
    projSlides[projIndex].classList.add('active');
    projCount.textContent = `${projIndex + 1} / ${projSlides.length}`;
  });
});

/* ==== Statystyki: tilt 3D za kursorem ==== */
// const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!reduceMotion) {
  document.querySelectorAll('.stat').forEach(stat => {
    stat.addEventListener('mousemove', (e) => {
      const r = stat.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;   // 0..1
      const y = (e.clientY - r.top) / r.height;

      const rotY = (x - 0.5) * 14;   // maks. ±7 stopni
      const rotX = (0.5 - y) * 14;

      stat.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`;
      stat.style.setProperty('--mx', `${x * 100}%`);
      stat.style.setProperty('--my', `${y * 100}%`);
      stat.classList.add('tilting');
    });

    stat.addEventListener('mouseleave', () => {
      stat.style.transform = '';
      stat.classList.remove('tilting');
    });
  });
}

/* ==== Scroll progress bar ==== */
const progressBar = document.querySelector('.scroll-progress');

if (progressBar) {
  window.addEventListener('scroll', () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
  }, { passive: true });
}

/* ==== Dot nav: active section ==== */
const dots = document.querySelectorAll('.dot');

if (dots.length) {
  const dotObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        dots.forEach(d => d.classList.remove('active'));
        const dot = document.querySelector(`.dot[href="#${entry.target.id}"]`);
        if (dot) dot.classList.add('active');
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.hero, #zone-about, #zone-services, #zone-projects')
    .forEach(z => dotObserver.observe(z));
}

/* ==== i18n for aria-labels ==== */
// wywoływane też z setLanguage — patrz punkt 4
function applyAriaI18n(lang) {
  document.querySelectorAll('[data-i18n-aria]').forEach(el => {
    const key = el.dataset.i18nAria;
    if (translations[lang][key]) {
      el.setAttribute('aria-label', translations[lang][key]);
    }
  });
}

/* ==== Favicon wg motywu systemu ==== */
const faviconLink = document.querySelector('link[rel="icon"]');
const systemDark = window.matchMedia('(prefers-color-scheme: dark)');

function syncFavicon() {
  const oldLink = document.querySelector('link[rel="icon"]');
  if (!oldLink) return;
  const newLink = oldLink.cloneNode();
  newLink.href = systemDark.matches
    ? 'img/favicon/favicon-dark.png'
    : 'img/favicon/favicon-light.png';
  oldLink.replaceWith(newLink);
}

systemDark.addEventListener('change', syncFavicon);
syncFavicon();

/* ==== Projects timeline: active project on scroll ==== */
const projects = document.querySelectorAll(".project");
const timelineLinks = document.querySelectorAll(".project-timeline__link");

if (projects.length && timelineLinks.length) {
  const updateActiveProject = () => {
    let activeProjectId = projects[0].id;
    const activationPoint = window.innerHeight * 0.35;

    projects.forEach((project) => {
      const projectTop = project.getBoundingClientRect().top;

      if (projectTop <= activationPoint) {
        activeProjectId = project.id;
      }
    });

    timelineLinks.forEach((link) => {
      const linkedProjectId = link.getAttribute("href").replace("#", "");
      const timelineItem = link.closest(".project-timeline__item");

      if (!timelineItem) return; // np. "Future projects" — nie jest pozycją na osi

      link.classList.toggle("active", linkedProjectId === activeProjectId);
      timelineItem.classList.toggle(
        "completed",
        isProjectBeforeOrActive(linkedProjectId, activeProjectId)
      );
    });
  };

  const isProjectBeforeOrActive = (projectId, activeProjectId) => {
    const projectIds = [...projects].map((project) => project.id);

    return projectIds.indexOf(projectId) <= projectIds.indexOf(activeProjectId);
  };

  window.addEventListener("scroll", updateActiveProject, { passive: true });
  window.addEventListener("load", updateActiveProject);
}

/* ==== Expandable project descriptions ==== */
const projectDescriptionButtons = document.querySelectorAll(
  ".project-details__toggle"
);

projectDescriptionButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const descriptionId = button.getAttribute("aria-controls");
    const description = document.getElementById(descriptionId);
    const isExpanded = button.getAttribute("aria-expanded") === "true";

    description.classList.toggle("expanded", !isExpanded);
    button.setAttribute("aria-expanded", String(!isExpanded));

    // klucz zależny od stanu + tekst z aktualnego języka
    const key = isExpanded ? "read_more" : "show_less";
    const lang = document.documentElement.lang || "en";
    button.dataset.i18n = key;
    button.textContent = translations[lang][key];
  });
});