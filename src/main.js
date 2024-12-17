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

// Function to handle the search logic
async function handleSearch() {
  const accountId = document.getElementById("accountIdInput").value.trim();
  if (!accountId) {
      alert("Please enter a valid Account ID");
      return;
  }

  // Save the account ID to local storage
  localStorage.setItem("accountId", accountId);

  // Show the filter container and the spinner
  const filterContainer = document.getElementById("filterContainer");
  filterContainer.classList.remove("hidden");

  // List of sections and their respective spinners
  const sections = [{
          section: document.getElementById("playerStats"),
          spinner: document.querySelector("#playerStats .spinner")
      },
      {
          section: document.getElementById("winLossStats"),
          spinner: document.querySelector("#winLossStats .spinner")
      },
      {
          section: document.getElementById("heroesStats"),
          spinner: document.querySelector("#heroesStats .spinner")
      },
      {
          section: document.getElementById("totals"),
          spinner: document.querySelector("#totals .spinner")
      },
      {
          section: document.getElementById("ratingsContainer"),
          spinner: document.querySelector("#ratingsContainer .spinner")
      },
      {
          section: document.getElementById("recentMatches"),
          spinner: document.querySelector("#recentMatches .spinner")
      }
  ];

  // Hide any previous error message
  const playerNotFound = document.getElementById("playerNotFound");
  if (playerNotFound) {
      playerNotFound.classList.add("hidden");
  }

  try {
      // Show the spinner and the section for each item in the list
      sections.forEach(({section, spinner}) => {
          if (section && spinner) {
              section.classList.remove("hidden");
              spinner.classList.remove("hidden");
          }
      });

      // Fetch and render player statistics
      const playerStats = await fetchPlayerStats(accountId);

      // Check if player exists by checking for the 404 response (Player not found)
      if (playerStats && playerStats.error === "Player not found") {
          throw new Error("Player not found");
      } else {
          renderPlayerStats(playerStats);

          // Fetch and render win/loss stats
          const winLossStats = await fetchWinLossStats(accountId);
          renderWinLossStats(winLossStats);

          // Fetch and render user heroes
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
          renderRecentMatches(recentMatches);
      }

  } catch (error) {
      console.error("Error fetching player stats:", error);

      // Display error message if player is not found
      const playerNotFound = document.getElementById("playerNotFound");
      if (playerNotFound) {
          playerNotFound.classList.remove("hidden"); // Show the error message

          // Hide the sections and filter container
          document.getElementById("filterContainer").classList.add("hidden");

          document.getElementById("playerStats").classList.add("hidden");
          document.getElementById("winLossStats").classList.add("hidden");
          document.getElementById("heroesStats").classList.add("hidden");
          document.getElementById("totals").classList.add("hidden");
          document.getElementById("ratingsContainer").classList.add("hidden");
          document.getElementById("recentMatches").classList.add("hidden");
      }
  } finally {
      // Hide all spinners after fetching (only if they exist)
      sections.forEach(({spinner}) => {
          if (spinner) {
              spinner.classList.add("hidden");
          }
      });
  }
}

// Function to load account ID from local storage on page load
function loadAccountId() {
  const savedAccountId = localStorage.getItem("accountId");
  if (savedAccountId) {
      document.getElementById("accountIdInput").value = savedAccountId;
  }
}

// Call loadAccountId when the page loads
window.onload = loadAccountId;

// Event listener for the button click
document.getElementById("searchButton").addEventListener("click", handleSearch);

// Event listener for the Enter key press
document.getElementById("accountIdInput").addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
      handleSearch();
  }
});

// Function to handle section filtering
function handleFilter(filterType) {
	const sections = [{
			section: document.getElementById("playerStats"),
			id: "showPlayerInfo"
		},
		{
			section: document.getElementById("winLossStats"),
			id: "showWinLossStats"
		},
		{
			section: document.getElementById("heroesStats"),
			id: "showHeroStats"
		},
		{
			section: document.getElementById("totals"),
			id: "showTotals"
		},
		{
			section: document.getElementById("ratingsContainer"),
			id: "showRatings"
		},
		{
			section: document.getElementById("recentMatches"),
			id: "showRecentMatches"
		}
	];

	// Loop through sections to show or hide them based on the filter
	sections.forEach(({section, id}) => {
		if (filterType === "all" || filterType === id) {
			section.classList.remove("hidden"); // Show section
		} else {
			section.classList.add("hidden"); // Hide section
		}
	});
}

// Event listeners for filter buttons
document.getElementById("showAll").addEventListener("click", () => handleFilter("all"));
document.getElementById("showPlayerInfo").addEventListener("click", () => handleFilter("showPlayerInfo"));
document.getElementById("showHeroStats").addEventListener("click", () => handleFilter("showHeroStats"));
document.getElementById("showRecentMatches").addEventListener("click", () => handleFilter("showRecentMatches"));
document.getElementById("showWinLossStats").addEventListener("click", () => handleFilter("showWinLossStats"));
document.getElementById("showTotals").addEventListener("click", () => handleFilter("showTotals"));
document.getElementById("showRatings").addEventListener("click", () => handleFilter("showRatings"));
