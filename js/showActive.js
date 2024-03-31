const showContatcs = document.querySelector('.sect-ctt');
const btnShowSectContacts = document.querySelector('.show-sect');
const btnHamburger = document.querySelector('.hamburger');
const menuNav = document.querySelector('nav ul');

btnShowSectContacts.addEventListener('click', (event) => {
    event.preventDefault(btnShowSectContacts);
    showContatcs.classList.toggle('active');
    btnShowSectContacts.classList.toggle('active');
});

btnHamburger.addEventListener('click', (event) => {
    event.preventDefault(btnHamburger);
    menuNav.classList.toggle('active');
    btnHamburger.classList.toggle('active');
});