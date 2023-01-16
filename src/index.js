//const axios = require('axios');
//import axios from 'axios';


const base_url = "http://192.168.1.224:8080/qpe/";
const url_all_data = "getTagData?mode=json";
const url_get_tag = "getTagData?mode=json&tag=";

const first_player = 0;
const second_player = 1;
let tictactoe_grid;
let previous_tictactoe_grid;
let current_player;
let game_over = false;
let winner;
let active_ai = false;
let gen_id_prev_preceding = "00";


function toggle_ai() {
    if (active_ai) {
        active_ai = false;
    } else {
        active_ai = true;
    }
}

async function fetchAllData() {
    let data;
    let response;

    try {
        const response = await axios.get(base_url + url_all_data);
        // assert nor null
        if (response.data) {
            data = response.data;
            console.log(data);
        } else {
            console.log("Error: response.data is null");
        }
        return data;
    } catch (error) {
        console.log(error)
        throw error;
    }
}

async function background_update_tag() {

    let data = await fetchAllData();
    let considered_tag;

    // get first tag with non null zone
    for (let i = 0; i < data["tags"].length; i++) {
        if (data["tags"][i]["locationZoneNames"] != null && data["tags"][i]["locationZoneNames"].length != 0) {
            considered_tag = data["tags"][i];
            break;
        }
    }

    if (considered_tag == null ) {
        console.log("Error: no tag with non null zone");
        return;
    }
    console.log(considered_tag["locationZoneNames"]);

    // update tictactoe grid
    let x;
    let y;
    if (considered_tag["locationZoneNames"][0] == "A1") {
        x = 0;
        y = 0;
    } else if (considered_tag["locationZoneNames"][0] == "A2") {
        x = 1;
        y = 0;
    } else if (considered_tag["locationZoneNames"][0] == "A3") {
        x = 2;
        y = 0;
    } else if (considered_tag["locationZoneNames"][0] == "B1") {
        x = 0;
        y = 1;
    } else if (considered_tag["locationZoneNames"][0] == "B2") {
        x = 1;
        y = 1;
    } else if (considered_tag["locationZoneNames"][0] == "B3") {
        x = 2;
        y = 1;
    } else if (considered_tag["locationZoneNames"][0] == "C1") {
        x = 0;
        y = 2;
    } else if (considered_tag["locationZoneNames"][0] == "C2") {
        x = 1;
        y = 2;
    } else if (considered_tag["locationZoneNames"][0] == "C3") {
        x = 2;
        y = 2;
    } else {
        console.log("Error: invalid zone: " + considered_tag["locationZoneNames"][0]);
        return;
    }

    // update display grid with dummy
    
    gen_id = "" + x + y;

    // reset previous preview
    let all_classes = document.getElementById(gen_id_prev_preceding).className;
    all_classes = all_classes.replace('circle-preview', '');
    all_classes = all_classes.replace('cross-preview', '');
    document.getElementById(gen_id_prev_preceding).className = all_classes;

    if (tictactoe_grid[x][y] == first_player) {
        all_classes = document.getElementById(gen_id).className += " circle-preview";
    } else {
        document.getElementById(gen_id).className += " cross-preview";
    }

    gen_id_prev_preceding = gen_id
}

async function main() {
    let data = await fetchAllData();
    let tags_id = [];
    
    // create list of tag ids
    for (let i = 0; i < data["tags"].length; i++) {
        tags_id.push(data["tags"][i]["tagId"]);
    }

    // print all tag ids
    console.log(tags_id);
    
    current_player = first_player;
    move_number = 0;

    tictactoe_grid = [];
    for(let i = 0; i < 3; i++) {
        tictactoe_grid.push([]);
    }
}

function checkValideMove(x, y) {
    if (tictactoe_grid[x][y] == null) {
        return true;
    }
    return false;
}

function checkGameIsOver() {
    // check horizontal
    for (let i = 0; i < 3; i++) {
        if (tictactoe_grid[i][0] == tictactoe_grid[i][1] && tictactoe_grid[i][1] == tictactoe_grid[i][2]) {
            return [true, tictactoe_grid[i][0]];
        }
    }

    // check vertical
    for (let i = 0; i < 3; i++) {
        if (tictactoe_grid[0][i] == tictactoe_grid[1][i] && tictactoe_grid[1][i] == tictactoe_grid[2][i]) {
            return [true, tictactoe_grid[0][i]];
        }
    }

    // check diagonal
    if (tictactoe_grid[0][0] == tictactoe_grid[1][1] && tictactoe_grid[1][1] == tictactoe_grid[2][2]) {
        return [true, tictactoe_grid[1][1]];
    }
    if (tictactoe_grid[0][2] == tictactoe_grid[1][1] && tictactoe_grid[1][1] == tictactoe_grid[2][0]) {
        return [true, tictactoe_grid[1][1]];
    }

    return [false, null];
}

function updateGridAndPlayer(x, y) {
    // save previous grid
    previous_tictactoe_grid = tictactoe_grid;

    tictactoe_grid[x][y] = current_player;
    current_player = (current_player + 1) % 2;
    move_number++;

    // check if game is over
    game_over, winner = checkGameIsOver();
}

function previousGridState() {
    tictactoe_grid = previous_tictactoe_grid;
    displayGrid();
}

