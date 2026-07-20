import type { ReloopClient } from "@/client";
import { ReloopValidationError } from "@/services/domain/errors";
import {
	optionalBoolean,
	optionalTls,
	requireDomainName,
} from "@/services/domain/fields";
import { domainCreatePath } from "@/services/domain/paths";
import {
	toDomainResult,
	type DomainResult,
} from "@/services/domain/result";
import type { CreateDomainParams, Domain } from "@/services/domain/types";

function validateCreateParams(
	params: CreateDomainParams | null | undefined,
): CreateDomainParams {
	if (params === null || params === undefined || typeof params !== "object") {
		throw new ReloopValidationError(
			"create params are required and must be an object.",
			"params",
		);
	}

	const body: CreateDomainParams = {
		domain: requireDomainName(params.domain),
	};

	const click_tracking = optionalBoolean(
		params.click_tracking,
		"click_tracking",
	);
	if (click_tracking !== undefined) body.click_tracking = click_tracking;

	const open_tracking = optionalBoolean(params.open_tracking, "open_tracking");
	if (open_tracking !== undefined) body.open_tracking = open_tracking;

	const sending_email = optionalBoolean(params.sending_email, "sending_email");
	if (sending_email !== undefined) body.sending_email = sending_email;

	const receiving_email = optionalBoolean(
		params.receiving_email,
		"receiving_email",
	);
	if (receiving_email !== undefined) body.receiving_email = receiving_email;

	const tls = optionalTls(params.tls);
	if (tls !== undefined) body.tls = tls;

	return body;
}

export async function createDomain(
	client: ReloopClient,
	params: CreateDomainParams,
): Promise<DomainResult<Domain>> {
	const body = validateCreateParams(params);
	const result = await client.fetch<Domain>(domainCreatePath(), {
		method: "POST",
		body: JSON.stringify(body),
	});
	return toDomainResult(result);
}
