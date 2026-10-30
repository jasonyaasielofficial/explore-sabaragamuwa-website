const places = [
  { id: "belihuloya", name: "Belihuloya River Village", district: "ratnapura", icon: "🌊", query: "Belihuloya, Sri Lanka" },
  { id: "bopath", name: "Bopath Ella", district: "ratnapura", icon: "💧", query: "Bopath Ella Falls, Sri Lanka" },
  { id: "sinharaja", name: "Sinharaja Forest Reserve", district: "ratnapura", icon: "🌳", query: "Sinharaja Forest Reserve, Sri Lanka" },
  { id: "sri-pada", name: "Sri Pada (Adam's Peak)", district: "ratnapura", icon: "⛰️", query: "Sri Pada Adam's Peak, Sri Lanka" },
  { id: "saman-devalaya", name: "Maha Saman Devalaya", district: "ratnapura", icon: "🏛️", query: "Maha Saman Devalaya, Ratnapura, Sri Lanka" },
  { id: "ratnapura", name: "Ratnapura Gem Heritage", district: "ratnapura", icon: "💎", query: "Ratnapura, Sri Lanka" },
  { id: "theli-ella", name: "Theli Ella Falls", district: "kegalle", icon: "💧", query: "Theli Ella Waterfall, Kegalle, Sri Lanka" },
  { id: "udawalawe", name: "Udawalawe National Park", district: "ratnapura", icon: "🐘", query: "Udawalawe National Park, Sri Lanka" },
  { id: "kitulgala", name: "Kitulgala", district: "kegalle", icon: "🚣", query: "Kitulgala, Sri Lanka" },
  { id: "pinnawala", name: "Pinnawala Elephant Orphanage", district: "kegalle", icon: "🐘", query: "Pinnawala Elephant Orphanage, Sri Lanka" },
  { id: "bible-rock", name: "Bible Rock (Bathalegala)", district: "kegalle", icon: "🥾", query: "Bible Rock Bathalegala, Kegalle, Sri Lanka" },
  { id: "asupini-ella", name: "Asupini Ella", district: "kegalle", icon: "💧", query: "Asupini Ella, Kegalle, Sri Lanka" }
];

const districtNames = { ratnapura: "Ratnapura", kegalle: "Kegalle" };
const defaultMapUrl = "https://maps.google.com/maps?q=6.85,80.5&z=9&output=embed";

const mapFrame = document.getElementById("map");
const placeList = document.getElementById("placeList");
const placeCount = document.getElementById("placeCount");
const filterButtons = document.querySelectorAll(".map-filter-btn");
const resetMapButton = document.getElementById("resetMap");
let currentDistrict = "all";

function showPlace(place) {
  mapFrame.src = "https://maps.google.com/maps?q=" + encodeURIComponent(place.query) + "&z=13&output=embed";

  document.querySelectorAll(".place-item").forEach(function (item) {
    item.classList.toggle("active", item.dataset.id === place.id);
  });
}

function renderPlaces() {
  placeList.innerHTML = "";

  const visiblePlaces = places.filter(function (place) {
    return currentDistrict === "all" || place.district === currentDistrict;
  });

  visiblePlaces.forEach(function (place) {
    const item = document.createElement("li");
    item.className = "place-item";
    item.dataset.id = place.id;
    item.tabIndex = 0;
    item.setAttribute("role", "button");

    const iconBox = document.createElement("div");
    iconBox.className = "place-icon";
    iconBox.textContent = place.icon;

    const info = document.createElement("div");
    info.className = "place-info";

    const name = document.createElement("h4");
    name.textContent = place.name;

    const district = document.createElement("span");
    district.textContent = districtNames[place.district];

    info.appendChild(name);
    info.appendChild(district);
    item.appendChild(iconBox);
    item.appendChild(info);

    item.addEventListener("click", function () {
      showPlace(place);
    });

    item.addEventListener("keydown", function (event) {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        showPlace(place);
      }
    });

    placeList.appendChild(item);
  });

  placeCount.textContent = visiblePlaces.length + (visiblePlaces.length === 1 ? " place" : " places");
}

filterButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    filterButtons.forEach(function (item) {
      item.classList.remove("active");
    });

    button.classList.add("active");
    currentDistrict = button.dataset.district;
    renderPlaces();
  });
});

resetMapButton.addEventListener("click", function () {
  currentDistrict = "all";

  filterButtons.forEach(function (button) {
    button.classList.toggle("active", button.dataset.district === "all");
  });

  mapFrame.src = defaultMapUrl;
  renderPlaces();
});

renderPlaces();

const form = document.getElementById("feedbackForm");
const nameInput = document.getElementById("fbName");
const emailInput = document.getElementById("fbEmail");
const placeSelect = document.getElementById("fbPlace");
const messageInput = document.getElementById("fbMessage");
const charCount = document.getElementById("charCount");
const successBox = document.getElementById("successBox");

places.forEach(function (place) {
  const option = document.createElement("option");
  option.value = place.name;
  option.textContent = place.name;
  placeSelect.appendChild(option);
});

function setError(inputId, errorId, message) {
  const field = document.getElementById(inputId).closest(".form-field");
  document.getElementById(errorId).textContent = message;
  field.classList.toggle("invalid", message !== "");
}

function validateForm() {
  let valid = true;

  const nameValue = nameInput.value.trim();
  const emailValue = emailInput.value.trim();
  const messageValue = messageInput.value.trim();
  const ratingInput = form.querySelector('input[name="rating"]:checked');
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (nameValue.length < 2) {
    setError("fbName", "errName", "Please enter your name.");
    valid = false;
  } else {
    setError("fbName", "errName", "");
  }

  if (emailValue !== "" && !emailPattern.test(emailValue)) {
    setError("fbEmail", "errEmail", "Please enter a valid email.");
    valid = false;
  } else {
    setError("fbEmail", "errEmail", "");
  }

  if (!ratingInput) {
    document.getElementById("errRating").textContent = "Please choose a rating.";
    valid = false;
  } else {
    document.getElementById("errRating").textContent = "";
  }

  if (messageValue.length < 10) {
    setError("fbMessage", "errMessage", "Message must be at least 10 characters.");
    valid = false;
  } else {
    setError("fbMessage", "errMessage", "");
  }

  return valid;
}

messageInput.addEventListener("input", function () {
  charCount.textContent = messageInput.value.length;
});

form.addEventListener("submit", function (event) {
  event.preventDefault();
  successBox.hidden = true;

  if (!validateForm()) {
    return;
  }

  form.reset();
  charCount.textContent = "0";
  successBox.hidden = false;

  setTimeout(function () {
    successBox.hidden = true;
  }, 5000);
});