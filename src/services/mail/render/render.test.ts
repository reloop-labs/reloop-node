import assert from "node:assert/strict";
import { afterEach, mock, test } from "bun:test";
import { createElement } from "react";
import { ReloopValidationError } from "@/index";
import {
	REACT_DOM_SERVER_MODULE,
	REACT_EMAIL_RENDER_MODULE,
	type ModuleImporter,
	renderReact,
	resolveRenderer,
} from "@/services/mail/render/render";
import {
	assertNoFetch,
	createClient,
	getCall,
	jsonResponse,
	mockFetch,
	parseBody,
	sendMailResponseFixture,
} from "@/services/mail/test-helpers";

afterEach(() => {
	mock.restore();
});

function Welcome({ name }: { name: string }) {
	return createElement("p", null, `Hello ${name}`);
}

test("renderReact: renders a React element to an HTML string", async () => {
	const html = await renderReact(createElement(Welcome, { name: "Ada" }));
	assert.match(html, /<p>Hello Ada<\/p>/);
	assert.match(html, /<!DOCTYPE html/i);
});

const withoutReactEmail: ModuleImporter = (specifier) => {
	if (specifier === REACT_EMAIL_RENDER_MODULE) {
		return Promise.reject(new Error(`Cannot find module '${specifier}'`));
	}
	return import(specifier);
};

const withoutAnyRenderer: ModuleImporter = (specifier) =>
	Promise.reject(new Error(`Cannot find module '${specifier}'`));

test("resolveRenderer: prefers @react-email/render when available", async () => {
	const seen: string[] = [];
	const importer: ModuleImporter = (specifier) => {
		seen.push(specifier);
		return import(specifier);
	};
	await resolveRenderer(importer);
	assert.deepEqual(seen, [REACT_EMAIL_RENDER_MODULE]);
});

test("resolveRenderer: falls back to react-dom/server when @react-email/render is missing", async () => {
	const seen: string[] = [];
	const importer: ModuleImporter = (specifier) => {
		seen.push(specifier);
		return withoutReactEmail(specifier);
	};
	await resolveRenderer(importer);
	assert.deepEqual(seen, [REACT_EMAIL_RENDER_MODULE, REACT_DOM_SERVER_MODULE]);
});

test("renderReact: react-dom fallback renders plain JSX with a doctype", async () => {
	const html = await renderReact(
		createElement(Welcome, { name: "Ada" }),
		withoutReactEmail,
	);
	assert.equal(html, "<!DOCTYPE html><p>Hello Ada</p>");
});

test("renderReact: throws ReloopValidationError when no renderer is installed", async () => {
	await assert.rejects(
		() => renderReact(createElement(Welcome, { name: "Ada" }), withoutAnyRenderer),
		(err: unknown) => {
			assert.ok(err instanceof ReloopValidationError);
			assert.equal(err.field, "react");
			assert.match(err.message, /react-dom/);
			assert.match(err.message, /@react-email\/render/);
			return true;
		},
	);
});

test("renderReact: null / boolean nodes throw ReloopValidationError", async () => {
	for (const node of [null, undefined, true, false]) {
		await assert.rejects(
			() => renderReact(node),
			(err: unknown) => {
				assert.ok(err instanceof ReloopValidationError);
				assert.equal(err.field, "react");
				return true;
			},
		);
	}
});

test("send: react is rendered into html and not sent on the wire", async () => {
	const fetchMock = mockFetch(jsonResponse(sendMailResponseFixture()));

	const { emailError } = await createClient().mail.send({
		from: "hello@send.example.com",
		to: "user@example.com",
		subject: "Welcome",
		react: createElement(Welcome, { name: "Ada" }),
	});

	assert.equal(emailError, null);
	const body = parseBody(getCall(fetchMock).body) as Record<string, unknown>;
	assert.equal("react" in body, false);
	assert.equal(typeof body.html, "string");
	assert.match(body.html as string, /<p>Hello Ada<\/p>/);
});

test("send: react takes precedence over html", async () => {
	const fetchMock = mockFetch(jsonResponse(sendMailResponseFixture()));

	await createClient().mail.send({
		from: "hello@send.example.com",
		to: "user@example.com",
		subject: "Welcome",
		html: "<p>plain html</p>",
		react: createElement(Welcome, { name: "Grace" }),
	});

	const body = parseBody(getCall(fetchMock).body) as Record<string, unknown>;
	assert.match(body.html as string, /Hello Grace/);
	assert.doesNotMatch(body.html as string, /plain html/);
});

test("send: text is preserved alongside rendered react", async () => {
	const fetchMock = mockFetch(jsonResponse(sendMailResponseFixture()));

	await createClient().mail.send({
		from: "hello@send.example.com",
		to: "user@example.com",
		subject: "Welcome",
		text: "Hello Ada",
		react: createElement(Welcome, { name: "Ada" }),
	});

	const body = parseBody(getCall(fetchMock).body) as Record<string, unknown>;
	assert.equal(body.text, "Hello Ada");
	assert.match(body.html as string, /Hello Ada/);
});

test("send: invalid react throws before fetch", async () => {
	const fetchMock = mockFetch(jsonResponse(sendMailResponseFixture()));
	await assert.rejects(
		() =>
			createClient().mail.send({
				from: "hello@send.example.com",
				to: "user@example.com",
				subject: "Welcome",
				react: null,
			}),
		ReloopValidationError,
	);
	assertNoFetch(fetchMock);
});
