// Сохраняет список
export function saveList(items) {
  localStorage.setItem("items", JSON.stringify(items));
}
