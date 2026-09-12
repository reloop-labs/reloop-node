import type { ReactNode } from "react";
import { ReloopValidationError } from "@/services/mail/errors";

export const REACT_EMAIL_RENDER_MODULE = "@react-email/render";
export const REACT_DOM_SERVER_MODULE = "react-dom/server";

export type RenderFn = (node: ReactNode) => Promise<string> | string;
export type ModuleImporter = (specifier: string) => Promise<unknown>;

const defaultImporter: ModuleImporter = (specifier) => import(specifier);

async function tryImport(
	importer: ModuleImporter,
	specifier: string,
): Promise<Record<string, unknown> | null> {
	try {
		return (await importer(specifier)) as Record<string, unknown>;
	} catch {
		return null;
	}
}

export async function resolveRenderer(
	importer: ModuleImporter = defaultImporter,
): Promise<RenderFn> {
	const reactEmail = await tryImport(importer, REACT_EMAIL_RENDER_MODULE);
	if (reactEmail && typeof reactEmail.render === "function") {
		return reactEmail.render as RenderFn;
	}

	const reactDom = await tryImport(importer, REACT_DOM_SERVER_MODULE);
	if (reactDom && typeof reactDom.renderToStaticMarkup === "function") {
		const renderToStaticMarkup = reactDom.renderToStaticMarkup as (
			node: ReactNode,
		) => string;
		return (node) => `<!DOCTYPE html>${renderToStaticMarkup(node)}`;
	}

	throw new ReloopValidationError(
		`react requires "react" plus either "${REACT_EMAIL_RENDER_MODULE}" or "react-dom". Install with: npm install react react-dom (optionally: npm install ${REACT_EMAIL_RENDER_MODULE})`,
		"react",
	);
}

export async function renderReact(
	node: ReactNode,
	importer: ModuleImporter = defaultImporter,
): Promise<string> {
	if (node === null || node === undefined || typeof node === "boolean") {
		throw new ReloopValidationError(
			"react must be a renderable React element.",
			"react",
		);
	}
	const render = await resolveRenderer(importer);
	const html = await render(node);
	if (typeof html !== "string" || html.trim().length === 0) {
		throw new ReloopValidationError(
			"react rendered to an empty string.",
			"react",
		);
	}
	return html;
}
