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
    <h2>
      <strong>Persona Name:</strong> 
      <a href="${profileURL}" target="_blank">${personaName}</a>
    </h2>
    <h3>
      <strong>Player Name:</strong> ${playerName}
    </h3>
    <img 
      src="${avatarFullURL}" 
      alt="${playerName}'s Avatar" 
      style="width:150px;height:150px;border-radius:50%;">
    <p><strong>MMR (Rank Tier):</strong> ${rankTier}</p>
    <p><strong>Leaderboard Rank:</strong> ${leaderboardRank}</p>
  `;
}


// Hero mapping initialization
let heroMapping = {};

function loadHeroMapping() {
  fetch('./src/data/heroes.json')
    .then(response => response.json())
    .then(data => {
      heroMapping = data; // Dynamically map heroes
      console.log("Hero mapping data loaded", heroMapping);
    });
}

function getHeroName(heroId) {
  return heroMapping[heroId] || "Unknown Hero";
}

// Render recent matches with dynamic hero names
export function renderRecentMatches(matches) {
  const container = document.getElementById("recentMatches");
  container.innerHTML = "<h2>Last 5 Matches</h2>";

  if (!matches || matches.length === 0) {
    container.innerHTML += "<p>No recent matches found.</p>";
    return;
  }

  matches.slice(0, 5).forEach((match, index) => {
    const heroName = getHeroName(match.hero_id); // Dynamically retrieve name after mapping is loaded
    const matchDurationInMinutes = (match.duration / 60).toFixed(2);

    const matchElem = document.createElement("div");

    matchElem.innerHTML = `
      <p><strong>Match ID:</strong> ${match.match_id}</p>
      <p><strong>Radiant Win:</strong> ${match.radiant_win ? "Yes" : "No"}</p>
      <p><strong>Hero:</strong> ${heroName}</p>
      <p><strong>Match Duration:</strong> ${matchDurationInMinutes} minutes</p>
      <p><strong>Kills:</strong> ${match.kills}</p>
      <p><strong>Deaths:</strong> ${match.deaths}</p>
      <p><strong>Assists:</strong> ${match.assists}</p>
      <p><strong>XP Per Minute:</strong> ${match.xp_per_min || "N/A"}</p>
      <p><strong>Gold Per Minute:</strong> ${match.gold_per_min || "N/A"}</p>
      <p><strong>Hero Damage:</strong> ${match.hero_damage || "N/A"}</p>
      <p><strong>Last Hits:</strong> ${match.last_hits || "N/A"}</p>
      <hr>
    `;
    container.appendChild(matchElem);
  });
}

// Render Win/Loss stats
export function renderWinLossStats(data) {
  const container = document.getElementById("winLossStats");

  const wins = data.win || 0;
  const losses = data.lose || 0;
  const totalGames = wins + losses;

  const winRatio = totalGames > 0 ? ((wins / totalGames) * 100).toFixed(2) : "N/A";

  container.innerHTML = `
    <h2><strong>Win/Loss Stats:</strong></h2>
    <p><strong>Wins:</strong> ${wins}</p>
    <p><strong>Losses:</strong> ${losses}</p>
    <p><strong>Win Ratio:</strong> ${winRatio}%</p>
  `;
}


// Render top heroes data
export function renderHeroes(data) {
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
    <h2><strong>Totals:</strong></h2>
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
