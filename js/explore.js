
const typeDropdown = document.getElementById("journey-type");
const typeMessage = document.getElementById("type-message");

// Show the saved journey type when if user comes back to this page
typeDropdown.value = getChoice("journeyType") || "";

//  save the type and go to the Navigate page.
document.getElementById("save-type-btn").addEventListener("click", function () {
  const type = typeDropdown.value;

  if (type === "") {
    if (typeMessage) {
      typeMessage.textContent = "Please choose a type of journey.";
    } else {
      alert("Please choose a type of journey.");
    }
    return;
  }

  saveChoice("journeyType", type);
  window.location.href = "navigate.html";
});

typeDropdown.addEventListener("change", function () {
  if (typeMessage) typeMessage.textContent = "";
});
