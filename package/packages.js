"use strict";

const MEALS_PER_DAY = 2;   // restaurant meals assumed per day for food budget
const MAX_MEMBERS = 50;
const MAX_DAYS = 30;

const $ = function (id) { return document.getElementById(id); };

const make = function (tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
};

const money = function (amount) {
  return "LKR " + Math.round(amount).toLocaleString("en-US");
};

const isSuggested = function (option, band) {
  return option.bands.indexOf(band) !== -1;
};

const orderedOptions = function (options, band) {
  return options
    .map(function (item, index) { return { item: item, index: index }; })
    .sort(function (a, b) {
      return Number(isSuggested(b.item, band)) - Number(isSuggested(a.item, band));
    });
};

const stayText = function (place) {
  const min = place.idealDays[0];
  const max = place.idealDays[1];
  return min === max ? min + " day" + (min > 1 ? "s" : "") : min + " to " + max + " days";
};

const PLACES = PLACE_DATA.map(function (place) {
  const searchText = [
    place.name,
    place.location,
    DISTRICT_LABELS[place.district],
    place.description,
    place.activities,
    place.categories.map(function (key) { return CATEGORY_LABELS[key]; }).join(" "),
    place.tags.join(" ")
  ].join(" ").toLowerCase();

  return Object.assign({}, place, { searchText: searchText });
});

const PLACE_BY_ID = {};
PLACES.forEach(function (place) { PLACE_BY_ID[place.id] = place; });

const state = {
  query: "",
  category: "all",
  district: "all",
  sort: "default",
  fitStay: false,
  selected: [],        // place ids added to the trip
  transport: {},       // placeId -> chosen transport index
  stay: "",            // "placeId|index" of the chosen stay
  restaurant: ""       // "placeId|index" of the chosen restaurant
};

const el = {
  members: $("members"),
  days: $("days"),
  perRoom: $("perRoom"),
  band: $("distanceBand"),
  fitStay: $("fitStay"),
  tripMsg: $("tripMsg"),
  search: $("searchInput"),
  clearSearch: $("clearSearch"),
  district: $("districtFilter"),
  sort: $("sortSelect"),
  categories: $("categoryFilters"),
  grid: $("packageGrid"),
  count: $("resultCount"),
  empty: $("noResults"),
  resetButtons: document.querySelectorAll(".js-reset"),
  selectedList: $("selectedList"),
  emptyTrip: $("emptyTrip"),
  stay: $("stayChoice"),
  restaurant: $("restaurantChoice"),
  budget: $("budgetList"),
  budgetNote: $("budgetNote")
};

function readTrip() {
  const members = Number(el.members.value);
  const days = Number(el.days.value);
  const membersOk = Number.isInteger(members) && members >= 1 && members <= MAX_MEMBERS;
  const daysOk = Number.isInteger(days) && days >= 1 && days <= MAX_DAYS;

  return {
    members: membersOk ? members : 0,
    days: daysOk ? days : 0,
    perRoom: Number(el.perRoom.value),
    band: el.band.value,
    membersOk: membersOk,
    daysOk: daysOk,
    valid: membersOk && daysOk
  };
}

function matchesQuery(place) {
  const terms = state.query.toLowerCase().split(/\s+/).filter(Boolean);
  return terms.every(function (term) {
    return place.searchText.indexOf(term) !== -1;
  });
}

function matchesFilters(place, applyCategory, trip) {
  if (!matchesQuery(place)) return false;
  if (state.district !== "all" && place.district !== state.district) return false;
  if (applyCategory && state.category !== "all" && place.categories.indexOf(state.category) === -1) return false;
  if (state.fitStay && trip.daysOk && (trip.days < place.idealDays[0] || trip.days > place.idealDays[1])) return false;
  return true;
}

function getFiltered(applyCategory) {
  const trip = readTrip();
  return PLACES.filter(function (place) {
    return matchesFilters(place, applyCategory, trip);
  });
}

function sortPlaces(list) {
  const sorted = list.slice();
  if (state.sort === "az") {
    sorted.sort(function (a, b) { return a.name.localeCompare(b.name); });
  } else if (state.sort === "za") {
    sorted.sort(function (a, b) { return b.name.localeCompare(a.name); });
  }
  return sorted;
}

function detailBlock(title, content) {
  const block = make("div", "detail-block");
  block.append(make("h4", "", title), content);
  return block;
}

