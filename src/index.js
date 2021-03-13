import { weather } from "./weather.js";

const div = document.createElement("div");
div.id = "app";
document.body.prepend(div);
weather(document.querySelector("#app")).then();
