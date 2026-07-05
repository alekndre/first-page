const slajdy = document.querySelectorAll('.hero-slajd');
let aktualny = 0;

setInterval(() => {
  slajdy[aktualny].classList.remove('aktywny');       // schowaj obecny
  aktualny = (aktualny + 1) % slajdy.length;          // przejdź do następnego (z zawinięciem)
  slajdy[aktualny].classList.add('aktywny');          // pokaż nowy
}, 5000);  // co 5000 ms = 5 sekund