function transportList(place, band) {
  const list = make("ul", "option-list");

  orderedOptions(place.transport, band).forEach(function (entry) {
    const item = make("li", "option-item");
    item.dataset.bands = entry.item.bands.join(" ");
    item.append(
      make("strong", "", entry.item.mode),
      make("span", "option-price", money(entry.item.price) + " one way, per person"),
      make("span", "suggest-tag", "Suggested for your distance")
    );
    list.appendChild(item);
  });

  return list;
}

function priceList(items, unit) {
  const list = make("ul", "option-list");

  items.forEach(function (item) {
    const li = make("li", "option-item");
    li.append(make("strong", "", item.name), make("span", "option-price", money(item.price) + " " + unit));
    list.appendChild(li);
  });

  return list;
}

function bringList(items) {
  const list = make("ul", "bring-list");
  items.forEach(function (text) { list.appendChild(make("li", "", text)); });
  return list;
}

function createCard(place, band) {
  const card = make("article", "package-card");

  const media = make("div", "card-media");
  const img = make("img");
  img.src = place.image;
  img.alt = place.name;
  img.loading = "lazy";
  media.append(img, make("span", "district-badge", place.location));

  const body = make("div", "card-body");

  const meta = make("div", "card-meta");
  meta.append(
    make("span", "meta-chip", "Ideal stay: " + stayText(place)),
    make("span", "meta-chip", place.entry ? "Entry " + money(place.entry) + " per person" : "No entry fee")
  );

  const tags = make("ul", "tag-list");
  place.tags.slice(0, 4).forEach(function (tag) { tags.appendChild(make("li", "", tag)); });

  const details = make("details", "plan-details");
  details.appendChild(make("summary", "", "Plan this visit: transport, food, stays and safety"));

  const safety = make("div", "safety-notice");
  safety.append(make("strong", "", "STRICT CHILD SAFETY NOTICE"), make("p", "", place.childNotice));

  details.append(
    detailBlock("Transport tickets", transportList(place, band)),
    detailBlock("Restaurants nearby", priceList(place.restaurants, "per person per meal")),
    detailBlock("Places to stay nearby", priceList(place.stays, "per room per night")),
    detailBlock("Things to bring", bringList(place.bring)),
    safety
  );

  const addBtn = make("button", "add-btn");
  addBtn.type = "button";
  addBtn.dataset.id = place.id;
  addBtn.addEventListener("click", function () { toggleSelected(place.id); });

  body.append(
    make("span", "card-label", place.categories.map(function (key) { return CATEGORY_LABELS[key]; }).join(" · ")),
    make("h3", "", place.name),
    make("p", "", place.description),
    tags,
    meta,
    details,
    addBtn
  );

  card.append(media, body);
  return card;
}

function updateSuggestions(band) {
  el.grid.querySelectorAll(".option-item[data-bands]").forEach(function (item) {
    const ok = item.dataset.bands.split(" ").indexOf(band) !== -1;
    item.classList.toggle("is-suggested", ok);
    item.querySelector(".suggest-tag").hidden = !ok;
  });
}

function updateAddButtons() {
  el.grid.querySelectorAll(".add-btn").forEach(function (btn) {
    const on = state.selected.indexOf(btn.dataset.id) !== -1;
    btn.textContent = on ? "✓ In my trip" : "+ Add to my trip";
    btn.classList.toggle("is-on", on);
    btn.setAttribute("aria-pressed", String(on));
  });
}

function buildCategoryButtons() {
  ["all"].concat(Object.keys(CATEGORY_LABELS)).forEach(function (key) {
    const button = make("button", "filter-btn");
    button.type = "button";
    button.dataset.category = key;
    button.append(
      make("span", "", key === "all" ? "All Places" : CATEGORY_LABELS[key]),
      make("span", "filter-count")
    );
    button.addEventListener("click", function () {
      state.category = key;
      renderGrid();
    });
    el.categories.appendChild(button);
  });
}

