//You can edit ALL of the code here
const allEpisodes = getAllEpisodes();
const rootElem = document.getElementById("root");
let select = document.getElementById("selectBox");

function setup() {
  makePageForEpisodes(allEpisodes);
}

// creat cards
function makePageForEpisodes(episodeList) {
  rootElem.innerHTML = "";
  const mainElm = document.createElement("div");
  //Addind a display functionality
  const display = document.getElementById("display");
  display.innerText = `Displaying ${episodeList.length}/${allEpisodes.length}episodes`;
  mainElm.id = "main";
  rootElem.appendChild(mainElm);
  // iterate through each episode of the array
  for (let i = 0; i < episodeList.length; i++) {
    let ss = episodeList[i].season.toString().padStart(2, "0");
    let ee = episodeList[i].number.toString().padStart(2, "0");
    //Create Card containers
    var cardElm = document.createElement("div");
    cardElm.id = "card";
    mainElm.appendChild(cardElm);
    //create title for each card
    let titleElm = document.createElement("h2");
    titleElm.id = "title";
    titleElm.textContent = `${episodeList[i].name}- S${ss}E${ee}`;
    cardElm.appendChild(titleElm);
    // insert the images in the cards
    let imageEl = document.createElement("img");
    imageEl.src = episodeList[i].image.medium;
    cardElm.appendChild(imageEl);
    //create p tag for each card
    let pElm = document.createElement("p");
    pElm.innerHTML = episodeList[i].summary;
    cardElm.appendChild(pElm);
    //Adding options to the select Box
    let option = document.createElement("option");
    option.innerText = `S${ss}E${ee}-${episodeList[i].name}`;
    option.value = episodeList[i].id;
    select.appendChild(option);
  }
}
//Adding the first option to the select Box
var firstOption = document.createElement("option");
firstOption.innerText = "<--select an episode-->";
select.appendChild(firstOption);

//select Box
select.addEventListener("change", function () {
  var findEpisode = allEpisodes.find((episode) => episode.id == select.value);
  if (findEpisode == null) {
    select.addEventListener("click", makePageForEpisodes(allEpisodes));
  } else {
    makePageForEpisodes([findEpisode]);
  }
});

//Search Bar
var searchBar = document.getElementById("search");

searchBar.addEventListener("keyup", function (e) {
  var search_item = e.target.value.toLowerCase();
  var reducedCards = allEpisodes.filter((episode) => {
    return (
      episode.name.toLowerCase().includes(search_item) ||
      episode.summary.toLowerCase().includes(search_item)
    );
  });
  makePageForEpisodes(reducedCards);
});

window.onload = setup;
