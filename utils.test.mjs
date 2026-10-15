import test from "node:test";
import assert from "node:assert";
import nock from "nock";
import {
  makeFetchRequest,
  fetchMultipleUsers,
  getAvailableLanguages,
  getLeaderboard,
} from "./utils.mjs";

test("makeFetchRequest() fetches user data from codewars API", async () => {
  // Create a fetch request "mock" using the nock library
  const scope = nock("https://www.codewars.com")
    .get("/api/v1/users/tomdu3")
    .reply(200, { user: "tomdu3" });

  const response = await makeFetchRequest();
  assert(response.user === "tomdu3");

  assert(scope.isDone() === true, "No matching fetch request has been made");
});

test("makeFetchRequest() throws an error for invalid username", async () => {
  const scope = nock("https://www.codewars.com")
    .get("/api/v1/users/invalid_username")
    .reply(404);

  await assert.rejects(makeFetchRequest("invalid_username"), {
    message: "Failed to fetch user invalid_username",
  });

  assert(scope.isDone() === true, "No matching fetch request has been made");
});

test("fetchMultipleUsers() fetches multiple user data from codewars API", async () => {
  const usernames = "tomdu3, johndoe";
  const scope = nock("https://www.codewars.com")
    .get("/api/v1/users/tomdu3")
    .reply(200, { user: "tomdu3" })
    .get("/api/v1/users/johndoe")
    .reply(200, { user: "johndoe" });

  const response = await fetchMultipleUsers(usernames);
  assert(response.length === 2);
  assert(response[0].user === "tomdu3");
  assert(response[1].user === "johndoe");

  assert(scope.isDone() === true, "No matching fetch request has been made");
});

test("fetchMultipleUsers() returns array conaining error objects for the users that are not found", async () => {
  const usernames = "tomdu3, invalid_user";
  const scope = nock("https://www.codewars.com")
    .get("/api/v1/users/tomdu3")
    .reply(200, { user: "tomdu3" })
    .get("/api/v1/users/invalid_user")
    .reply(404);

  const response = await fetchMultipleUsers(usernames);
  assert(response.length === 2);
  assert(response[0].user === "tomdu3");
  assert.deepStrictEqual(response[1], {
    error: "User 'invalid_user' not found",
  });

  assert(scope.isDone() === true, "No matching fetch request has been made");
});

test("fetchMultipleUsers() returns array with one error object when only one user is not found", async () => {
  const usernames = "invalid_user";
  const scope = nock("https://www.codewars.com")
    .get("/api/v1/users/invalid_user")
    .reply(404);

  const response = await fetchMultipleUsers(usernames);
  assert(response.length === 1);
  assert.deepStrictEqual(response[0], {
    error: "User 'invalid_user' not found",
  });

  assert(scope.isDone() === true, "No matching fetch request has been made");
});

test("fetchMultipleUsers() removes duplicate usernames", async () => {
  const usernames = "tomdu3, tomdu3";
  const scope = nock("https://www.codewars.com")
    .get("/api/v1/users/tomdu3")
    .reply(200, { user: "tomdu3" });

  const response = await fetchMultipleUsers(usernames);
  assert(response.length === 1);
  assert(response[0].user === "tomdu3");

  assert(scope.isDone() === true, "No matching fetch request has been made");
});

test("fetchMultipleUsers() returns empty array when no usernames are provided", async () => {
  const usernames = "";
  const response = await fetchMultipleUsers(usernames);
  assert(response.length === 0);
});

test("fetchMultipleUsers() returns array of error objects when all users are not found", async () => {
  const usernames = "invalid_user, invalid_user2";
  const scope = nock("https://www.codewars.com")
    .get("/api/v1/users/invalid_user")
    .reply(404)
    .get("/api/v1/users/invalid_user2")
    .reply(404);

  const response = await fetchMultipleUsers(usernames);
  assert(response.length === 2);
  assert.deepStrictEqual(response[0], {
    error: "User 'invalid_user' not found",
  });
  assert.deepStrictEqual(response[1], {
    error: "User 'invalid_user2' not found",
  });

  assert(scope.isDone() === true, "No matching fetch request has been made");
});

test("fetchMultipleUsers() throws actionable network error when network fails", async () => {
  const scope = nock("https://www.codewars.com")
    .get("/api/v1/users/offline_user")
    .replyWithError("Network failure");

  await assert.rejects(fetchMultipleUsers("offline_user"), {
    message:
      "Network error: Unable to connect to Codewars. Please check your internet connection and try again.",
  });

  assert(scope.isDone() === true, "No matching fetch request has been made");
});

