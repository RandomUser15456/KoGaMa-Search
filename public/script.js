let displayedCount = 0;
const itemsPerLoad = 20;
let isLoading = false;
let allData = [];



const loadingDiv = document.getElementById('loading');
const mainSearch = document.querySelector("#main-search");


function beautifyNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}
function populateLeaderboard(data, append = true) {
    const leaderboardBody = document.getElementById('leaderboard-body');
    if (!append) leaderboardBody.innerHTML = '';

    data.forEach((user, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
                    <td class="rank">${user.rank}</td>
                    <td><div class="profile-img-container"><img src="${user.friend_images.large}" alt="${user.username}'s profile" class="profile-img"></div></td>
                    <td><a class="username" pid="${user.id}">${user.username}</a></td>
                    <td class="xp">${beautifyNumber(user.score)}</td>
                `;
        leaderboardBody.appendChild(row);
    });

    displayedCount += data.length;
}
async function getData() {
    const res = await fetch('leaderboard'),
        data = await res.json();
    window.D = data;
    allData = data.sort((a, b) => b.score - a.score);
    const newData = allData.slice(0, itemsPerLoad);
    populateLeaderboard(newData, false);
    loadingDiv.style.display = 'none';
    isLoading = false;
}
async function Search(query) {
    const res = await fetch("/search/?query=" + query),
        data = await res.json();
    allData = data.sort((a, b) => b.score - a.score);
    const newData = allData.slice(0, itemsPerLoad);
    populateLeaderboard(newData, false);
    loadingDiv.style.display = 'none';
    isLoading = false;
}
async function loadMoreData() {
    if (isLoading) return;
    isLoading = true;
    loadingDiv.style.display = 'block';
    const startIndex = displayedCount;
    const newData = allData.slice(startIndex, startIndex + itemsPerLoad);
    if (newData.length > 0) {
        populateLeaderboard(newData);
    }
    loadingDiv.style.display = 'none';
    isLoading = false;
}

//loadMoreData();

mainSearch.children[1].onkeydown = async function (e) {
    if (e.key != "Enter") return;
    await Search(e.target.value);
    loadMoreData();
}



document.addEventListener("mousedown", async (e) => {
    console.log(e.target)
    if (e.target.id == "see-all") {
        await getData();
        loadMoreData();
    }
    if (e.target.className == "username") {
        const id = Number(e.target.getAttribute("pid"))
        open(`https://www.kogama.com/profile/${id}/`);
    }
});

window.addEventListener('scroll', () => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    if (scrollTop + clientHeight >= scrollHeight - 200 && !isLoading) {
        loadMoreData();
    }
});
