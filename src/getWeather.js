export async function getWeather(cityName, appID) {
  const city = cityName.split(" ").join("+");
  const url =
    `https://api.openweathermap.org/data/2.5/weather?units=` +
    `metric&q=${city}&appid=${appID}`;
  const response = await fetch(url);
  const data = await response.json();
  return data;
}
