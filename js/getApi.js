const repositories = document.querySelector('.box-cards');

function getApiGutHub() {
    fetch('https://api.github.com/users/SrBaliardo/repos')
        .then(async res => {
            if(!res.ok) {
                throw new Error(res.status);
            }

            let data = await res.json();
            data.map(item => {
                let cardProject = document.createElement('div');
                
                cardProject.innerHTML = `
                <div class="card">
                    <div class="card-content">
                        <img class="img-card" src="./images/animation_${item.name}.gif" draggable="false">
                        <h5 class="title-project">${item.name}</h5>
                        <p class="desc-project">${item.description}</p>
                        <div class="btn-card">
                            <a href="https://srbaliardo.github.io/${item.name}" target="_blank">
                                <button class="btn-page"><i class="fa-solid fa-window-maximize btn-icon"></i> Página
                                </button>
                            </a>
                            <a href="${item.html_url}" target="_blank">
                                <button class="btn-code"><i class="fa-solid fa-code btn-icon"></i> Código
                                </button>
                            </a>
                        </div>
                        <span class="language"><i class="fas fa-circle"></i> ${item.language}</span>
                    </div>
                </div>
                `
                
                repositories.appendChild(cardProject);
              
            })
        })
}

getApiGutHub()