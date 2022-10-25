const container = document.getElementById("main_container");
const title = document.getElementById("title");
const containerCheckBox = document.getElementById("container_checkbox");
const inputSearch = document.getElementById("search");

async function bringEventsJson() {
  try {
    var eventsJsonApi = await fetch("https://mh-amazing.herokuapp.com/amazing");
    eventsJsonApi = await eventsJsonApi.json();
  } catch (error) {
    console.log(error);
  }

  const date = eventsJsonApi.date;
  const card = eventsJsonApi.events;
  const homeCard = card.filter(() => title.textContent.includes("Home"));
  const upcomingCard = card
    .filter(() => title.textContent.includes("Upcoming"))
    .filter((card) => date < card.date);
  const pastCard = card
    .filter(() => title.textContent.includes("Past"))
    .filter((card) => date > card.date);
  const categorys = card.reduce(
    (allCatergory, event) =>
      Array.from(new Set([...allCatergory, event.category])),
    []
  );
  
  let cardsCombined = [...homeCard, ...upcomingCard, ...pastCard];
  cardsCombined.forEach(getCard);
  categorys.forEach(getCheckBox);

  function getCheckBox(category) {
    containerCheckBox.innerHTML += `
      <div class="form-check">
        <input
          class="form-check-input boxId"
          type="checkbox"
          id="${category}"
          value="${category}"
        />
        <label class="form-check-label" for="inlineCheckbox1"
          >${category}</label
        >
      </div>
    `;
  }

  let boxId = document.querySelectorAll(".boxId");
  boxId = Array.from(boxId);
  boxId.forEach((box) => box.addEventListener("click", boxChecked));

  inputSearch.addEventListener("input", boxChecked);

  function boxChecked() {
    let filterBox = checkCategory(cardsCombined);
    let filterSearch = cardsBySearch(filterBox, inputSearch.value);
    if (filterSearch.length !== 0) {
      container.innerHTML = ``;
    }
    filterSearch.forEach(getCard);
  }

  function checkCategory(array) {
    let checkedBoxes = boxId
      .filter((check) => check.checked)
      .map((boxCategory) => boxCategory.value);
    if (checkedBoxes.length > 0) {
      let filteredBoxes = array.filter((event) =>
        checkedBoxes.includes(event.category)
      );
      return filteredBoxes;
    }
    return array;
  }
}

bringEventsJson();

function cardsBySearch(array, text) {
  let cardsFilterBySearch = array.filter((card) =>
    card.name.toLowerCase().includes(text.toLowerCase())
  );
  if (cardsFilterBySearch.length < 1) {
    searchNull();
    return [];
  }
  return cardsFilterBySearch;
}

let url
if(title.text.includes('Home')){
  url = {
    details: `./pages/details.html`,
    img404: `./assets/img/404.png`,
  }
}else{
  url = {
    details: `./pages/details.html`,
    img404: `./assets/img/404.png`,
  }
}


function searchNull() {
  container.innerHTML = `
  <div class="d-flex flex-column align-items-center">
  <h3>THE SEARCH IS UNAVAILABLE</h3>
  <img class="img-fluid d-flex justify-content-center align-items-center" style="height: 370px;"  src="${url.img404}" alt="404notfound">
</div>
  `;
}

function getCard(event) {
  container.innerHTML += `
    <div class="card mt-4 m-1 card_container">
          <img src="${event.image}" class="card-img-top img_card" alt="${event.name}" />
          <div
            class="card-body d-flex flex-column align-items-center justify-content-evenly shadow"
          >
            <h5 class="card-title">${event.name}</h5>
            <p class="card-text">
              ${event.description}
            </p>
            <div class="w-100 d-flex align-items-center justify-content-evenly">
              <p>Price $${event.price}</p>
              <a href="${url.details}?id=${event.id}" class="d-flex btn btn-danger">Details</a>
            </div>
          </div>
        </div>
    `;
}