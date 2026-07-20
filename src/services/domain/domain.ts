import type { ReloopClient } from "@/client";
import { createDomain } from "@/services/domain/create/create";
import { deleteDomain } from "@/services/domain/delete/delete";
import { getDomain } from "@/services/domain/get/get";
import { listDomains } from "@/services/domain/list/list";
import type {
	DomainListResult,
	DomainResult,
} from "@/services/domain/result";
import type {
	CreateDomainParams,
	Domain,
	DomainStatusResponse,
	ListDomainsParams,
	UpdateDomainParams,
} from "@/services/domain/types";
import { updateDomain } from "@/services/domain/update/update";
import { verifyDomain } from "@/services/domain/verify/verify";

export class DomainService {
	constructor(private readonly client: ReloopClient) {}

	async create(params: CreateDomainParams): Promise<DomainResult<Domain>> {
		return createDomain(this.client, params);
	}

	async list(params?: ListDomainsParams): Promise<DomainListResult> {
		return listDomains(this.client, params);
	}

	async get(id: string): Promise<DomainResult<Domain>> {
		return getDomain(this.client, id);
	}

	async update(
		id: string,
		params: UpdateDomainParams,
	): Promise<DomainResult<Domain>> {
		return updateDomain(this.client, id, params);
	}

	async delete(id: string): Promise<DomainResult<Domain>> {
		return deleteDomain(this.client, id);
	}

	async verify(id: string): Promise<DomainResult<DomainStatusResponse>> {
		return verifyDomain(this.client, id);
	}
}
