export async function getCity() {
  const url = "https://get.geojs.io/v1/ip/geo.json";
  const response = await fetch(url);
  const objJSON = await response.json();
  return objJSON.city;
}
