// Função que cria 7 traços ao redor do clique
function createCursorSplash(e) {
    const numberOfDashes = 7;
    const animationDuration = 500; // duração em milissegundos
  
    for (let i = 0; i < numberOfDashes; i++) {
      const dash = document.createElement("div");
      dash.className = "cursor-splash-dash";
      // Posiciona o dash no ponto do clique
      dash.style.left = e.pageX + "px";
      dash.style.top = e.pageY + "px";
      // Define o ângulo para distribuir os traços igualmente (360° / 7)
      let angle = i * (360 / numberOfDashes);
      dash.style.setProperty("--dash-angle", angle + "deg");
      document.body.appendChild(dash);
  
      // Remove o dash após o término da animação
      setTimeout(() => {
        dash.remove();
      }, animationDuration);
    }
  }
  
  // Adiciona o listener para clique em qualquer parte da página
  document.addEventListener("click", createCursorSplash);
  