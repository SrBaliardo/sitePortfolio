const btnToTop = document.querySelector('.btn-top')

function toTop(event) {
    event.preventDefault()
    window.scrollTo({top: 0, behavior: 'smooth'})
}

btnToTop.addEventListener('click', toTop)
btnToTop.addEventListener('touchstart', toTop)