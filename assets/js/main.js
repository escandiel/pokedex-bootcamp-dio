const pokemonList = document.getElementById("pokemonList");
const loadMoreButton = document.getElementById("loadMoreButton");

const maxRecords = 151;
const limit = 12;
let offset = 0;

function convertPokemonToLi(pokemon) {
  return `
        <li class="pokemon ${pokemon.type}">
        <a href="#" class="pokemon-card" data-pokemon='${JSON.stringify(
          pokemon
        )}'>
            <span class="number">#${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>

            <div class="detail">
                <ol class="types">
                    ${pokemon.types
                      .map((type) => `<li class="type ${type}">${type}</li>`)
                      .join("")}
                </ol>

                <img src="${pokemon.photo}"
                     alt="${pokemon.name}">
            </div>
            </a>
        </li>
    `;
}

function loadPokemonItens(offset, limit) {
  pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
    const newHtml = pokemons.map(convertPokemonToLi).join("");
    pokemonList.innerHTML += newHtml;
  });
}

loadPokemonItens(offset, limit);

loadMoreButton.addEventListener("click", () => {
  offset += limit;
  const qtdRecordsWithNexPage = offset + limit;

  if (qtdRecordsWithNexPage >= maxRecords) {
    const newLimit = maxRecords - offset;
    loadPokemonItens(offset, newLimit);

    loadMoreButton.parentElement.removeChild(loadMoreButton);
  } else {
    loadPokemonItens(offset, limit);
  }
});

const searchBar = document.getElementById("search");

searchBar.addEventListener("keydown", async (event) => {
  if (event.key === "Enter") {
    const searchTerm = searchBar.value.toLowerCase(); // Obtém o termo de pesquisa em letras minúsculas

    // Filtra os pokémons com base no termo de pesquisa
    const filteredPokemons = await pokeApi.getPokemons(0, maxRecords);
    const filteredResults = filteredPokemons.filter((pokemon) =>
      pokemon.name.toLowerCase().includes(searchTerm)
    );
    const newHtml = filteredResults.map(convertPokemonToLi).join("");
    pokemonList.innerHTML = newHtml;

    searchBar.value = "";
  }
});