test("fetchMultipleUsers() throws server error when Codewars returns 500", async () => {
  const scope = nock("https://www.codewars.com")
    .get("/api/v1/users/server_error_user")
    .reply(500);

  await assert.rejects(fetchMultipleUsers("server_error_user"), {
    message: "Codewars server error (500). Please try again later.",
  });

  assert(scope.isDone() === true, "No matching fetch request has been made");
});

test("fetchMultipleUsers() throws rate limit error when Codewars returns 429", async () => {
  const scope = nock("https://www.codewars.com")
    .get("/api/v1/users/rate_limited_user")
    .reply(429);

  await assert.rejects(fetchMultipleUsers("rate_limited_user"), {
    message:
      "Rate limit exceeded while connecting to Codewars. Please wait a moment and try again.",
  });

  assert(scope.isDone() === true, "No matching fetch request has been made");
});

test("getAvailableLanguages() returns ['overall'] for empty input or non-array", () => {
  assert.deepStrictEqual(getAvailableLanguages([]), ["overall"]);
  assert.deepStrictEqual(getAvailableLanguages(null), ["overall"]);
  assert.deepStrictEqual(getAvailableLanguages(undefined), ["overall"]);
});

test("getAvailableLanguages() extracts and sorts unique languages from users plus 'overall'", () => {
  const users = [
    {
      username: "user1",
      ranks: {
        languages: {
          ruby: { score: 100 },
          javascript: { score: 200 },
        },
      },
    },
    {
      username: "user2",
      ranks: {
        languages: {
          python: { score: 150 },
          javascript: { score: 300 },
        },
      },
    },
  ];

  assert.deepStrictEqual(getAvailableLanguages(users), [
    "overall",
    "javascript",
    "python",
    "ruby",
  ]);
});

test("getAvailableLanguages() ignores error objects and users without language rankings", () => {
  const users = [
    { error: "User 'invalid_user' not found" },
    { username: "no_ranks_user" },
    { username: "empty_ranks", ranks: {} },
    {
      username: "user1",
      ranks: {
        languages: {
          typescript: { score: 50 },
        },
      },
    },
  ];

  assert.deepStrictEqual(getAvailableLanguages(users), [
    "overall",
    "typescript",
  ]);
});

test("getLeaderboard() returns empty array for invalid inputs", () => {
  assert.deepStrictEqual(getLeaderboard([]), []);
  assert.deepStrictEqual(getLeaderboard(null), []);
  assert.deepStrictEqual(getLeaderboard(undefined), []);
});

test("getLeaderboard() sorts users by overall score descending", () => {
  const users = [
    {
      username: "userB",
      clan: "Clan 2",
      ranks: { overall: { score: 200 } },
    },
    {
      username: "userA",
      clan: "Clan 1",
      ranks: { overall: { score: 500 } },
    },
    {
      username: "userC",
      clan: "Clan 3",
      ranks: { overall: { score: 100 } },
    },
  ];

  const result = getLeaderboard(users, "overall");
  assert.deepStrictEqual(result, [
    { username: "userA", clan: "Clan 1", score: 500 },
    { username: "userB", clan: "Clan 2", score: 200 },
    { username: "userC", clan: "Clan 3", score: 100 },
  ]);
});

test("getLeaderboard() filters and sorts by specific language, omitting users without that language", () => {
  const users = [
    {
      username: "userA",
      clan: "Clan 1",
      ranks: {
        languages: {
          ruby: { score: 150 },
        },
      },
    },
    {
      username: "userB",
      clan: "Clan 2",
      ranks: {
        languages: {
          javascript: { score: 250 },
        },
      },
    },
    {
      username: "userC",
      clan: "Clan 3",
      ranks: {
        languages: {
          javascript: { score: 400 },
          ruby: { score: 50 },
        },
      },
    },
  ];

  const jsResult = getLeaderboard(users, "javascript");
  assert.deepStrictEqual(jsResult, [
    { username: "userC", clan: "Clan 3", score: 400 },
    { username: "userB", clan: "Clan 2", score: 250 },
  ]);

  const rubyResult = getLeaderboard(users, "ruby");
  assert.deepStrictEqual(rubyResult, [
    { username: "userA", clan: "Clan 1", score: 150 },
    { username: "userC", clan: "Clan 3", score: 50 },
  ]);
});

test("getLeaderboard() handles missing clan and ignores error objects", () => {
  const users = [
    { error: "User not found" },
    {
      username: "userNoClan",
      ranks: { overall: { score: 80 } },
    },
  ];

  const result = getLeaderboard(users, "overall");
  assert.deepStrictEqual(result, [
    { username: "userNoClan", clan: "", score: 80 },
  ]);
});
