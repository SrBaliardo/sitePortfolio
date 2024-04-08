const textAbout = document.querySelector('.text-about')
const textInitHeight = textAbout.clientHeight
const overflow = document.getElementById('overflow')
const btnShowMore = document.getElementById('toggle')

function toggle(event) {
    event.preventDefault()
    textAbout.style.maxHeight = event.target.dataset.state === 'more' ? `${textAbout.scrollHeight}px` : `${textInitHeight}px`
    event.target.setAttribute(
        'data-state',
        event.target.dataset.state === 'more' ? 'less' : 'more'
    )

    event.target.innerHTML = event.target.dataset.state === 'more' ? 'Ver mais...' : '...Ver menos'

    overflow.setAttribute(
        'data-state',
        event.target.dataset.state === 'more' ? 'visible' : 'hidden'
    )
}

btnShowMore.addEventListener('click', toggle)
btnShowMore.addEventListener('touchstart', toggle)