const searchInput = document.getElementById("destinationSearch");
const districtFilter = document.getElementById("districtFilter");
const filterButtons = document.querySelectorAll(".filter-btn");
const destinationCards = document.querySelectorAll(".destination-card");
const resultCount = document.getElementById("resultCount");
const noResults = document.getElementById("noResults");
const resetButton = document.getElementById("resetFilters");
const searchButton = document.getElementById("searchBtn");
const randomButton = document.getElementById("randomDestination");
const modal = document.getElementById("destinationModal");
const closeModalButton = document.getElementById("closeModal");

let selectedCategory = "all";

const mapQueries = {
  "belihuloya": "Belihuloya, Sri Lanka",
  "bopath": "Bopath Ella Falls, Sri Lanka",
  "sinharaja": "Sinharaja Forest Reserve, Sri Lanka",
  "sri-pada": "Sri Pada Adam's Peak, Sri Lanka",
  "saman-devalaya": "Maha Saman Devalaya, Ratnapura, Sri Lanka",
  "ratnapura": "Ratnapura, Sri Lanka",
  "theli-ella": "Theli Ella Waterfall, Kegalle, Sri Lanka",
  "udawalawe": "Udawalawe National Park, Sri Lanka",
  "kitulgala": "Kitulgala, Sri Lanka",
  "pinnawala": "Pinnawala Elephant Orphanage, Sri Lanka",
  "bible-rock": "Bible Rock Bathalegala, Kegalle, Sri Lanka",
  "asupini-ella": "Asupini Ella, Kegalle, Sri Lanka"
};

function filterDestinations() {
  const searchText = searchInput.value.trim().toLowerCase();
  const selectedDistrict = districtFilter.value;
  let visibleCount = 0;

  destinationCards.forEach(function (card) {
    const name = card.dataset.name.toLowerCase();
    const title = card.dataset.title.toLowerCase();
    const district = card.dataset.district;
    const categories = card.dataset.category.split(" ");

    const matchesSearch = name.includes(searchText) || title.includes(searchText);
    const matchesDistrict = selectedDistrict === "all" || district === selectedDistrict;
    const matchesCategory = selectedCategory === "all" || categories.includes(selectedCategory);

    const isVisible = matchesSearch && matchesDistrict && matchesCategory;

    card.style.display = isVisible ? "" : "none";

    if (isVisible) {
      visibleCount++;
    }
  });

  resultCount.textContent = visibleCount + (visibleCount === 1 ? " destination" : " destinations");
  noResults.hidden = visibleCount !== 0;
}

searchInput.addEventListener("input", filterDestinations);

searchButton.addEventListener("click", filterDestinations);

searchInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    filterDestinations();
  }
});

districtFilter.addEventListener("change", filterDestinations);

filterButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    filterButtons.forEach(function (item) {
      item.classList.remove("active");
    });

    button.classList.add("active");
    selectedCategory = button.dataset.category;

    filterDestinations();
  });
});

resetButton.addEventListener("click", function () {
  searchInput.value = "";
  districtFilter.value = "all";
  selectedCategory = "all";

  filterButtons.forEach(function (button) {
    button.classList.toggle("active", button.dataset.category === "all");
  });

  filterDestinations();
});

function openDestinationModal(card) {
  document.getElementById("modalImage").src = card.dataset.image;
  document.getElementById("modalImage").alt = card.dataset.title;
  document.getElementById("modalCategory").textContent = card.querySelector(".category-label").textContent;
  document.getElementById("modalTitle").textContent = card.dataset.title;
  document.getElementById("modalLocation").textContent = card.querySelector(".district-badge").textContent;
  document.getElementById("modalDescription").textContent = card.dataset.description;
  document.getElementById("modalActivities").textContent = card.dataset.activities;

  const query = mapQueries[card.id] || (card.dataset.title + ", Sri Lanka");
  document.getElementById("mapLink").href =
    "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(query);

  modal.classList.add("show");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");

  closeModalButton.focus();
}

function closeDestinationModal() {
  modal.classList.remove("show");
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
}

document.querySelectorAll(".details-btn").forEach(function (button) {
  button.addEventListener("click", function () {
    const card = button.closest(".destination-card");
    openDestinationModal(card);
  });
});

closeModalButton.addEventListener("click", closeDestinationModal);

modal.addEventListener("click", function (event) {
  if (event.target === modal) {
    closeDestinationModal();
  }
});

document.addEventListener("keydown", function (event) {
  if (event.key === "Escape" && modal.classList.contains("show")) {
    closeDestinationModal();
  }
});

function openDestinationFromHash() {
  const destinationId = decodeURIComponent(window.location.hash.slice(1));

  if (!destinationId) {
    return;
  }

  const card = document.getElementById(destinationId);

  if (card && card.classList.contains("destination-card")) {
    card.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });
  }
}

randomButton.addEventListener("click", function () {
  const visibleCards = Array.from(destinationCards).filter(function (card) {
    return card.style.display !== "none";
  });

  if (visibleCards.length === 0) {
    return;
  }

  const randomCard = visibleCards[Math.floor(Math.random() * visibleCards.length)];

  randomCard.scrollIntoView({
    behavior: "smooth",
    block: "center"
  });

  setTimeout(function () {
    openDestinationModal(randomCard);
  }, 600);
});

filterDestinations();

window.addEventListener("load", function () {
  setTimeout(openDestinationFromHash, 200);
});

window.addEventListener("hashchange", openDestinationFromHash);