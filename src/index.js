const axios = require('axios');

const base_url = "http://192.168.1.224:8080/qpe/";
const url_all_data = "getTagData?mode=json";
const url_get_tag = "getTagData?mode=json&tag=";

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

    const first_player = 0;
    const second_player = 1;
    let current_player = first_player;
    let move_number = 0;

    let tictactoe_grid = [];
    for(let i = 0; i < 3; i++) {
        tictactoe_grid.push([]);
    }
}

function checkValideMove(tictactoe_grid, x, y) {
    if (tictactoe_grid[x][y] == null) {
        return true;
    }
    return false;
}

async function nextMove(tictactoe_grid, current_player) {
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
    if (considered_tag["locationZoneNames"][0] == "A1") {
        if checkValideMove(tictactoe_grid, 0, 0) {
            tictactoe_grid[0][0] = current_player;
        }
    }

}


main();