/*

Explorador de Destinos
 
Você deve criar uma página onde o usuário pode ver sugestões de "Postagens" (simulando destinos),
salvar seu post favorito para não perder ao recarregar(localstorage) a página e registrar sua localização de partida.
 
Objetivos:
Fetch API: Buscar uma postagem aleatória da API jsonplaceholder e exibir o título no HTML.
 
LocalStorage: Criar um botão "Salvar Favorito" que armazena o título da postagem atual.
Ao recarregar a página, esse favorito deve aparecer em uma lista.
 
Geolocation: Mostrar a latitude e longitude do usuário como seu "Ponto de Partida".

*/
const FAVORITOS = 'favoritos';
async function carregarPosts() {
    const resposta = await fetch(`https://jsonplaceholder.typicode.com/posts`);
    if (resposta.status != 200)
        throw new Error(`Erro ao carregar os posts. Status: ${resposta.status}`);
    return resposta.json();
}
async function atualizarExibicaoPostsAsync() {
    // mostrar o post no html
    const containerPost = document.getElementById('post-container');
    if (!containerPost)
        throw new Error('Não é possível iniciar a aplicação sem o container de post.');
    const favoritos = carregarFavoritosExistentes();
    let posts;
    try {
        posts = await carregarPosts();
    }
    catch (error) {
        console.error('Erro ao carregar os posts:', error);
        containerPost.innerHTML =
            '<p>Erro ao carregar os posts. Tente novamente mais tarde.</p>';
        return;
    }
    // post deve ter um botão de salvar favorito
    const htmlPost = posts.map((post) => {
        const ehFavorito = favoritos.includes(post.title);
        return `
          <div class="post">
              <h3 class="titulo-post">${post.title}${ehFavorito ? ' (❤️)' : ''}</h3>
              <p class="corpo-post">${post.body}</p>
              <button 
                  class="botao-favorito ${ehFavorito ? 'favorito' : ''}" 
                  onclick="${ehFavorito
            ? `removerFavorito('${post.title}')`
            : `salvarFavorito('${post.title}')`}">
                      ${ehFavorito ? 'Remover Favorito' : 'Salvar Favorito'}
                  </button>
          </div>
      `;
    });
    containerPost.innerHTML = htmlPost.join('');
}
async function iniciarAplicacaoAsync() {
    // chamar api para pegar um post aleatório
    await atualizarExibicaoPostsAsync();
    // pegar a localização do usuário
    // mostrar a latitude e longitude no html em uma seção de ponto de partida
    const htmlPontoPartida = document.getElementById('ponto-partida');
    if (htmlPontoPartida) {
        if (Object.keys(window.navigator.geolocation).length > 0) {
            window.navigator.geolocation.getCurrentPosition((posicao) => {
                const latitude = posicao.coords.latitude;
                const longitude = posicao.coords.longitude;
                htmlPontoPartida.textContent = `Latitude: ${latitude}, Longitude: ${longitude}`;
            });
        }
        else {
            htmlPontoPartida.textContent = 'Geolocalização não disponível.';
        }
    }
}
function carregarFavoritosExistentes() {
    let favoritos = localStorage.getItem(FAVORITOS);
    let listaFavoritos = favoritos ? JSON.parse(favoritos) : [];
    return listaFavoritos;
}
function salvarFavorito(tituloPost) {
    let listaFavoritos = carregarFavoritosExistentes();
    if (!listaFavoritos.includes(tituloPost)) {
        listaFavoritos.push(tituloPost);
        // salvar o post no localstorage
        localStorage.setItem(FAVORITOS, JSON.stringify(listaFavoritos));
    }
    atualizarExibicaoFavoritos();
    // Fire and forget, não precisa esperar a atualização dos posts
    atualizarExibicaoPostsAsync();
}
function removerFavorito(tituloPost) {
    let listaFavoritos = carregarFavoritosExistentes();
    listaFavoritos = listaFavoritos.filter((fav) => fav !== tituloPost);
    localStorage.setItem(FAVORITOS, JSON.stringify(listaFavoritos));
    atualizarExibicaoFavoritos();
    // Fire and forget, não precisa esperar a atualização dos posts
    atualizarExibicaoPostsAsync();
}
function atualizarExibicaoFavoritos() {
    const listaFavoritos = carregarFavoritosExistentes();
    const containerFavoritos = document.getElementById('favoritos-container');
    const htmlFavoritos = listaFavoritos
        .map((fav) => {
        return `
          <li>
              <span>${fav}</span> <button class="btn-remover-fav" onclick="removerFavorito('${fav}')">X</button>
          </li>
      `;
    })
        .join('');
    if (containerFavoritos) {
        containerFavoritos.innerHTML = `<ul>${htmlFavoritos}</ul>`;
    }
}
iniciarAplicacaoAsync();
atualizarExibicaoFavoritos();
Object.defineProperties(window, {
    salvarFavorito: {
        value: salvarFavorito,
    },
    removerFavorito: {
        value: removerFavorito,
    },
});
export {};
//# sourceMappingURL=script.js.map