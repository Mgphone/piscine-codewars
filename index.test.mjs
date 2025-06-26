// index.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import nock from "nock";
import { fetchUserData } from "./utils/fetchUserData.js";

test("fetchUserData returns mocked user data", async () => {
  const mockUsername = "testuser";
  const mockResponse = {
    username: mockUsername,
    name: "Test User",
    clan: "CodeYourFuture",
    ranks: {
      overall: {
        rank: -4,
        name: "4 kyu",
        score: 1234,
      },
    },
  };

  const scope = nock("https://www.codewars.com")
    .get(`/api/v1/users/${mockUsername}`)
    .reply(200, mockResponse);

  const result = await fetchUserData(mockUsername);
  assert.deepEqual(result, mockResponse);
  assert.ok(scope.isDone(), "Expected HTTP request was not made");
});

test("fetchUserData throws error 404", async () => {
  const mockUserName = "invalidUser";
  nock("https://www.codewars.com")
    .get(`/api/v1/users/${mockUserName}`)
    .reply(404);
  await assert.rejects(
    async () => {
      await fetchUserData(mockUserName);
    },
    {
      message: `Can not find the data of ${mockUserName}`,
    }
  );
});

test("fetchUserData handles network errors", async () => {
  const username = "testuser";
  nock("https://www.codewars.com")
    .get(`/api/v1/users/${username}`)
    .replyWithError("Network failure");

  await assert.rejects(() => fetchUserData(username));
});
