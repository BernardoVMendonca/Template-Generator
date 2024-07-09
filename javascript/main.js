let offset = 0;

const defOffset = (newOffset) => {
  if (newOffset === undefined) offset += 10;
  else offset = newOffset;
  return offset;
};

const main = async () => {
  const limit = 10;
  const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`;
  const pokemonHTML = document.getElementById("pokemon_list");

  try {
    const response = await fetch(url);
    const pokemonInfos = await response.json();
    const pokemonList = pokemonInfos.results;

    for (i = 0; i < pokemonList.length; i++)
      pokemonHTML.innerHTML += await pokemonToHTML(pokemonList[i].name);
  } catch (error) {
    console.log(error);
  }
};

main();