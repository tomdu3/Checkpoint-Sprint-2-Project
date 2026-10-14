import { fetchMultipleUsers } from "./utils.mjs";

// fetch multiple users

const userData = await fetchMultipleUsers("tomdu3, johndoe888");

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
