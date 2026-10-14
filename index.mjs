import { fetchMultipleUsers } from "./utils.mjs";

const form = document.getElementById("leaderboard-form");
const usernamesInput = document.getElementById("usernames-input");
const userDataElement = document.getElementById("user-data");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const usernames = usernamesInput.value.trim();
  if (!usernames || usernames.length < 3) {
    userDataElement.innerHTML =
      '<p class="error-message" role="alert">Please enter at least 3 characters.</p>';
    return;
  }

  // Detect offline status in browser
  if (typeof navigator !== "undefined" && !navigator.onLine) {
    userDataElement.innerHTML =
      '<p class="error-message" role="alert">You appear to be offline. Please check your internet connection and try again.</p>';
    return;
  }

  userDataElement.innerHTML = "<p>Loading...</p>";

  try {
    const userData = await fetchMultipleUsers(usernames);

    // display userData
    userDataElement.innerHTML = "";

    for (const item of userData) {
      const pElement = document.createElement("p");
      if (item && item.error) {
        pElement.className = "error-message";
        pElement.setAttribute("role", "alert");
        // Ensure not-found messages are actionable
        if (item.error.includes("not found")) {
          pElement.textContent = `${item.error}. Please check the spelling and try again.`;
        } else {
          pElement.textContent = item.error;
        }
      } else {
        pElement.textContent = JSON.stringify(item);
      }
      userDataElement.appendChild(pElement);
    }
  } catch (error) {
    userDataElement.innerHTML = `<p class="error-message" role="alert">${error.message || "An unexpected error occurred. Please try again."}</p>`;
  }
});
