import {
  fetchMultipleUsers,
  getAvailableLanguages,
  getLeaderboard,
} from "./utils.mjs";

const form = document.getElementById("leaderboard-form");
const usernamesInput = document.getElementById("usernames-input");
const userDataElement = document.getElementById("user-data");
const languageSelectContainer = document.getElementById(
  "language-select-container",
);
const languageSelect = document.getElementById("language-select");
const leaderboardTableContainer = document.getElementById(
  "leaderboard-table-container",
);

const tableTemplate = document.getElementById("leaderboard-table-template");

let currentUsers = [];

function renderTable(ranking = "overall") {
  if (!leaderboardTableContainer) return;
  leaderboardTableContainer.innerHTML = "";

  const leaderboard = getLeaderboard(currentUsers, ranking);
  if (leaderboard.length === 0) {
    leaderboardTableContainer.innerHTML = `<p>No users found with rankings in ${ranking}.</p>`;
    return;
  }

  if (!tableTemplate) return;

  const tableFragment = tableTemplate.content.cloneNode(true);
  const caption = tableFragment.querySelector("caption");
  if (caption) {
    caption.textContent = `Leaderboard - ${ranking === "overall" ? "Overall" : ranking}`;
  }

  const tbody = tableFragment.querySelector("tbody");
  const templateRow = tbody.querySelector("tr");
  templateRow.remove();

  leaderboard.forEach((user, index) => {
    const row = templateRow.cloneNode(true);
    const usernameTd = row.querySelector(".username");
    const clanTd = row.querySelector(".clan");
    const scoreTd = row.querySelector(".score");

    usernameTd.textContent = user.username;
    clanTd.textContent = user.clan;
    scoreTd.textContent = user.score;

    if (index === 0) {
      row.classList.add("top-user");
      scoreTd.classList.add("top-score");
    }

    tbody.appendChild(row);
  });

  leaderboardTableContainer.appendChild(tableFragment);
}

if (languageSelect) {
  languageSelect.addEventListener("change", () => {
    renderTable(languageSelect.value);
  });
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const usernames = usernamesInput.value.trim();
  if (!usernames || usernames.length < 3) {
    if (languageSelectContainer) languageSelectContainer.hidden = true;
    if (leaderboardTableContainer) leaderboardTableContainer.innerHTML = "";
    userDataElement.innerHTML =
      '<p class="error-message" role="alert">Please enter at least 3 characters.</p>';
    return;
  }

  // Detect offline status in browser
  if (typeof navigator !== "undefined" && !navigator.onLine) {
    if (languageSelectContainer) languageSelectContainer.hidden = true;
    if (leaderboardTableContainer) leaderboardTableContainer.innerHTML = "";
    userDataElement.innerHTML =
      '<p class="error-message" role="alert">You appear to be offline. Please check your internet connection and try again.</p>';
    return;
  }

  userDataElement.innerHTML = "<p>Loading...</p>";
  if (leaderboardTableContainer) leaderboardTableContainer.innerHTML = "";

  try {
    const userData = await fetchMultipleUsers(usernames);

    userDataElement.innerHTML = "";

    const validUsers = userData.filter((item) => item && !item.error);
    currentUsers = validUsers;

    if (validUsers.length > 0 && languageSelect && languageSelectContainer) {
      const languages = getAvailableLanguages(validUsers);
      languageSelect.innerHTML = "";
      for (const lang of languages) {
        const option = document.createElement("option");
        option.value = lang;
        option.textContent = lang === "overall" ? "Overall" : lang;
        if (lang === "overall") {
          option.selected = true;
        }
        languageSelect.appendChild(option);
      }
      languageSelectContainer.hidden = false;
      renderTable("overall");
    } else {
      if (languageSelectContainer) languageSelectContainer.hidden = true;
      if (leaderboardTableContainer) leaderboardTableContainer.innerHTML = "";
    }

    // Display error messages for any users that failed
    for (const item of userData) {
      if (item && item.error) {
        const pElement = document.createElement("p");
        pElement.className = "error-message";
        pElement.setAttribute("role", "alert");
        if (item.error.includes("not found")) {
          pElement.textContent = `${item.error}. Please check the spelling and try again.`;
        } else {
          pElement.textContent = item.error;
        }
        userDataElement.appendChild(pElement);
      }
    }
  } catch (error) {
    if (languageSelectContainer) languageSelectContainer.hidden = true;
    if (leaderboardTableContainer) leaderboardTableContainer.innerHTML = "";
    userDataElement.innerHTML = `<p class="error-message" role="alert">${error.message || "An unexpected error occurred. Please try again."}</p>`;
  }
});
