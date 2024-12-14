import {
  fetchPlayerStats,
  fetchWinLossStats,
  fetchHeroes,
  fetchTotals,
  fetchRatings,
  fetchRecentMatches,
  fetchUserHeroes
} from "./modules/api.js";

import {
  renderPlayerStats,
  renderWinLossStats,
  //renderHeroes,
  renderTotals,
  renderPlayerRatings,
  renderRecentMatches,
  renderUserHeroes
} from "./modules/render.js";

document.getElementById("searchButton").addEventListener("click", async () => {
  const accountId = document.getElementById("accountIdInput").value.trim();
  if (!accountId) {
    alert("Please enter a valid Account ID");
    return;
  }

  try {
    // Fetch and render player statistics
    const playerStats = await fetchPlayerStats(accountId);
    renderPlayerStats(playerStats);

    // Fetch and render win/loss stats
    const winLossStats = await fetchWinLossStats(accountId);
    renderWinLossStats(winLossStats);

    // Fetch and render heroes
    const heroes = await fetchUserHeroes(accountId);
    renderUserHeroes(heroes);

    // Fetch and render totals
    const totals = await fetchTotals(accountId);
    renderTotals(totals);

    // Fetch and render player ratings
    const ratings = await fetchRatings(accountId);
    renderPlayerRatings(ratings);

    // Fetch and render recent matches
    const recentMatches = await fetchRecentMatches(accountId);
    renderRecentMatches(recentMatches); // Render the recent matches

  } catch (error) {
    alert("Error fetching data.");
    console.error(error);
  }
});
