import test from "node:test";
import assert from "node:assert";
import nock from "nock";
import { makeFetchRequest, fetchMultipleUsers } from "./utils.mjs";

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