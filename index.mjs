import { fetchMultipleUsers } from "./utils.mjs";

const form = document.getElementById("leaderboard-form");
const usernamesInput = document.getElementById("usernames-input");
const userDataElement = document.getElementById("user-data");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const usernames = usernamesInput.value;
  userDataElement.innerHTML = "<p>Loading...</p>";

  const userData = await fetchMultipleUsers(usernames);

  // display userData
  userDataElement.innerHTML = "";
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
});
