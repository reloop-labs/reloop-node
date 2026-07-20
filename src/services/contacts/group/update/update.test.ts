import assert from "node:assert/strict";
import { afterEach, mock, test } from "bun:test";
import { ReloopValidationError } from "@/index";
import {
	assertNoFetch,
	createClient,
	getCall,
	GROUP_ID,
	groupFixture,
	jsonResponse,
	mockFetch,
	parseBody,
} from "@/services/contacts/group/test-helpers";

afterEach(() => {
	mock.restore();
});

test("update: PATCH /api/contacts/v1/groups/:id", async () => {
	const payload = groupFixture({ name: "Loyal Customers" });
	const fetchMock = mockFetch(jsonResponse(payload));

	const { group, groupError } = await createClient().contacts.groups.update(
		GROUP_ID,
		{ name: "Loyal Customers" },
	);

	assert.equal(groupError, null);
	assert.deepEqual(group, payload);
	assert.deepEqual(parseBody(getCall(fetchMock).body), {
		name: "Loyal Customers",
	});
});

test("update: name longer than 255 throws before fetch", async () => {
	const fetchMock = mockFetch(new Response("{}"));
	await assert.rejects(
		() =>
			createClient().contacts.groups.update(GROUP_ID, {
				name: "x".repeat(256),
			}),
		ReloopValidationError,
	);
	assertNoFetch(fetchMock);
});
