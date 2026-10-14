// Fetches user profile data from the Codewars API for a given username.
export async function makeFetchRequest(username = "tomdu3") {
  const response = await fetch(
    `https://www.codewars.com/api/v1/users/${username}`,
  );
  if (!response.ok) {
    throw new Error(`Failed to fetch user ${username}`);
  }
  return response.json();
}

// Fetches data for multiple Codewars users from a comma-separated string or array of usernames.
export async function fetchMultipleUsers(usernames) {
  if (typeof usernames !== "string" && !Array.isArray(usernames)) {
    return [];
  }

  const rawUsernamesList =
    typeof usernames === "string" ? usernames.split(",") : usernames;

  const userList = [
    ...new Set( // Creates a new Set from the rawUsernamesList, which automatically removes duplicate usernames
      rawUsernamesList
        .map((username) => String(username).trim()) // Converts each element to a string and removes leading/trailing whitespace
        .filter(Boolean), // Removes any empty strings from the array
    ),
  ];

  return Promise.all(
    userList.map(async (username) => {
      try {
        return await makeFetchRequest(username);
      } catch {
        return { // Returns an error object if a user is not found
          error: `User '${username}' not found`,
        };
      }
    }),
  );
}