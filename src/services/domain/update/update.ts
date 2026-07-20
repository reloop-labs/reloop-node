import type { ReloopClient } from "@/client";
import { ReloopValidationError } from "@/services/domain/errors";
import {
	optionalBoolean,
	optionalTls,
	requireDomainId,
} from "@/services/domain/fields";
import { domainById } from "@/services/domain/paths";
import {
	toDomainResult,
	type DomainResult,
} from "@/services/domain/result";
import type { Domain, UpdateDomainParams } from "@/services/domain/types";

function validateUpdateParams(
	params: UpdateDomainParams | null | undefined,
): UpdateDomainParams {
	if (params === null || params === undefined || typeof params !== "object") {
		throw new ReloopValidationError(
			"update params are required and must be an object.",
			"params",
		);
	}

	const body: UpdateDomainParams = {};
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

	if (
		body.click_tracking === undefined &&
		body.open_tracking === undefined &&
		body.sending_email === undefined &&
		body.receiving_email === undefined &&
		body.tls === undefined
	) {
		throw new ReloopValidationError(
			"update requires at least one of click_tracking, open_tracking, sending_email, receiving_email, or tls.",
			"params",
		);
	}

	return body;
}

export async function updateDomain(
	client: ReloopClient,
	id: string,
	params: UpdateDomainParams,
): Promise<DomainResult<Domain>> {
	const domainId = requireDomainId(id);
	const body = validateUpdateParams(params);
	const result = await client.fetch<Domain>(domainById(domainId), {
		method: "PATCH",
		body: JSON.stringify(body),
	});
	return toDomainResult(result);
}
