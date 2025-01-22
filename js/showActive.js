const showContatcs = document.querySelector(".sect-ctt");
const btnShowSectContacts = document.querySelector(".show-sect");
const btnHamburger = document.querySelector(".hamburger");
const menuNav = document.querySelector("nav ul");

function toggleContacts(event) {
  event.preventDefault();
  showContatcs.classList.toggle("active");
  btnShowSectContacts.classList.toggle("active");
}

function toggleMenu(event) {
  event.preventDefault();
  menuNav.classList.toggle("active");
  btnHamburger.classList.toggle("active");
}

btnShowSectContacts.addEventListener("click", toggleContacts);
btnShowSectContacts.addEventListener("touchstart", toggleContacts);
btnHamburger.addEventListener("click", toggleMenu);
btnHamburger.addEventListener("touchstart", toggleMenu);
