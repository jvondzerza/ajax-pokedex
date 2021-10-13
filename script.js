(function() {

    let input = document.getElementById("pokemon-search");
    let searchButton = document.getElementById("search-button");
    let id = document.getElementById("id");
    let name = document.getElementById("name");
    let img = document.getElementById("poke-img");
    let moves = document.getElementById("moves");
    let navPrev = document.getElementById("prev");
    let navNext = document.getElementById("next");
    let randomMoves = ["", "", "", ""];
    let fetchId = 1;

    searchButton.addEventListener("click", function() {
        fetchId = input.value;
        fetchPokemon();
    })

    input.addEventListener("keypress", function (e){
        if (e.key === 'Enter') {
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
                randomMoves = ["", "", "", ""];
            })
    }

    function assignMoves() {
        moves.innerHTML = "";
        randomMoves.forEach(randomMove => {
            let move = document.createElement("li");
            move.innerHTML = randomMove;
            moves.appendChild(move);
        })
    }

    fetchPokemon();

    function fetchEvolutions() {
        fetch(`https://pokeapi.co/api/v2/pokemon-species/${fetchId}/`)
            .then(response => response.json())
            .then(data => {
                console.log(data.evolution_chain.url)
            })
    }
    fetchEvolutions()

})();