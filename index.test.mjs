import test from "node:test";
import assert from "node:assert";
import nock from "nock";
import { makeFetchRequest } from "./utils.mjs";

test("makeFetchRequest() fetches user data from codewars API", async () => {
  // Create a fetch request "mock" using the nock library
  const scope = nock("https://www.codewars.com")
    .get("/api/v1/users/tomdu3")
    .reply(200, { user: "tomdu3" });

  const response = await makeFetchRequest();
  assert(response.user === "tomdu3");

  assert(scope.isDone() === true, "No matching fetch request has been made");
});
