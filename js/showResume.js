const resumeBox = document.querySelector(".resume-box");
const resumeBg = document.querySelector(".resume-bg");

function viewResume() {
  resumeBox.style.left = "50%";
  resumeBox.style.transform = "translateX(-50%)";
  resumeBg.style.visibility = "visible";

  if (!document.querySelector(".resume-pdf")) {
    const iframe = document.createElement("iframe");
    iframe.src = "./resume.pdf";
    iframe.className = "resume-pdf";
    iframe.style.width = "100%";
    iframe.style.height = "550px";
    resumeBox.appendChild(iframe);
  }
}

function hiddenResume() {
  resumeBox.style.left = "-100%";
  resumeBg.style.visibility = "hidden";
  const iframe = document.querySelector(".resume-pdf");
  if (iframe) {
    iframe.remove();
  }
}
