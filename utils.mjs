export async function makeFetchRequest(username = "tomdu3") {
  const response = await fetch(
    `https://www.codewars.com/api/v1/users/${username}`,
  );
  if (!response.ok) {
    throw new Error(`Failed to fetch user ${username}`);
  }
  return response.json();
}