async function nextMove() {
    document.getElementById("next-move").blur();

    // check if AI is playing
    if (current_player == second_player && active_ai) {
        AIMove();
        return;
    }

    let data = await fetchAllData();
    let considered_tag;

    // get first tag with non null zone
    for (let i = 0; i < data["tags"].length; i++) {
        if (data["tags"][i]["locationZoneNames"] != null && data["tags"][i]["locationZoneNames"].length != 0) {
            considered_tag = data["tags"][i];
            break;
        }
    }

    if (considered_tag == null) {
        console.log("Error: no tag with non null zone");
        return;
    }
    console.log(considered_tag);

    // update tictactoe grid
    let x;
    let y;
    if (considered_tag["locationZoneNames"][0] == "A1") {
        x = 0;
        y = 0;
    } else if (considered_tag["locationZoneNames"][0] == "A2") {
        x = 1;
        y = 0;
    } else if (considered_tag["locationZoneNames"][0] == "A3") {
        x = 2;
        y = 0;
    } else if (considered_tag["locationZoneNames"][0] == "B1") {
        x = 0;
        y = 1;
    } else if (considered_tag["locationZoneNames"][0] == "B2") {
        x = 1;
        y = 1;
    } else if (considered_tag["locationZoneNames"][0] == "B3") {
        x = 2;
        y = 1;
    } else if (considered_tag["locationZoneNames"][0] == "C1") {
        x = 0;
        y = 2;
    } else if (considered_tag["locationZoneNames"][0] == "C2") {
        x = 1;
        y = 2;
    } else if (considered_tag["locationZoneNames"][0] == "C3") {
        x = 2;
        y = 2;
    } else {
        console.log("Error: invalid zone: " + considered_tag["locationZoneNames"][0]);
        return;
    }

    // do move
    if(checkValideMove(x, y)) {
        updateGridAndPlayer(x, y);
    } else {
        console.log("Error: invalid move");
    }

    displayGrid();
}

function AIMove() {

    // if first AI move, play in the corner
    if (move_number == 1 || move_number == 3 || move_number == 5) {
        for(let i = 0; i < 3; i += 2) {
            for(let j = 0; j < 3; j += 2) {
                if (checkValideMove(i, j)) {
                    updateGridAndPlayer(i, j);
                    return;
                }
            }
        }
    } else {
        // take the center if possible between player corners
        for(let i = 0; i < 3; i++) {
            for(let j = 0; j < 3; j++) {
                // check center
                if (i == 1 || j == 1) {
                    if (checkValideMove(i, j)) {
                        if( i == 1 && j == 1) {
                            updateGridAndPlayer(i, j);
                                return;
                        }
                    } else if( i == 1 && j == 0) {
                        if (tictactoe_grid[0][0] == second_player && tictactoe_grid[2][0] == second_player) {
                            updateGridAndPlayer(i, j);
                            return;
                        }
                    } else if( i == 1 && j == 2) {
                        if (tictactoe_grid[0][2] == second_player && tictactoe_grid[2][2] == second_player) {
                            updateGridAndPlayer(i, j);
                            return;
                        }
                    } else if( i == 0 && j == 1) {
                        if (tictactoe_grid[0][0] == second_player && tictactoe_grid[0][2] == second_player) {
                            updateGridAndPlayer(i, j);
                            return;
                        }
                    } else if( i == 2 && j == 1) {
                        if (tictactoe_grid[2][0] == second_player && tictactoe_grid[2][2] == second_player) {
                            updateGridAndPlayer(i, j);
                            return;
                        }
                    }
                }
            }
        }
    }

    // at this point, no valid move has been found, play random valid move
    let x = Math.floor(Math.random() * 3);
    let y = Math.floor(Math.random() * 3);

    // do move
    if(checkValideMove(x, y)) {

    }

    // take the center if possible between player corners
    for(let i = 0; i < 3; i++) {
        for(let j = 0; j < 3; j++) {
            // check center
            if (i == 1 || j == 1) {
                if (checkValideMove(i, j)) {
                    if( i == 1 && j == 1) {
                        updateGridAndPlayer(i, j);
                            return;
                    } else if( i == 1 && j == 0) {
                        if (tictactoe_grid[0][0] == second_player && tictactoe_grid[2][0] == second_player) {
                            updateGridAndPlayer(i, j);
                            return;
                        }
                    } else if( i == 1 && j == 2) {
                        if (tictactoe_grid[0][2] == second_player && tictactoe_grid[2][2] == second_player) {
                            updateGridAndPlayer(i, j);
                            return;
                        }
                    } else if( i == 0 && j == 1) {
                        if (tictactoe_grid[0][0] == second_player && tictactoe_grid[0][2] == second_player) {
                            updateGridAndPlayer(i, j);
                            return;
                        }
                    } else if( i == 2 && j == 1) {
                        if (tictactoe_grid[2][0] == second_player && tictactoe_grid[2][2] == second_player) {
                            updateGridAndPlayer(i, j);
                            return;
                        }
                    }
                }
            }
        }
    }
    
    // random move
    let x_ai = Math.floor(Math.random() * 3);
    let y_ai = Math.floor(Math.random() * 3);

    // do move
    if(checkValideMove(x, y)) {
        updateGridAndPlayer(x, y);
    } else {
        AIMove();
    }

    displayGrid();
}

function resetGame() {
    document.getElementById("next-move").blur();
    
    main();
    displayGrid();
}


// dislay function
function displayGrid() {
    for (let i = 0; i < 3; i++) {
        for(let j = 0; j < 3; j++) {
            if (tictactoe_grid[i][j] != null) {
                gen_id = "" + i + j;
                if (tictactoe_grid[i][j] == first_player) {
                    document.getElementById(gen_id).className = "circle";
                } else {
                    document.getElementById(gen_id).className = "cross";
                }
            } 
        }
    }
}

// init
main();

setInterval(async () => {
    await background_update_tag();
}, 1000);

