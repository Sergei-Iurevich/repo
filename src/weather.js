import { getCity } from "./getCity";
import { getWeather } from "./getWeather";
import { readList } from "./readList";
import { saveList } from "./saveList";

export async function weather(elem) {
  const el = elem;
  const mapKey = "AIzaSyDANLeEnr2Wf05hG0wxHA0Ucqz5CeZF_Cw";
  const appID = "6483f07f86904206d5977c6c6ae4e4e1";

  el.innerHTML = `<div class="divForWeather"> </div>
                        <form>
                                    <input
                                            id="userInput"
                                            placeholder="Type and press enter"
                                            required
                                            autofocus
                                    />
                                    <button>Add item</button>
                        </form>
                        <div class="list"></div>
                        <div class="map"></div>
                        `;

  function drawWeather(elem1, data) {
    const element = elem1;
    element.innerHTML = `     
        <span>${data.name}</span>
        <span>${data.main.temp}</span>
<img src="http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png">
        `;
  }

  function drawMap(element, city) {
    const elem2 = element;
    const cityName = city.split(" ").join("+");
    const url =
      `https://maps.googleapis.com/maps/api/staticmap?center=` +
      `${cityName}&size=500x500&key=${mapKey}`;
    elem2.innerHTML = `<img src=${url}>`;
  }

  function drawList(elem3, items) {
    const element = elem3;
    const list = items
      .map((item) => `<li><a href="#">${item}</a></li>`)
      .join("");
    element.innerHTML = `<ol>${list}</ol>`;
  }

  const divForWeather = el.querySelector(".divForWeather");
  const map = el.querySelector(".map");
  const form = el.querySelector("form");
  const listEl = el.querySelector(".list");

  const data = await getWeather(await getCity(), appID);
  drawWeather(divForWeather, data);
  drawMap(map, await getCity());

  const items = await readList();

  drawList(listEl, items);

  listEl.addEventListener("click", async (ev) => {
    const liElement = ev.target;
    const city = liElement.innerText;
    const dataWeather = await getWeather(city, appID);
    drawWeather(divForWeather, dataWeather);
    drawMap(map, city);
  });

  form.addEventListener("submit", async (ev) => {
    ev.preventDefault();

    const formElement = ev.target;
    const input = formElement.querySelector("input");
    const { value } = input;
    input.value = "";

    const city = value;

    const data1 = await getWeather(city, appID);

    drawWeather(divForWeather, data1);
    drawMap(map, city);

    items.push(value);

    if (items.length > 10) {
      items.splice(0, 1);
    }

    drawList(listEl, items);

    saveList(items);
  });
}
