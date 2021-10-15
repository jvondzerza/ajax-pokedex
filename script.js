(function() {

    let evoDiv = document.getElementById("evo-row");
    let input = document.getElementById("poke-search");
    let searchButton = document.getElementById("search-button");
    let id = document.getElementById("id");
    let name = document.getElementById("name");
    let img = document.getElementById("poke-img");
    let moves = document.getElementById("moves");
    let navPrev = document.getElementById("prev");
    let navNext = document.getElementById("next");
    let randomMoves = ["", "", "", ""];
    let fetchId = 1;

    function inputSanitization() {
        if (input.value.includes(" ")) {
            input.value = input.value.replace(" ", "-");
        }
        if (input.value.includes(".")) {
            input.value = input.value.replace(".", "");
        }
    }

    searchButton.addEventListener("click", function() {
        inputSanitization();
        fetchId = input.value;
        fetchPokemon();
    })

    input.addEventListener("keypress", function (e){
        if (e.key === 'Enter') {
            inputSanitization();
            fetchId = input.value;
            fetchPokemon();
        }
    })

    navPrev.addEventListener("click", function() {
        fetchId -= 1;
        if (fetchId < 1) {
            fetchId = 898;
        }
        fetchPokemon();
    })

    navNext.addEventListener("click", function() {
        fetchId += 1;
        if (fetchId > 898) {
            fetchId = 1;
        }
        fetchPokemon();
    })

    function fetchPokemon() {
        fetch(`https://pokeapi.co/api/v2/pokemon/${fetchId}`)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                name.innerHTML = data.name;
                id.innerHTML = data.id;
                img.src = data.sprites.front_default;
                function moveToMovesArray() {
                    let randomMove = data.moves[Math.floor(Math.random() * data.moves.length)].move.name;
                    while (randomMoves.includes(randomMove)) {
                        console.log("Duplicate detected");
                        randomMove = data.moves[Math.floor(Math.random() * data.moves.length)].move.name;
                    }
                    randomMoves[i] = randomMove;
                }
                for (i = 0; i < randomMoves.length ; i++) {
                    if (data.moves.length >= randomMoves.length) {
                        moveToMovesArray();
                    } else if (data.moves.length > 0 && data.moves.length < randomMoves.length) {
                        randomMoves.length = data.moves.length;
                        moveToMovesArray();
                    } else if (data.moves.length === 0) {
                        randomMoves = [];
                    }
                }
                assignMoves();
                fetchId = parseInt(data.id);
                fetchEvolutions();
                randomMoves = ["", "", "", ""];
            })
    }

    function assignMoves() {
        moves.innerHTML = "";
        randomMoves.forEach(randomMove => {
            let move = document.createElement("p");
            move.innerHTML = randomMove;
            moves.appendChild(move);
        })
    }

    function fetchEvolutions() {
        let evolutions = [];
        fetch(`https://pokeapi.co/api/v2/pokemon-species/${fetchId}/`)
            .then(response => response.json())
            .then(data => {
                fetch(data.evolution_chain.url)
                    .then(response => response.json())
                    .then(data => {
                        let evolutionDetails = data.chain;
                        function deetsToDom(pixelSize) {
                            evoDiv.innerHTML = "";
                            evolutions.forEach(evolution => {
                                if (evolution === "wormadam") {
                                    evolution = "wormadam-plant";
                                }
                                fetch(`https://pokeapi.co/api/v2/pokemon/${evolution}`)
                                    .then(response => response.json())
                                    .then(data => {
                                        console.log(data);
                                        let figure = document.createElement("figure");
                                        let evolutionChainImg = document.createElement("img");
                                        figure.setAttribute("class", "evo-fig");
                                        evolutionChainImg.setAttribute("class", "evo-img");
                                        evolutionChainImg.src = data.sprites.front_default;
                                        evolutionChainImg.style.width = pixelSize
                                        evolutionChainImg.style.height = pixelSize
                                        figure.appendChild(evolutionChainImg);
                                        let evolutionName = document.createElement("figcaption");
                                        evolutionName.innerHTML = evolution;
                                        figure.appendChild(evolutionName);
                                        evoDiv.appendChild(figure)
                                    })
                            })
                        }
                        if (evolutionDetails.evolves_to.length === 1) {
                            for (i = 0; i < evolutionDetails.evolves_to.length; i++) {
                                evolutions[i] = evolutionDetails.species.name;
                                if (evolutionDetails.evolves_to[i].evolves_to.length === 0) {
                                    evolutions[i+1] = evolutionDetails.evolves_to[i].species.name;
                                } else if (evolutionDetails.evolves_to[i].evolves_to[i].hasOwnProperty('species')) {
                                    evolutions[i+1] = evolutionDetails.evolves_to[i].species.name;
                                    evolutions[i+2] = evolutionDetails.evolves_to[i].evolves_to[i].species.name;
                                }
                                console.log(evolutions);
                                deetsToDom("100px");
                            }
                        } else if (evolutionDetails.evolves_to.length > 1) {
                            evolutions[0] = evolutionDetails.species.name;
                            for (i = 0; i < evolutionDetails.evolves_to.length; i++) {
                                evolutions[i+1] = evolutionDetails.evolves_to[i].species.name;
                            }
                            deetsToDom("75px");
                        } else {
                            evoDiv.innerHTML = "";
                        }
                    })
            })
    }

    fetchPokemon();

})();