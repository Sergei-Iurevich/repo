import { weather } from "./weather";
import { getCity } from "./getCity";
import { getWeather } from "./getWeather";
import { readList } from "./readList";
import { saveList } from "./saveList";
import "regenerator-runtime/runtime";

describe("app weather testing", () => {
  describe("testing function weather", () => {
    let el;
    let divForWeather;
    let form;
    let input;
    let button;
    let list;
    let map;

    global.fetch = jest.fn((url) => {
      const regStrWeather =
        `^https://api\\.openweathermap\\.org/` +
        `data/2\\.5/weather\\?units=metric&q=`;
      const regexpWeather = new RegExp(regStrWeather, "i");
      const regStrGeo = "^https://get\\.geojs\\.io/v1/ip/geo\\.json";
      const regexpGeo = new RegExp(regStrGeo, "i");

      if (regexpWeather.test(url)) {
        const regexp1 = /Moscow/i;
        const regexp2 = /London/i;
        if (regexp1.test(url)) {
          return Promise.resolve({
            json: () =>
              Promise.resolve({
                name: "Moscow",
                main: { temp: 5 },
                weather: [{ icon: "d02" }],
              }),
          });
        }
        if (regexp2.test(url)) {
          return Promise.resolve({
            json: () =>
              Promise.resolve({
                name: "London",
                main: { temp: 10 },
                weather: [{ icon: "d03" }],
              }),
          });
        }
        return new Error("404: city not found");
      }
      if (regexpGeo.test(url)) {
        return Promise.resolve({
          json: () =>
            Promise.resolve({
              city: "Moscow",
            }),
        });
      }
      return new Error("404");
    });

    function submitForm(strValue) {
      input.value = strValue;
      form.dispatchEvent(new Event("submit"));
    }

    function flushPromises() {
      return new Promise((resolve) => setImmediate(resolve));
    }

    beforeEach(async () => {
      el = document.createElement("div");
      await weather(el);
      divForWeather = el.querySelector(".divForWeather");
      form = el.querySelector("form");
      input = el.querySelector("input");
      button = el.querySelector("button");
      list = el.querySelector(".list");
      map = el.querySelector(".map");
    });

    it("is function", () => {
      expect(typeof weather).toBe("function");
    });

    it("create proper markup", () => {
      expect(divForWeather).toBeTruthy();
      expect(form).toBeTruthy();
      expect(input).toBeTruthy();
      expect(button).toBeTruthy();
      expect(list).toBeTruthy();
      expect(map).toBeTruthy();
    });

    it("create markup for show city,temperature and icon", () => {
      const span = divForWeather.querySelectorAll("span");
      const img = divForWeather.querySelector("img");
      expect(span).toBeTruthy();
      expect(img).toBeTruthy();
      expect(span.length).toBe(2);
      expect(span[0].textContent).toBe("Moscow");
      expect(span[1].textContent).toBe("5");
      expect(img.src).toBe("http://openweathermap.org/img/wn/d02@2x.png");
    });

    it("Draw map", () => {
      const img = map.querySelector("img");
      expect(img).toBeTruthy();
      const strGoogleMap =
        "^https://maps\\.googleapis\\.com\\/maps\\/a" +
        "pi\\/staticmap\\?center=\\w+&size=500x500&key=";
      const regexp = new RegExp(strGoogleMap, "i");
      const regexpCity = /Moscow/i;
      expect(regexp.test(img.src)).toBeTruthy();
      expect(regexpCity.test(img.src)).toBeTruthy();
    });
    it("Draw list after loading", () => {
      const myList = el.querySelector(".list");
      const ol = myList.querySelector("ol");
      const li = ol.querySelectorAll("li");
      expect(myList).toBeTruthy();
      expect(ol).toBeTruthy();
      expect(li).toBeTruthy();
      expect(li.length).toBe(0);
    });
    it("Draw list after click on button", async () => {
      for (let i = 0; i < 100; i++) {
        submitForm("London");
      }
      await flushPromises();
      const ol = list.querySelector("ol");
      const li = ol.querySelectorAll("li");
      expect(list).toBeTruthy();
      expect(ol).toBeTruthy();
      expect(li).toBeTruthy();
      expect(li.length).toBe(10);
    });
  });

  describe("testing function: getCity, getWeather,readList, saveList", () => {
    it("testing getCity, should show the name city", async () => {
      const name = await getCity();
      expect(name).toBe("Moscow");
    });

    it("getWeather, should show the name city", async () => {
      const data = {
        name: "London",
        main: { temp: 10 },
        weather: [{ icon: "d03" }],
      };
      expect(await getWeather("London")).toEqual(data);
    });

    it("testing function saveList", () => {
      saveList(["London", "Paris"]);
      const data = JSON.parse(localStorage.getItem("items")) || [];
      expect(data).toEqual(["London", "Paris"]);
    });

    it("testing function readList", async () => {
      localStorage.setItem("items", JSON.stringify(["London", "Paris"]));
      const data = await readList();
      expect(data).toEqual(["London", "Paris"]);
    });
  });
});
