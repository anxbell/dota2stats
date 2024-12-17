import { fetchHeroes } from "./api.js";

// Helper function to capitalize each word
function capitalizeWords(str) {
  if (!str) return "N/A";
  return str.replace(/\b\w/g, (char) => char.toUpperCase());
}

// Render the player stats
export function renderPlayerStats(data) {
  const container = document.getElementById("playerStats");

  const personaName = data.profile?.personaname
    ? capitalizeWords(data.profile.personaname)
    : "N/A";

  const playerName = data.profile?.name
    ? capitalizeWords(data.profile.name)
    : "N/A";

  const profileURL = data.profile?.profileurl || "#";
  const avatarFullURL = data.profile?.avatarfull || "";

  const rankTier = data.rank_tier ? data.rank_tier : "N/A";
  const leaderboardRank = data.leaderboard_rank ? data.leaderboard_rank : "N/A";

  container.innerHTML = `
    <div class="card">
      <div class="avatar-flip">
        <div class="avatar-front">
          <img 
            src="${avatarFullURL}" 
            alt="${playerName}'s Avatar" 
            style="width:150px;height:150px;border-radius:50%;">
        </div>
        <div class="avatar-back">
          <h2>
            <strong>Persona Name:</strong> 
            <a href="${profileURL}" target="_blank">${personaName}</a>
          </h2>
          <h3>
            <strong>Player Name:</strong> ${playerName}
          </h3>
          <h3>
            <strong>Account ID:</strong> ${data.profile?.account_id || "N/A"}
          </h3>
          <p><strong>MMR (Rank Tier):</strong> ${rankTier}</p>
          <p><strong>Leaderboard Rank:</strong> ${leaderboardRank}</p>
        </div>
      </div>
    </div>
  `;
}


// Hero mapping initialization
let heroMapping = {};

async function loadHeroMapping() {
  try {
    const heroes = await fetchHeroes();
    // Map hero ID to localized name
    heroMapping = heroes.reduce((map, hero) => {
      map[hero.id] = hero.localized_name;
      return map;
    }, {});
    console.log("Hero mapping data loaded", heroMapping);
  } catch (error) {
    console.error("Failed to load hero mapping:", error);
  }
}

function getHeroName(heroId) {
  return heroMapping[heroId] || "Unknown Hero";
}

// Render recent matches with dynamic hero names
let currentMatchIndex = 0;
const matchesPerPage = 5;

export function renderRecentMatches(matches) {
  const container = document.getElementById("recentMatches");
  container.innerHTML = "<h2>Recent Matches</h2>";

  if (!matches || matches.length === 0) {
    container.innerHTML += "<p>No recent matches found.</p>";
    return;
  }

  // Function to load a set of matches
  function loadMatches() {
    const endIndex = Math.min(currentMatchIndex + matchesPerPage, matches.length);
    for (let i = currentMatchIndex; i < endIndex; i++) {
      const match = matches[i];
      const heroName = getHeroName(match.hero_id); // Dynamically retrieve name after mapping is loaded
      const matchDurationInMinutes = (match.duration / 60).toFixed(2);

      const matchElem = document.createElement("div");
      matchElem.className = "match-info";

      matchElem.innerHTML = `
        <h3>Match ID: ${match.match_id}</h3>
        <div class="info">
          <img src="src/assets/images/radiant_win_icon.png.webp" alt="Radiant Win" class="icon">
          <strong>Radiant Win:</strong> <span>${match.radiant_win ? "Yes" : "No"}</span>
        </div>
        <div class="info">
          <img src="src/assets/images/hero_icon.webp" alt="Hero" class="icon">
          <strong>Hero: </strong> <span>${heroName}</span>
        </div>
        <div class="info">
          <img src="src/assets/images/duration_icon.jpeg" alt="Duration" class="icon">
          <strong>Match Duration:</strong> <span>${matchDurationInMinutes} minutes</span>
        </div>
        <div class="info">
          <img src="src/assets/images/kills_icon.jpeg" alt="Kills" class="icon">
          <strong>Kills:</strong> <span>${match.kills}</span>
        </div>
        <div class="info">
          <img src="src/assets/images/deaths_icon.jpeg" alt="Deaths" class="icon">
          <strong>Deaths:</strong> <span>${match.deaths}</span>
        </div>
        <div class="info">
          <img src="src/assets/images/assists_icon.jpeg" alt="Assists" class="icon">
          <strong>Assists:</strong> <span>${match.assists}</span>
        </div>
        <div class="info">
          <img src="src/assets/images/xp_icon.jpeg" alt="XP Per Minute" class="icon">
          <strong>XP Per Minute:</strong> <span>${match.xp_per_min || "N/A"}</span>
        </div>
        <div class="info">
          <img src="src/assets/images/gold_icon.jpeg" alt="Gold Per Minute" class="icon">
          <strong>Gold Per Minute:</strong> <span>${match.gold_per_min || "N/A"}</span>
        </div>
        <div class="info">
          <img src="src/assets/images/damage_icon.jpeg" alt="Hero Damage" class="icon">
          <strong>Hero Damage:</strong> <span>${match.hero_damage || "N/A"}</span>
        </div>
        <div class="info">
          <img src="src/assets/images/last_hits_icon.jpeg" alt="Last Hits" class="icon">
          <strong>Last Hits:</strong> <span>${match.last_hits || "N/A"}</span>
        </div>
      `;
      container.appendChild(matchElem);
    }
    currentMatchIndex = endIndex;

    // Hide the load button if all matches are loaded
    if (currentMatchIndex >= matches.length) {
      loadMoreButton.classList.add("hidden");
    }
    // Append the load button again to ensure it's at the end
    container.appendChild(loadMoreButton);
  }

  // Create and add the load more button
  const loadMoreButton = document.createElement("button");
  loadMoreButton.id = "loadMoreButton";
  loadMoreButton.textContent = "Load More Matches";
  loadMoreButton.addEventListener("click", loadMatches);

  // Load initial matches and append the button after the initial load
  loadMatches();
}



