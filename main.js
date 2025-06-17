

const fs = require('fs');
const path = require('path');
const readline = require('readline');


function saveJsonToFile(filename, jsonObject, directory = __dirname) {
    const filePath = path.join(directory, filename);
    const jsonString = JSON.stringify(jsonObject, null, 2);
    fs.writeFileSync(filePath, jsonString, 'utf8');
}

let hostnames = {
    "www": "https://www.kogama.com/",
    "br": "https://www.kogama.com.br/",
    "friends": "https://friends.kogama.com/"
}
async function getPlayers(hostname, page) {
    try {
        const response = await fetch(`${hostname}api/leaderboard/top/?count=400&page=${page}`);
        const json = await response.json();
        return json;
    } catch (e) {
        console.error(e);
        return [];
    }
}
function TryRequire(default_, path_) {
    try {
        return require(path_);
    } catch (e) {
        return default_;
    }
}
async function fetchAllPlayers(server) {
    const lastFileName = `data/${server}/last.json`
    const userFileName = `data/${server}/users.json`
    let { page } = TryRequire({ page: 1 }, "./" + lastFileName);
    let users = TryRequire([], "./" + userFileName);
    console.log("starting from:", page);
    let hasMoreData = true;

    while (hasMoreData) {
        let fetchedData = await getPlayers(hostnames[server], page);
        users = users.concat(fetchedData.data);
        console.log((users.length * 100 / fetchedData.total).toFixed(4) + "%", page, users.length + " users collected")
        page++;
        saveJsonToFile(userFileName, users);
        saveJsonToFile(lastFileName, { page });
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
}


//fetchAllPlayers().catch(err => console.error('Error in fetchAllPlayers:', err));


const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function prompt(question) {
    return new Promise(resolve => rl.question(question, answer => resolve(answer)));
}


(async function main() {
    const server = await prompt("Enter server [br,www,friends]: ");
    //server.toLowerCase()
    if (!hostnames[server.toLowerCase()]) return (console.log("Invalid server."),rl.close());
    console.log("--", hostnames[server.toLowerCase()])
    fetchAllPlayers(server.toLowerCase()).catch(err => console.error('Error in fetchAllPlayers:', err));
    //rl.close();
})();
