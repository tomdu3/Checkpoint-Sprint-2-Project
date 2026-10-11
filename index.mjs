// This is a placeholder file to show how you can "mock" fetch requests using
// the nock library.
// You can delete the contents of the file once you have understood how it
// works.

export async function makeFetchRequest(username = "tomdu3") {
  const response = await fetch(
    `https://www.codewars.com/api/v1/users/${username}`,
  );
  if (!response.ok) {
    throw new Error(`Failed to fetch user ${username}`);
  }
  return response.json();
}

const userData = await makeFetchRequest("tomdu3");
console.log(JSON.stringify(userData, null, 2));
