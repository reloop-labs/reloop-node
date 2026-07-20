import type { ReloopClient } from "@/client";
import { requireDomainId } from "@/services/domain/fields";
import { domainById } from "@/services/domain/paths";
import {
	toDomainResult,
	type DomainResult,
} from "@/services/domain/result";
import type { Domain } from "@/services/domain/types";

export async function deleteDomain(
	client: ReloopClient,
	id: string,
): Promise<DomainResult<Domain>> {
	const domainId = requireDomainId(id);
	const result = await client.fetch<Domain>(domainById(domainId), {
		method: "DELETE",
	});
	return toDomainResult(result);
}
