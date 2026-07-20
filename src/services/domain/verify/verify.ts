import type { ReloopClient } from "@/client";
import { requireDomainId } from "@/services/domain/fields";
import { domainVerifyPath } from "@/services/domain/paths";
import {
	toDomainResult,
	type DomainResult,
} from "@/services/domain/result";
import type { DomainStatusResponse } from "@/services/domain/types";

export async function verifyDomain(
	client: ReloopClient,
	id: string,
): Promise<DomainResult<DomainStatusResponse>> {
	const domainId = requireDomainId(id);
	const result = await client.fetch<DomainStatusResponse>(
		domainVerifyPath(domainId),
		{ method: "POST" },
	);
	return toDomainResult(result);
}
