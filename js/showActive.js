const showContatcs = document.querySelector('.sect-ctt');
const btnShowSectContacts = document.querySelector('.show-sect');
const btnHamburger = document.querySelector('.hamburger');
const menuNav = document.querySelector('nav ul');

function toggleContacts(event) {

}

function toggleMenu(event) {

}

btnShowSectContacts.addEventListener('click', (event) => {
    event.preventDefault();
    showContatcs.classList.toggle('active');
    btnShowSectContacts.classList.toggle('active');
});
btnShowSectContacts.addEventListener('touchstart', (event) => {
    event.preventDefault();
    showContatcs.classList.toggle('active');
    btnShowSectContacts.classList.toggle('active');
});

btnHamburger.addEventListener('click', (event) => {
    event.preventDefault();
    menuNav.classList.toggle('active');
    btnHamburger.classList.toggle('active');
});
btnHamburger.addEventListener('touchstart', (event) => {
    event.preventDefault();
    menuNav.classList.toggle('active');
    btnHamburger.classList.toggle('active');
});