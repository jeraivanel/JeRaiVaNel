function saveChoice(key, value) {
  localStorage.setItem(key, value);
}
// shows the saved value, or "" if the'res nothing/null
function getChoice(key) {
  const value = localStorage.getItem(key);
  if (value === null) {
    return "";
  }
  return value;
}
// Returns the list of visited place ids:
function getVisited() {
  const saved = localStorage.getItem("visitedPlaces");
  if (saved === null) {
    return [];
  }
  try {
    return JSON.parse(saved);
  } catch (error) {
    return [];
  }
}
// Adds a place id to the visited list
function addVisited(placeId) {
  const visited = getVisited();
  if (!visited.includes(placeId)) {
    visited.push(placeId);
    localStorage.setItem("visitedPlaces", JSON.stringify(visited));
  }
}
// back to the beginning  when"start new jounrey" is clicked. 
function clearJourney() {
  localStorage.removeItem("start");
  localStorage.removeItem("destination");
  localStorage.removeItem("journeyType");
  localStorage.removeItem("currentPlace");
  localStorage.removeItem("visitedPlaces");
  localStorage.removeItem("ratings");
}