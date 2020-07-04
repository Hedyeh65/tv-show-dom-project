let allEpisodes;
let defaultShowId = "82";
let allShows = getAllShows();

function showAllSeries(showId) {
  fetch(`https://api.tvmaze.com/shows/${showId}/episodes`)
    .then((response) => {
      return response.json();
    })
    .then(function (data) {
      allEpisodes = data;
      makePageForEpisodes(allEpisodes);
      createDropDownForEpisodes(allEpisodes);
    })
    .catch((err) => console.log(err));
}
const rootElem = document.getElementById("root");
const mainElm = document.createElement("div");
var searchBar = document.getElementById("search");
var selectSeries = document.getElementById("selectSeries");
let select = document.getElementById("selectBox");
const display = document.getElementById("display");
mainElm.id = "main";
rootElem.appendChild(mainElm);

function makePageForEpisodes(episodeList) {
  mainElm.innerHTML = "";
  episodeList.forEach((episode) => createCards(episode));
  display.innerText = `Displaying ${episodeList.length}/${allEpisodes.length}episodes`;
}

function createCards(episode) {
  var cardElm = document.createElement("div");
  let titleElm = document.createElement("h2");
  let imageEl = document.createElement("img");
  let pElm = document.createElement("p");
  titleElm.textContent =
    episode.name + creatEpisodeCount(episode.season, episode.number);
  imageEl.src = episode.image.medium;
  pElm.innerHTML = episode.summary;
  mainElm.appendChild(cardElm);
  cardElm.appendChild(titleElm);
  cardElm.appendChild(imageEl);
  cardElm.appendChild(pElm);
  cardElm.id = "card";
  titleElm.id = "title";
}
function createShowDropdown() {
  allShows.forEach((show) => {
    let optionForShows = document.createElement("option");
    selectSeries.appendChild(optionForShows);
    optionForShows.value = show.id;
    optionForShows.innerText = `${show.name}`;
  });
}
function createDropDownForEpisodes(liveEpisodes) {
  select.innerHTML = "";
  var firstOption = document.createElement("option");
  firstOption.innerText = "<--select an episode-->";
  select.appendChild(firstOption);
  liveEpisodes.forEach((episode) => {
    let option = document.createElement("option");
    select.appendChild(option);
    option.value = episode.id;
    option.innerText =
      creatEpisodeCount(episode.season, episode.number) + episode.name;
  });
}
function creatEpisodeCount(season, episode) {
  return ` S${season.toString().padStart(2, "0")}E${episode
    .toString()
    .padStart(2, "0")} `;
}

//select Box
select.addEventListener("change", selectEpisode);
function selectEpisode() {
  var findEpisode = allEpisodes.find((episode) => episode.id == select.value);
  if (findEpisode == null) {
    makePageForEpisodes(allEpisodes);
  } else {
    makePageForEpisodes([findEpisode]);
  }
}
selectSeries.addEventListener("change", selectShow);
function selectShow() {
  var findShow = allShows.find((show) => show.id == selectSeries.value);

  if (findShow == null) {
    showAllSeries(defaultShowId);
  } else {
    showAllSeries(findShow.id);
  }
}

//Search Bar

searchBar.addEventListener("keyup", searchTerm);

function searchTerm() {
  var search_item = searchBar.value.toLowerCase();
  var reducedCards = allEpisodes.filter((episode) => {
    return (episode.name + episode.summary).toLowerCase().includes(search_item);
  });
  makePageForEpisodes(reducedCards);
}
function setup() {
  createShowDropdown();
  showAllSeries(defaultShowId);
}
window.onload = setup;
