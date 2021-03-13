export async function readList() {
  return JSON.parse(localStorage.getItem("items")) || [];
}
