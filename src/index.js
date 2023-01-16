//const axios = require('axios');
//import axios from 'axios';


const base_url = "http://192.168.1.224:8080/qpe/";
const url_all_data = "getTagData?mode=json";
const url_get_tag = "getTagData?mode=json&tag=";

const first_player = 0;
const second_player = 1;
let tictactoe_grid;
let current_player;
let game_over = false;
let winner;

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
    tictactoe_grid[x][y] = current_player;
    current_player = (current_player + 1) % 2;

    // check if game is over
    game_over, winner = checkGameIsOver();
}

async function nextMove() {
    let data = await fetchAllData();
    let considered_tag;

    // get first tag with non null zone
    for (let i = 0; i < data["tags"].length; i++) {
        if (data["tags"][i]["locationZoneNames"] != null) {
            considered_tag = data["tags"][i];
            break;
        }
    }

    if (considered_tag == null) {
        console.log("Error: no tag with non null zone");
        return;
    }

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
        console.log("Error: invalid zone");
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
