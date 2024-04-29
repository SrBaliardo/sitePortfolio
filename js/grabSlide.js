const carouselBox = document.querySelector('.box-project')
const carousel = document.querySelector('.box-cards')
const btnPrevNext = document.querySelectorAll('.btn-nav')
const firstCardWidth = 320
let draggingOn = false, startX, startScrollLeft

btnPrevNext.forEach(btn => {
    btn.addEventListener('click', () => {
        carousel.scrollLeft += btn.id ==='left' ? -firstCardWidth : firstCardWidth
    })
})

const dragStart = (event) => {
    draggingOn = true
    startX = event.pageX
    startScrollLeft = carousel.scrollLeft
}

const dragging = (event) => {
    if(!draggingOn) return
    carousel.scrollLeft = startScrollLeft - (event.pageX - startX)
}

const dragStop = () => {
    draggingOn = false
}

carousel.addEventListener('mousedown', dragStart)
carousel.addEventListener('mousemove', dragging)
document.addEventListener('mouseup', dragStop)