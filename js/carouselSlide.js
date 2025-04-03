const carouselBox = document.querySelector(".box-project");
const carousel = document.querySelector(".box-cards");
const btnPrevNext = document.querySelectorAll(".btn-nav");
const firstCardWidth = 320;

let draggingOn = false,
  startX,
  startScrollLeft;

function slideCard(direction) {
  carousel.style.scrollBehavior = "smooth";

  if (direction === "right") {
    if (
      carousel.scrollLeft + firstCardWidth >=
      carousel.scrollWidth - carousel.clientWidth
    ) {
      carousel.scrollLeft = 0;
    } else {
      carousel.scrollLeft += firstCardWidth;
    }
  } else if (direction === "left") {
    if (carousel.scrollLeft - firstCardWidth < 0) {
      carousel.scrollLeft = carousel.scrollWidth - carousel.clientWidth;
    } else {
      carousel.scrollLeft -= firstCardWidth;
    }
  }
}

btnPrevNext.forEach((btn) => {
  btn.addEventListener("click", () => {
    slideCard(btn.id === "left" ? "left" : "right");
  });
});

const dragStart = (event) => {
  draggingOn = true;
  startX = event.pageX;
  startScrollLeft = carousel.scrollLeft;

  carousel.style.scrollBehavior = "auto";
};

const dragging = (event) => {
  if (!draggingOn) return;
  carousel.scrollLeft = startScrollLeft - (event.pageX - startX);
};

const dragStop = () => {
  draggingOn = false;

  carousel.style.scrollBehavior = "smooth";
};

carousel.addEventListener("mousedown", dragStart);
carousel.addEventListener("mousemove", dragging);
document.addEventListener("mouseup", dragStop);

let autoSlideInterval = setInterval(() => {
  slideCard("right");
}, 1800);

carouselBox.addEventListener("mouseenter", () => {
  clearInterval(autoSlideInterval);
});

carouselBox.addEventListener("mouseleave", () => {
  autoSlideInterval = setInterval(() => {
    slideCard("right");
  }, 1800);
});
