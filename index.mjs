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
  } catch (error) {
    alert("Error when fetching userdata");
    console.error(err);
  } finally {
    fetchBtn.disabled = false;
    fetchBtn.textContent = "Show Leaderboard";
  }
});
