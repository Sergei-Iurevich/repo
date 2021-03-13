import { getCity } from "./getCity.js";
import { getWeather } from "./getWeather.js";
import { readList } from "./readList.js";
import { saveList } from "./saveList.js";

export async function weather(el) {
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

  function drawWeather(element, data) {
    element.innerHTML = `     
        <span>${data.name}</span>
        <span>${data.main.temp}</span>
<img src="http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png">
        `;
  }

  function drawMap(element, city) {
    const cityName = city.split(" ").join("+");
    const url =
      `https://maps.googleapis.com/maps/api/staticmap?center=` +
      `${cityName}&size=500x500&key=${mapKey}`;
    element.innerHTML = `<img src=${url}>`;
  }

  function drawList(element, items) {
    const list = items
      .map(function (item) {
        return `<li><a href="#">${item}</a></li>`;
      })
      .join("");
    element.innerHTML = `<ol>${list}</ol>`;
  }

  // Получаем указатели на нужные элементы
  const divForWeather = el.querySelector(".divForWeather");
  const map = el.querySelector(".map");
  const form = el.querySelector("form");
  const listEl = el.querySelector(".list");

  const data = await getWeather(await getCity(), appID);
  drawWeather(divForWeather, data);
  drawMap(map, await getCity());

  // Читаем список при старте
  const items = await readList();

  // и отрисовываем список
  drawList(listEl, items);

  listEl.addEventListener("click", async (ev) => {
    const liElement = ev.target;
    const city = liElement.innerText;
    const dataWeather = await getWeather(city, appID);
    drawWeather(divForWeather, dataWeather);
    drawMap(map, city);
  });

  form.addEventListener("submit", async (ev) => {
    // чтобы не перезагружать страницу
    ev.preventDefault();

    // читаем значение из формы
    const formElement = ev.target;
    const input = formElement.querySelector("input");
    const { value } = input;
    input.value = "";

    const city = value;

    const data1 = await getWeather(city, appID);

    drawWeather(divForWeather, data1);
    drawMap(map, city);

    // добавляем элемент в список
    items.push(value);

    if (items.length > 10) {
      items.splice(0, 1);
    }

    // обновляем список
    drawList(listEl, items);

    // сохраняем список
    saveList(items);
  });
}
