// This is a placeholder file to show how you can "mock" fetch requests using
// the nock library.
// You can delete the contents of the file once you have understood how it
// works.

import { fetchUserData } from "./utils/fetchUserData.js";

// export function makeFetchRequest() {
//   return fetch("https://example.com/test");
// }

const fetchBtn = document.getElementById("fetchBtn");
const usernamesInput = document.getElementById("usernames");
const languageSelectorDiv = document.getElementById("languageSelector");
const languageSelect = document.getElementById("languageSelect");
const leaderboardTable = document.getElementById("leaderboardTable");
const leaderboardBody = leaderboardTable.querySelector("tbody");
let userData = []; //this is for userDataStorage array type
fetchBtn.addEventListener("click", async () => {
  const rawUserName = usernamesInput.value.trim();
  if (!rawUserName) {
    alert("Please Enter At Lease One UserName");
    return;
  }
  const usernames = rawUserName
    .split(",")
    .map((ele) => ele.trim())
    .filter(Boolean);
  //reset area
  userData = [];
  languageSelectorDiv.style.display = "none";
  leaderboardTable.style.display = "none";
  fetchBtn.disabled = true;
  fetchBtn.textContent = "Fetching.....";
  try {
    for (const username of usernames) {
      try {
        const data = await fetchUserData(username);
        userData.push(data);
      } catch (error) {
        console.warn(error.message);
        alert(error.message);
        continue;
      }
    }
    if (userData.length === 0) {
      alert("You have no User/s Data");
      return;
    }
    const tempLanguages = userData.flatMap((ele) =>
      Object.keys(ele.ranks.languages)
    );
    const languages = ["overall", ...new Set(tempLanguages)];
    populateLanguageDropDown(languages);
    leaderboardTable.style.display = "table";
    languageSelect.value = "overall";
    updateLeaderboardTable("overall");
  } catch (error) {
    alert("Error when fetching userdata");
    console.error(error);
  } finally {
    fetchBtn.disabled = false;
    fetchBtn.textContent = "Show Leaderboard";
  }
});
function populateLanguageDropDown(languages) {
  languageSelectorDiv.style.display = "block";
  languageSelect.innerHTML = "";
  languages.forEach((lang) => {
    const option = document.createElement("option");
    option.value = lang;
    option.textContent = lang.charAt(0).toUpperCase() + lang.slice(1);
    languageSelect.appendChild(option);
  });
}
languageSelect.addEventListener("change", () => {
  updateLeaderboardTable(languageSelect.value);
});
function updateLeaderboardTable(language) {
  leaderboardBody.innerHTML = "";
  const filteredUsers = userData.filter((user) => {
    if (!user) return false;
    if (language === "overall") {
      return user.ranks.overall && typeof user.ranks.overall.score == "number";
    } else {
      return (
        user.ranks.languages &&
        user.ranks.languages[language] &&
        typeof user.ranks.languages[language].score == "number"
      );
    }
  });
  filteredUsers.sort((a, b) => {
    const scoreA =
      language === "overall"
        ? a.ranks.overall.score
        : a.ranks.languages[language].score;
    const scoreB =
      language == "overall"
        ? b.ranks.overall.score
        : b.ranks.languages[language].score;
    return scoreB - scoreA;
  });
  if (filteredUsers.length === 0) {
    leaderboardBody.innerHTML = `<tr><td>No user Have ranking for ${language}</td></tr>`;
  }
  filteredUsers.map((user, i) => {
    const tr = document.createElement("tr");
    if (i == 0) tr.classList.add("top-scorer");

    const usernameTd = document.createElement("td");
    usernameTd.textContent = user.username;
    tr.appendChild(usernameTd);

    const clanTd = document.createElement("td");
    clanTd.textContent = user.clan || "";
    tr.appendChild(clanTd);

    const scoreTd = document.createElement("td");
    scoreTd.textContent =
      language === "overall"
        ? user.ranks.overall.score
        : user.ranks.languages[language].score;

    tr.appendChild(scoreTd);
    leaderboardBody.appendChild(tr);
  });
}
