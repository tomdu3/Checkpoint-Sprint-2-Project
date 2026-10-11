import { makeFetchRequest } from "./utils.mjs";

const userData = await makeFetchRequest("tomdu3");
// console.log(JSON.stringify(userData, null, 2));

// display userData

const userDataElement = document.getElementById("user-data");
for (const key in userData) {
  const value = userData[key];
  const pElement = document.createElement("p");
  if (Array.isArray(value) || typeof value === "object") {
    pElement.textContent = `${key}: ${JSON.stringify(value)}`;
  } else {
    pElement.textContent = `${key}: ${value}`;
  }
  userDataElement.appendChild(pElement);
}
