// navigate.js - for navigate.html
// Script order in the HTML: journey.js, places.js, navigate.js


const start = getChoice("start");
const destination = getChoice("destination");
const journeyType = getChoice("journeyType");

// Apply color theme based on the selected journey type
const themeName = journeyType.trim().toLowerCase();

document.body.classList.remove(
  "theme-scenic",
  "theme-foodie",
  "theme-budget"
);

if (["scenic", "foodie", "budget"].includes(themeName)) {
  document.body.classList.add("theme-" + themeName);
}

const placesList = document.getElementById("places-list");
const mapFrame = document.getElementById("map");

const typeLabel = document.getElementById("journey-type-label");
const routeStart = document.getElementById("route-start");
const routeDestination = document.getElementById("route-destination");
const currentPlaceName = document.getElementById("current-place-name");
const placeImage = document.getElementById("current-place-img");
const placeDescription = document.getElementById("current-place-desc");
const navigateMessage = document.getElementById("navigate-message");

// Puts text into an element, if the element exists on the page only
function setText(element, text) {
  if (element) {
    element.textContent = text;
  }
}

// Fill in the saved choices 
setText(typeLabel, journeyType !== "" ? journeyType : "Your journey");
setText(routeStart, start || "Not selected");
setText(routeDestination, destination || "Not selected");
setText(currentPlaceName, "No place selected yet.");

// Shows one place: remembers it, highlights its card, and updates everything.
function showPlace(place) {
  saveChoice("currentPlace", place.id);
  addVisited(place.id);                    // remember every place the user opened

  // Highlight the chosen card (the CSS should style .place-card.selected).
  for (const card of placesList.querySelectorAll(".place-card")) {
    if (card.dataset.id === place.id) {
      card.classList.add("selected");
    } else {
      card.classList.remove("selected");
    }
  }

  mapFrame.src = getMapUrl(place);        // the map changes to the chosen place
  setText(currentPlaceName, place.name);
  setText(placeDescription, place.description);
  setText(navigateMessage, "Showing " + place.name + " on the map.");
  if (placeImage) {
    loadPlaceImage(placeImage, place);
  }
}

// Builds one suggestion card for a place
function makeCard(place) {
  const item = document.createElement("li");

  const card = document.createElement("button");
  card.type = "button";
  card.className = "place-card";
  card.dataset.id = place.id;

  const text = document.createElement("span");
  text.className = "place-card-text";

  const name = document.createElement("span");
  name.className = "place-card-name";
  name.textContent = place.name;
  text.appendChild(name);

  if (place.cost) {
    const cost = document.createElement("span");
    cost.className = "place-card-cost";
    cost.textContent = "Cost: " + place.cost;
    text.appendChild(cost);
  }

  card.appendChild(text);
  card.addEventListener("click", function () {
    showPlace(place);
  });

  item.appendChild(card);
  return item;
}

// Shows a message inside the list.
function listMessage(message) {
  placesList.innerHTML = "";
  const item = document.createElement("li");
  item.textContent = message;
  placesList.appendChild(item);
}

// makes a card for every place that matches the destination and journey type.
function showPlaces() {
  placesList.innerHTML = "";
  let found = 0;

  for (const place of places) {
    if (place.town === destination && place.type === journeyType) {
      placesList.appendChild(makeCard(place));
      found = found + 1;
    }
  }

  if (found === 0) {
    listMessage("No " + journeyType + " places found in " + destination + " yet.");
  }
}

// Runs when the page opens 
if (start === "" || destination === "" || journeyType === "") {
  listMessage("Please complete the Plan Journey and Explore pages first.");
} else {
  showPlaces();
  mapFrame.src = getRouteMapUrl(start, destination);   // starts with the route map

  // If the user already picked a place before, show it again.
  const savedPlace = findPlace(getChoice("currentPlace"));
  if (savedPlace && savedPlace.town === destination && savedPlace.type === journeyType) {
    showPlace(savedPlace);
  }
}

//  Hand the finished journey to the Journey Completed / Details pages
// journey and details pages (app.js) read the journey from localStorage "jrvl.history", so we save it dito.
const CITY_COORDS = {
  "Concepcion": [15.3239, 120.6559], "Tarlac City": [15.4755, 120.5963], "Capas": [15.3350, 120.5890],
  "Gerona": [15.6044, 120.5975], "La Paz": [15.4333, 120.7167]
};
const TYPE_INFO = { scenic: { speed: 35, rate: 12, extra: 0 }, foodie: { speed: 40, rate: 12, extra: 600 }, budget: { speed: 40, rate: 8, extra: 150 } };

// Distance in km: uses the number typed in places.js (townTravel)
function journeyKm() {
  const info = getTownTravel(start, destination), typed = info ? parseFloat(info.distance) : 0;
  if (typed > 0) return Math.round(typed);
  const A = CITY_COORDS[start], B = CITY_COORDS[destination];
  if (!A || !B) return 0;
  const r = function (x) { return x * Math.PI / 180; };
  const h = Math.pow(Math.sin(r(B[0] - A[0]) / 2), 2) + Math.cos(r(A[0])) * Math.cos(r(B[0])) * Math.pow(Math.sin(r(B[1] - A[1]) / 2), 2);
  return Math.round(2 * 6371 * Math.asin(Math.sqrt(h)) * 1.35);
}

function journeyMins(km, t) {
  const info = getTownTravel(start, destination), typed = info ? parseFloat(info.time) : 0;
  if (typed > 0) return Math.round(typed);
  return Math.round(km / t.speed * 60);
}

function saveFinishedJourney() {
  const type = journeyType.trim().toLowerCase(), t = TYPE_INFO[type] || TYPE_INFO.scenic;
  const km = journeyKm(), id = Date.now();
  const ids = getVisited().filter(function (pid) { return findPlace(pid); });
  const stops = ids.map(function (pid) {
    const pl = findPlace(pid);
    return { name: pl.name, img: pl.image !== "" ? pl.image : "images/" + pid + ".jpg", city: pl.town };
  });
  const entry = { id: id, start: start, dest: destination, type: type, km: km, mins: journeyMins(km, t),
                  cost: Math.round((km * t.rate + t.extra) / 50) * 50, rating: 0, date: new Date().toISOString(), stops: stops };
  let history = [];
  try { history = JSON.parse(localStorage.getItem("jrvl.history")) || []; } catch (e) {}
  history.unshift(entry);
  try {
    localStorage.setItem("jrvl.history", JSON.stringify(history));
    localStorage.setItem("jrvl.last", JSON.stringify(id));
  } catch (e) {}
}

// "Finish Travel" button
document.getElementById("complete-btn").addEventListener("click", function () {
  if (getChoice("currentPlace") === "") {
    setText(navigateMessage, "Please choose a place first.");
    return;
  }
  saveFinishedJourney();
  window.location.href = "complete-journey.html";
});
