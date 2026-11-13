const startSelect = document.getElementById("start");
const destinationSelect = document.getElementById("destination");
const routeMessage = document.getElementById("route-message");
const goButton = document.getElementById("save-route-btn");

// to shhow the saved choices again if the user comes back to this page.
startSelect.value = getChoice("start") || "";
destinationSelect.value = getChoice("destination") || "";

function showMessage(text) {
  if (routeMessage) routeMessage.textContent = text;
  else alert(text);
}

goButton.addEventListener("click", function () {
  const start = startSelect.value;
  const destination = destinationSelect.value;

  // Check the choices first.
  if (start === "" || destination === "") {
    showMessage("Please choose both a starting point and a destination.");
    return;
  }

  if (start === destination) {
    showMessage("Starting point and destination cannot be the same.");
    return;
  }

  // Save, then go to the next page.
  clearJourney();   // a new plan starts with no visited places
  saveChoice("start", start);
  saveChoice("destination", destination);
  window.location.href = "explore.html";
});

// Clear the warning as soon as the person changes a choice.
startSelect.addEventListener("change", function () { showMessage(""); });
destinationSelect.addEventListener("change", function () { showMessage(""); });