// Render Win/Loss stats
export function renderWinLossStats(data) {
  const container = document.getElementById("winLossStats");

  const wins = data.win || 0;
  const losses = data.lose || 0;
  const totalGames = wins + losses;

  const winRatio = totalGames > 0 ? ((wins / totalGames) * 100).toFixed(2) : "N/A";

  container.innerHTML = `
    <h2><strong>Win/Loss Stats</strong></h2>
    <p><strong>Wins:</strong> ${wins}</p>
    <p><strong>Losses:</strong> ${losses}</p>
    <p><strong>Win Ratio:</strong> ${winRatio}%</p>
  `;
}


// Render top heroes data
export function renderUserHeroes(data) {
  const container = document.getElementById("heroesStats");
  container.innerHTML = "<h2>Heroes Stats - Top 3</h2>";

  const topHeroes = data.slice(0, 3);

  topHeroes.forEach((heroStat) => {
    const heroName = getHeroName(heroStat.hero_id); // Map the hero ID to name
    const winRatePercentage = heroStat.games > 0 
      ? ((heroStat.win / heroStat.games) * 100).toFixed(2) 
      : "0"; // Avoid dividing by zero

    const heroElem = document.createElement("div");
    heroElem.innerHTML = `
      <p><strong>Hero:</strong> ${heroName}</p>
      <p><strong>Games Played:</strong> ${heroStat.games}</p>
      <p><strong>Win Rate:</strong> ${winRatePercentage}%</p>
      <p><strong>Total Wins:</strong> ${heroStat.win}</p>
      <hr>
    `;
    container.appendChild(heroElem);
  });
}

// Extract totals from data
export function renderTotals(data) {
  const container = document.getElementById("totals");

  const totalKills = data.find(item => item.field === "kills")?.sum || 0;
  const totalDeaths = data.find(item => item.field === "deaths")?.sum || 0;
  const totalAssists = data.find(item => item.field === "assists")?.sum || 0;
  const kdRatio = totalDeaths > 0 ? (totalKills / totalDeaths).toFixed(2) : "N/A";

  container.innerHTML = `
    <h2><strong>Totals</strong></h2>
    <p><strong>Kills:</strong> ${totalKills}</p>
    <p><strong>Deaths:</strong> ${totalDeaths}</p>
    <p><strong>Assists:</strong> ${totalAssists}</p>
    <p><strong>K/D Ratio:</strong> ${kdRatio}</p>
  `;
}

// Render the most recent player rating
export function renderPlayerRatings(ratings) {
  const container = document.getElementById("ratingsContainer");

  container.innerHTML = "<h2>Player Ratings</h2>";

  if (!ratings || ratings.length === 0) {
    container.innerHTML += "<p>No ratings available.</p>";
    return;
  }

  const mostRecentRating = ratings[ratings.length - 1];

  const ratingElem = document.createElement("div");
  ratingElem.innerHTML = `
    <p><strong>Solo Competitive Rank:</strong> ${mostRecentRating.solo_competitive_rank || "N/A"}</p>
    <p><strong>Competitive Rank:</strong> ${mostRecentRating.competitive_rank || "N/A"}</p>
  `;
  container.appendChild(ratingElem);
};

// Initial mapping loading
loadHeroMapping();



// export function renderPlayerMatches(matches) {
//   const container = document.getElementById("matchesContainer");

//   container.innerHTML = "<h2>Last 10 Matches</h2>";

//   if (!matches || matches.length === 0) {
//     container.innerHTML += "<p>No matches found or insufficient data.</p>";
//     return;
//   }

//   matches.forEach((match) => {
//     const matchElem = document.createElement("div");
//     matchElem.innerHTML = `
//       <p><strong>Match ID:</strong> ${match.match_id}</p>
//       <p><strong>Radiant Win:</strong> ${match.radiant_win ? "Yes" : "No"}</p>
//       <p><strong>Kills:</strong> ${match.kills}</p>
//       <p><strong>Deaths:</strong> ${match.deaths}</p>
//       <p><strong>Assists:</strong> ${match.assists}</p>
//       <hr>
//     `;
//     container.appendChild(matchElem);
//   });
// }
