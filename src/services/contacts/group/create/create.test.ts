import assert from "node:assert/strict";
import { afterEach, mock, test } from "bun:test";
import { ReloopValidationError } from "@/index";
import {
	assertAuthAndJson,
	assertNoFetch,
	createClient,
	errorJsonResponse,
	getCall,
	groupFixture,
	jsonResponse,
	mockFetch,
	parseBody,
} from "@/services/contacts/group/test-helpers";

afterEach(() => {
	mock.restore();
});

test("create: POST /api/contacts/v1/groups/create with name", async () => {
	const payload = groupFixture();
	const fetchMock = mockFetch(jsonResponse(payload, 201, "Created"));

	const { group, groupError } = await createClient().contacts.groups.create({
		name: "Beta Testers",
	});

	assert.equal(groupError, null);
	assert.deepEqual(group, payload);

	const call = getCall(fetchMock);
	assert.equal(call.url, "https://reloop.sh/api/contacts/v1/groups/create");
	assert.equal(call.method, "POST");
	assertAuthAndJson(call.headers);
	assert.deepEqual(parseBody(call.body), { name: "Beta Testers" });
});

test("create: returns groupError on non-OK", async () => {
	mockFetch(errorJsonResponse({ message: "Group already exists" }, 409));

	const { group, groupError } = await createClient().contacts.groups.create({
		name: "Beta Testers",
	});

	assert.equal(group, null);
	assert.equal(groupError?.status, 409);
});

test("create: name longer than 50 throws before fetch", async () => {
	const fetchMock = mockFetch(new Response("{}"));
	await assert.rejects(
		() => createClient().contacts.groups.create({ name: "x".repeat(51) }),
		(err: unknown) => {
			assert.ok(err instanceof ReloopValidationError);
			assert.match(err.message, /50/);
			return true;
		},
	);
	assertNoFetch(fetchMock);
});
