export async function fetchPlayerStats(accountId) {
  const url = `https://api.opendota.com/api/players/${accountId}`;
  console.log("Fetching player stats for:", url);

  const response = await fetch(url);

  if (!response.ok) throw new Error("Failed to fetch player stats.");
  return response.json();
}

export async function fetchRecentMatches(accountId) {
  const url = `https://api.opendota.com/api/players/${accountId}/recentMatches`;
  console.log("Fetching recent matches for:", url);

  const response = await fetch(url);

  if (!response.ok) throw new Error("Failed to fetch recent matches.");
  return response.json();
}
//
export async function fetchWinLossStats(accountId) {
  const url = `https://api.opendota.com/api/players/${accountId}/wl`;
  const response = await fetch(url);

  if (!response.ok) throw new Error("Failed to fetch win/loss stats");
  return response.json();
}

export async function fetchHeroes(accountId) {
  const url = `https://api.opendota.com/api/players/${accountId}/heroes`;
  const response = await fetch(url);

  if (!response.ok) throw new Error("Failed to fetch hero stats");
  return response.json();
}

export async function fetchTotals(accountId) {
  const url = `https://api.opendota.com/api/players/${accountId}/totals`;
  const response = await fetch(url);

  if (!response.ok) throw new Error("Failed to fetch total stats");
  return response.json();
}

export async function fetchCounts(accountId) {
  const url = `https://api.opendota.com/api/players/${accountId}/counts`;
  const response = await fetch(url);

  if (!response.ok) throw new Error("Failed to fetch counts");
  return response.json();
}

export async function fetchRatings(accountId) {
  const url = `https://api.opendota.com/api/players/${accountId}/ratings`;
  const response = await fetch(url);

  if (!response.ok) throw new Error("Failed to fetch ratings");
  return response.json();
}


// export async function fetchPlayerMatches(accountId) {
//   const url = `https://api.opendota.com/api/players/${accountId}/matches`;
//   const response = await fetch(url);

//   if (!response.ok) throw new Error("Failed to fetch player matches");
//   const data = await response.json();

//   return data.slice(0, 10); // Only return the first 10 matches
// }

