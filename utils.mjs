// Fetches user profile data from the Codewars API for a given username.
export async function makeFetchRequest(username = "tomdu3") {
  let response;
  try {
    response = await fetch(
      `https://www.codewars.com/api/v1/users/${username}`,
    );
  } catch {
    const networkError = new Error(
      "Network error: Unable to connect to Codewars. Please check your internet connection and try again.",
    );
    networkError.isNetworkError = true;
    throw networkError;
  }

  if (!response.ok) {
    const error = new Error(`Failed to fetch user ${username}`);
    error.status = response.status;
    throw error;
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
      } catch (error) {
        if (error.isNetworkError) {
          return {
            error:
              "Network error: Unable to connect to Codewars. Please check your internet connection and try again.",
          };
        }
        if (error.status === 404) {
          return {
            error: `User '${username}' not found`,
          };
        }
        if (error.status === 429) {
          return {
            error: `Rate limit exceeded while fetching user '${username}'. Please wait a moment and try again.`,
          };
        }
        if (error.status >= 500) {
          return {
            error: `Codewars server error (${error.status}). Please try again later.`,
          };
        }
        if (error.status === 400) {
          return {
            error: `Bad request for user '${username}'. Please check the username and try again.`,
          };
        }
        return {
          error:
            error.message ||
            `Failed to fetch user '${username}'. Please try again.`,
        };
      }
    }),
  );
}