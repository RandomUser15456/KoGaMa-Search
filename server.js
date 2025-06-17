const express = require('express');
const path = require('path');
const {server} = require("./config.json")
const userData = require("./data/" + server + "/users.json");
const app = express();
const PORT = 3003;

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));


app.get("/leaderboard", (req, res) => {
    res.send(userData)
});

function isAllDigits(str) {
    return /^[0-9]+$/.test(str);
}
function removeSpaces(str) {
    return str.replace(/\s+/g, '');
}
app.get("/search", (req, res) => {
    let urlO = new URL(req.url, 'http://localhost'),
        payload = Object.fromEntries(urlO.searchParams);
    console.log(payload);
    if (!payload.query) return res.send({ error: "undefined param query" })
    let result = [], query = removeSpaces(payload.query).toLowerCase()

    result.push(...userData.filter(l => removeSpaces(l.username).toLowerCase().includes(query)));
    if (isAllDigits(payload.query)) result.push(...userData.filter(l => l.id == Number(payload.query)))
    res.send(result)
});
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});