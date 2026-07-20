import assert from "node:assert/strict";
import { afterEach, mock, test } from "bun:test";
import {
	assertAuthAndJson,
	createClient,
	getCall,
	jsonResponse,
	mockFetch,
	parseBody,
	threadFixture,
	THREAD_ID,
} from "@/services/inbox/thread/test-helpers";

const WIRE_METHODS = [
	"list",
	"batch",
	"get",
	"getAttachment",
	"update",
	"setRead",
	"setStar",
	"archive",
	"trash",
	"restore",
	"delete",
] as const;

afterEach(() => mock.restore());

test("threads module exposes exactly the eleven backend wire methods", () => {
	const threads = createClient().inbox.threads;

	for (const name of WIRE_METHODS) {
		assert.equal(
			typeof threads[name],
			"function",
			`expected threads.${name} to be a function`,
		);
	}

	const ownMethods = Object.getOwnPropertyNames(
		Object.getPrototypeOf(threads),
	).filter((name) => {
		if (name === "constructor") return false;
		const value = (threads as unknown as Record<string, unknown>)[name];
		return typeof value === "function";
	});

	assert.deepEqual(
		[...ownMethods].sort(),
		[...WIRE_METHODS].sort(),
		"Thread module must not expose extra methods beyond the wire contract",
	);
});

test("list: GET /api/inbox/v1/threads", async () => {
	const payload = [threadFixture()];
	const fetchMock = mockFetch(jsonResponse(payload));

	const { threads, threadError } = await createClient().inbox.threads.list({
		limit: 50,
	});

	assert.equal(threadError, null);
	assert.deepEqual(threads, payload);
	assert.equal(
		getCall(fetchMock).url,
		"https://reloop.sh/api/inbox/v1/threads?limit=50",
	);
});

test("batch: POST /api/inbox/v1/threads/batch", async () => {
	const fetchMock = mockFetch(
		jsonResponse({ success: true, ids: [THREAD_ID], action: "archive" }),
	);

	const { thread, threadError } = await createClient().inbox.threads.batch({
		ids: [THREAD_ID],
		action: "archive",
	});

	assert.equal(threadError, null);
	assert.equal(thread?.action, "archive");

	const call = getCall(fetchMock);
	assert.equal(call.url, "https://reloop.sh/api/inbox/v1/threads/batch");
	assert.equal(call.method, "POST");
	assertAuthAndJson(call.headers);
	assert.deepEqual(parseBody(call.body), {
		ids: [THREAD_ID],
		action: "archive",
	});
});

test("archive: POST /api/inbox/v1/threads/:id/archive", async () => {
	const fetchMock = mockFetch(jsonResponse({ success: true, id: THREAD_ID }));

	const { thread, threadError } = await createClient().inbox.threads.archive(
		THREAD_ID,
	);

	assert.equal(threadError, null);
	assert.equal(
		getCall(fetchMock).url,
		`https://reloop.sh/api/inbox/v1/threads/${THREAD_ID}/archive`,
	);
	assert.equal(getCall(fetchMock).method, "POST");
});
