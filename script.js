(function() {
    let pokeLogo = document.getElementById("poke-logo");
    let evoDiv = document.getElementById("evo-div");
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
    let audio = new Audio('poke-nav-sound.mp3');
    let theme = new Audio('pokemon-theme-fart-version.mp3');
    let musicButton = document.getElementById("toggle-music");
    musicButton.innerHTML = "▶️";

    let isPlaying = false;
    function togglePlay() {
        if (isPlaying) {
            theme.pause();
            musicButton.innerHTML = "▶️";
            musicButton.style.borderColor = "#ffcb05"
        } else {
            theme.play();
            musicButton.innerHTML = "⏸️";
            musicButton.style.borderColor = "#3c5aa6"
        }
    }
    theme.onplaying = function() {
        isPlaying = true;
    };
    theme.onpause = function() {
        isPlaying = false;
    };

    musicButton.addEventListener("click", function() {
        togglePlay();
    })

    function inputSanitization() {
        if (input.value.includes(" ")) {
            input.value = input.value.replace(" ", "-");
        }
        if (input.value.includes(".")) {
            input.value = input.value.replace(".", "");
        }
    }

    pokeLogo.addEventListener("click", function() {
        window.location.reload();
    })

    searchButton.addEventListener("click", function() {
        audio.play();
        inputSanitization();
        fetchId = input.value;
        fetchPokemon();
    })

    input.addEventListener("keypress", function (e){
        if (e.key === 'Enter') {
            audio.play();
            inputSanitization();
            fetchId = input.value;
            fetchPokemon();
        }
    })

    navPrev.addEventListener("click", function() {
        audio.play();
        fetchId -= 1;
        if (fetchId < 1) {
            fetchId = 898;
        }
        fetchPokemon();
    })

    navNext.addEventListener("click", function() {
        audio.play();
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
                audio.play
            })
    }

    function assignMoves() {
        moves.innerHTML = "";
        randomMoves.forEach(randomMove => {
            let move = document.createElement("p");
            move.setAttribute("class", "move");
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
                        console.log(evolutionDetails);
                        function deetsToDom(pixelSize, fontSize) {
                            evoDiv.innerHTML = "";
                            evolutions.forEach(evolution => {
                                if (evolution === "wormadam") {
                                    evolution = "wormadam-plant";
                                }
                                if (evolution === "urshifu") {
                                    evolution = "urshifu-single-strike"
                                }
                                fetch(`https://pokeapi.co/api/v2/pokemon/${evolution}`)
                                    .then(response => response.json())
                                    .then(data => {
                                        let figure = document.createElement("figure");
                                        let evolutionChainImg = document.createElement("img");
                                        figure.setAttribute("class", "evo-fig");
                                        figure.style.order = data.order;
                                        evolutionChainImg.setAttribute("class", "evo-img");
                                        evolutionChainImg.src = data.sprites.front_default;
                                        evolutionChainImg.style.width = pixelSize
                                        evolutionChainImg.style.height = pixelSize
                                        figure.appendChild(evolutionChainImg);
                                        let evolutionName = document.createElement("figcaption");
                                        evolutionName.innerHTML = evolution;
                                        evolutionName.style.fontSize = fontSize
                                        figure.appendChild(evolutionName);
                                        evoDiv.appendChild(figure)
                                        evolutionChainImg.addEventListener("click", function () {
                                            audio.play();
                                            fetchId = evolution;
                                            fetchPokemon();
                                        })
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
                            }
                            deetsToDom("100px", "inherit");
                        } else if (evolutionDetails.evolves_to.length === 2) {
                            if (evolutionDetails.species.name === "wurmple") {
                                evolutions[0] = evolutionDetails.species.name;
                                evolutions[1] = evolutionDetails.evolves_to[0].species.name;
                                evolutions[2] = evolutionDetails.evolves_to[1].species.name;
                                evolutions[3] = evolutionDetails.evolves_to[0].evolves_to[0].species.name;
                                evolutions[4] = evolutionDetails.evolves_to[1].evolves_to[0].species.name;
                            } else {
                                evolutions[0] = evolutionDetails.species.name;
                                for (i = 0; i < evolutionDetails.evolves_to.length; i++) {
                                    evolutions[i+1] = evolutionDetails.evolves_to[i].species.name;
                                }
                            }
                            deetsToDom("90px", "inherit");
                        } else if (evolutionDetails.evolves_to.length > 2) {
                            evolutions[0] = evolutionDetails.species.name;
                            for (i = 0; i < evolutionDetails.evolves_to.length; i++) {
                                evolutions[i+1] = evolutionDetails.evolves_to[i].species.name;
                            }
                            deetsToDom("60px", "x-small");
                        } else {
                            evoDiv.innerHTML = "";
                        }
                    })
            })
    }

    fetchPokemon();

})();