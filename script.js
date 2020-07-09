let allEpisodes;
let showId;
let homeButton = document.getElementById("button");
homeButton.addEventListener("click", () => {
  searchBar.disabled = false;
  searchBar.innerHTML = "";
  makePageForShows(allShows);
  selectSeries.value = null;
  selectSeries.selectedIndex = 0;
});

let allShows = getAllShows().sort(function (a, b) {
  if (a.name < b.name) {
    return -1;
  }
});

function showAllEpisodes(showId) {
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
  display.innerText = `Displaying ${episodeList.length}/${allEpisodes.length} episodes`;
}

function makePageForShows(allShowsList) {
  select.innerHTML = "";
  mainElm.innerHTML = "";
  allShowsList.forEach((show) => createCardsForShows(show));
  display.innerText = `Displaying ${allShowsList.length}/${allShows.length} shows`;
}

function createCards(episode) {
  var cardElm = document.createElement("div");
  let titleElm = document.createElement("h2");
  let imageEl = document.createElement("img");
  let pElm = document.createElement("p");

  titleElm.textContent =
    episode.name + creatEpisodeCount(episode.season, episode.number);
  if (episode.image == null) {
    imageEl.src =
      "https://upmaa-pennmuseum.netdna-ssl.com/collections/images/image_not_available_300.jpg";
  } else {
    imageEl.src = episode.image.medium;
  }
  pElm.innerHTML = episode.summary;
  mainElm.appendChild(cardElm);
  cardElm.appendChild(titleElm);
  cardElm.appendChild(imageEl);
  cardElm.appendChild(pElm);
  cardElm.id = "card";
  titleElm.id = "title";
}
function createCardsForShows(show) {
  var cardElm = document.createElement("div");
  let titleElm = document.createElement("h2");
  let imageEl = document.createElement("img");
  let pElm = document.createElement("p");
  let genres = document.createElement("p");
  let status = document.createElement("p");
  let rating = document.createElement("p");
  let runTime = document.createElement("p");
  let footer = document.createElement("div");
  const showLink = document.createElement("a");
  showLink.id = show.id;

  showLink.addEventListener("click", (event) => {
    selectShow(event.target.id);
    selectSeries.value = show.id;
  });
  genres.innerHTML = ` Genres:${show.genres}`;
  status.innerHTML = ` Status:${show.status}`;
  rating.innerHTML = ` Rating:${show.rating.average}`;
  runTime.innerHTML = ` Runtime:${show.runtime}`;
  showLink.innerText = `${show.name}`;
  showLink.href = "#";
  showLink.style.color = "black";
  if (show.image == null) {
    imageEl.src =
      "https://upmaa-pennmuseum.netdna-ssl.com/collections/images/image_not_available_300.jpg";
  } else {
    imageEl.src = show.image.medium;
  }
  pElm.innerHTML = show.summary;
  mainElm.appendChild(cardElm);
  cardElm.appendChild(titleElm);
  cardElm.appendChild(imageEl);
  cardElm.appendChild(pElm);
  footer.appendChild(genres);
  footer.appendChild(status);
  footer.appendChild(rating);
  footer.appendChild(runTime);
  cardElm.appendChild(footer);
  titleElm.appendChild(showLink);
  pElm.id = "pContainer";
  cardElm.id = "card";
  titleElm.id = "title";
  footer.id = "cardFooter";
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
    searchBar.disabled = false;
  } else {
    makePageForEpisodes([findEpisode]);
    //searchBar.style.display = "none";
    searchBar.disabled = true;
  }
}
let findShow;
selectSeries.addEventListener("change", (event) => {
  selectShow(event.target.value);
});

function selectShow(selectedShowId) {
  searchBar.disabled = false;

  findShow = allShows.find((show) => show.id == selectedShowId);
  if (findShow == null) {
    makePageForShows(allShows);
  } else {
    showAllEpisodes(findShow.id);
  }
}

function search() {
  if (findShow == null) {
    searchShows();
  } else {
    searchEpisodes();
  }
}

// function disableSearchBar() {
//   searchBar.style.display = "none";
// }
searchBar.addEventListener("keyup", search);

function searchEpisodes() {
  let search_item = searchBar.value.toLowerCase();
  var reducedCards = allEpisodes.filter((episode) => {
    return (episode.name + episode.summary).toLowerCase().includes(search_item);
  });
  makePageForEpisodes(reducedCards);
}

function searchShows() {
  let search_item = searchBar.value.toLowerCase();
  var reducedCards = allShows.filter((show) => {
    return (show.name + show.summary + show.genres)
      .toLowerCase()
      .includes(search_item);
  });
  makePageForShows(reducedCards);
}

function setup() {
  createShowDropdown();
  makePageForShows(allShows);
}
window.onload = setup;