function updateCategoryButtons() {
  const base = getFiltered(false);

  el.categories.querySelectorAll(".filter-btn").forEach(function (button) {
    const key = button.dataset.category;
    const count = key === "all"
      ? base.length
      : base.filter(function (place) { return place.categories.indexOf(key) !== -1; }).length;
    const isActive = state.category === key;

    button.querySelector(".filter-count").textContent = count;
    button.classList.toggle("active", isActive);
    button.classList.toggle("is-empty", count === 0 && !isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
}

function renderGrid() {
  const trip = readTrip();
  const visible = sortPlaces(getFiltered(true));

  el.grid.replaceChildren(...visible.map(function (place) {
    return createCard(place, trip.band);
  }));

  el.count.textContent = "Showing " + visible.length + " of " + PLACES.length + " destinations";
  el.empty.hidden = visible.length > 0;
  el.clearSearch.hidden = state.query === "";

  updateCategoryButtons();
  updateAddButtons();
  updateSuggestions(trip.band);
  updateUrl();
}

function selectedPlaces() {
  return state.selected.map(function (id) { return PLACE_BY_ID[id]; });
}

function chosenTransportIndex(place, band) {
  if (state.transport[place.id] !== undefined) {
    return state.transport[place.id];
  }
  const suggestedIndex = place.transport.findIndex(function (option) {
    return isSuggested(option, band);
  });
  return suggestedIndex === -1 ? 0 : suggestedIndex;
}

function toggleSelected(id) {
  const index = state.selected.indexOf(id);
  if (index === -1) {
    state.selected.push(id);
  } else {
    state.selected.splice(index, 1);
  }
  updateAddButtons();
  renderTrip();
}

function tripRow(place, trip) {
  const row = make("li", "trip-row");

  const info = make("div", "trip-row-info");
  info.append(
    make("strong", "", place.name),
    make("span", "small", "Entry: " + (place.entry ? money(place.entry) + " per person" : "no entry fee"))
  );

  const select = make("select", "transport-select");
  select.setAttribute("aria-label", "Transport to " + place.name);
  orderedOptions(place.transport, trip.band).forEach(function (entry) {
    const option = make("option", "", entry.item.mode + " · " + money(entry.item.price) +
      (isSuggested(entry.item, trip.band) ? " (suggested)" : ""));
    option.value = String(entry.index);
    select.appendChild(option);
  });
  select.value = String(chosenTransportIndex(place, trip.band));
  select.addEventListener("change", function () {
    state.transport[place.id] = Number(select.value);
    renderTrip();
  });

  const remove = make("button", "link-btn", "Remove");
  remove.type = "button";
  remove.addEventListener("click", function () { toggleSelected(place.id); });

  row.append(info, select, remove);
  return row;
}

function fillChoices(select, places, key, current, unit) {
  select.replaceChildren();

  if (places.length === 0) {
    select.appendChild(make("option", "", "Add a place to see options"));
    select.disabled = true;
    return "";
  }

  select.disabled = false;
  const values = [];

  places.forEach(function (place) {
    const group = make("optgroup");
    group.label = place.name;
    place[key].forEach(function (item, index) {
      const value = place.id + "|" + index;
      const option = make("option", "", item.name + " · " + money(item.price) + " " + unit);
      option.value = value;
      values.push(value);
      group.appendChild(option);
    });
    select.appendChild(group);
  });

  const chosen = values.indexOf(current) === -1 ? values[0] : current;
  select.value = chosen;
  return chosen;
}

function findChoice(places, key, value) {
  const parts = value.split("|");
  const place = places.find(function (p) { return p.id === parts[0]; });
  return place ? place[key][Number(parts[1])] : null;
}

function addBudgetRow(label, amount, emphasis) {
  const term = make("dt", emphasis ? "budget-total" : "", label);
  const value = make("dd", emphasis ? "budget-total" : "", money(amount));
  el.budget.append(term, value);
}

function renderBudget(trip, places) {
  el.budget.replaceChildren();

  if (!trip.valid) {
    el.budgetNote.textContent = "Enter valid numbers in Step 1 to see your budget.";
    return;
  }

  let transport = 0;
  let entry = 0;
  places.forEach(function (place) {
    transport += place.transport[chosenTransportIndex(place, trip.band)].price * trip.members * 2;
    entry += place.entry * trip.members;
  });

  const stay = findChoice(places, "stays", state.stay);
  const restaurant = findChoice(places, "restaurants", state.restaurant);
  const rooms = Math.ceil(trip.members / trip.perRoom);
  const nights = Math.max(trip.days - 1, 0);
  const stayTotal = stay ? stay.price * rooms * nights : 0;
  const foodTotal = restaurant ? restaurant.price * trip.members * MEALS_PER_DAY * trip.days : 0;
  const total = transport + entry + stayTotal + foodTotal;

  addBudgetRow("Transport (return trip, all members)", transport);
  addBudgetRow("Entry tickets", entry);
  addBudgetRow("Accommodation (" + rooms + " room(s) × " + nights + " night(s))", stayTotal);
  addBudgetRow("Food (" + MEALS_PER_DAY + " meals/day × " + trip.days + " day(s))", foodTotal);
  addBudgetRow("Total estimate", total, true);
  addBudgetRow("Per person", total / trip.members, true);

  el.budgetNote.textContent = places.length === 0
    ? "Add places from Step 2 to see transport, entry and food costs."
    : "Indicative prices only. Confirm current fares, entry fees and room rates before you travel. Food assumes " +
      MEALS_PER_DAY + " restaurant meals a day for every member.";
}

function renderTrip() {
  const trip = readTrip();
  const places = selectedPlaces();

  const messages = [];
  if (!trip.membersOk) messages.push("Members must be a whole number from 1 to " + MAX_MEMBERS + ".");
  if (!trip.daysOk) messages.push("Days must be a whole number from 1 to " + MAX_DAYS + ".");
  el.tripMsg.textContent = messages.join(" ");

  el.emptyTrip.hidden = places.length > 0;
  el.selectedList.replaceChildren(...places.map(function (place) {
    return tripRow(place, trip);
  }));

  state.stay = fillChoices(el.stay, places, "stays", state.stay, "per room per night");
  state.restaurant = fillChoices(el.restaurant, places, "restaurants", state.restaurant, "per person per meal");

  renderBudget(trip, places);
}

function readUrl() {
  const params = new URLSearchParams(window.location.search);

  if (params.has("q")) state.query = params.get("q");

  const category = params.get("category");
  if (category === "all" || Object.prototype.hasOwnProperty.call(CATEGORY_LABELS, category)) {
    state.category = category;
  }

  const district = params.get("district");
  if (district === "ratnapura" || district === "kegalle") state.district = district;

  const sort = params.get("sort");
  if (sort === "az" || sort === "za") state.sort = sort;

  if (params.get("fit") === "1") state.fitStay = true;
}

function updateUrl() {
  const params = new URLSearchParams();
  const query = state.query.trim();

  if (query) params.set("q", query);
  if (state.category !== "all") params.set("category", state.category);
  if (state.district !== "all") params.set("district", state.district);
  if (state.sort !== "default") params.set("sort", state.sort);
  if (state.fitStay) params.set("fit", "1");

  const queryString = params.toString();
  try {
    window.history.replaceState(null, "", window.location.pathname + (queryString ? "?" + queryString : ""));
  } catch (error) {
  }
}

function syncFilterInputs() {
  el.search.value = state.query;
  el.district.value = state.district;
  el.sort.value = state.sort;
  el.fitStay.checked = state.fitStay;
}

function clearSearch() {
  state.query = "";
  el.search.value = "";
  renderGrid();
}

function resetFilters() {
  state.query = "";
  state.category = "all";
  state.district = "all";
  state.sort = "default";
  state.fitStay = false;
  syncFilterInputs();
  renderGrid();
}

el.search.addEventListener("input", function () {
  state.query = el.search.value;
  renderGrid();
});

el.search.addEventListener("keydown", function (event) {
  if (event.key === "Escape" && el.search.value !== "") {
    event.preventDefault();
    clearSearch();
  }
});

el.clearSearch.addEventListener("click", function () {
  clearSearch();
  el.search.focus();
});

el.district.addEventListener("change", function () {
  state.district = el.district.value;
  renderGrid();
});

el.sort.addEventListener("change", function () {
  state.sort = el.sort.value;
  renderGrid();
});

el.fitStay.addEventListener("change", function () {
  state.fitStay = el.fitStay.checked;
  renderGrid();
});

el.resetButtons.forEach(function (button) {
  button.addEventListener("click", resetFilters);
});

function onTripChange() {
  if (state.fitStay) {
    renderGrid();
  } else {
    updateSuggestions(readTrip().band);
  }
  renderTrip();
}

[el.members, el.days, el.perRoom, el.band].forEach(function (input) {
  input.addEventListener("input", onTripChange);
  input.addEventListener("change", onTripChange);
});

el.stay.addEventListener("change", function () {
  state.stay = el.stay.value;
  renderTrip();
});

el.restaurant.addEventListener("change", function () {
  state.restaurant = el.restaurant.value;
  renderTrip();
});

buildCategoryButtons();
readUrl();
syncFilterInputs();
renderGrid();
renderTrip();
