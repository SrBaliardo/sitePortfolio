const textAbout = document.querySelector(".text-about");
const textInitHeight = textAbout.clientHeight;
const btnShowMore = document.getElementById("toggle");

function toggle(event) {
  event.preventDefault();
  const isExpanded = event.target.dataset.state === "more";

  textAbout.style.maxHeight = isExpanded
    ? `${textAbout.scrollHeight}px`
    : `${textInitHeight}px`;

  textAbout.classList.toggle("expanded", isExpanded);

  event.target.setAttribute("data-state", isExpanded ? "less" : "more");
  event.target.innerHTML = isExpanded ? "...Ver menos" : "Ler mais sobre...";
}

btnShowMore.addEventListener("click", toggle);
btnShowMore.addEventListener("touchstart", toggle);
