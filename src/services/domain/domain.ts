import type { ReloopClient } from "../../client";
import type { ReloopResult } from "../../core/result";
import type {
	CreateDomainParams,
	Domain,
	DomainListResponse,
	DomainStatusResponse,
	ForwardDnsParams,
	ForwardDnsResponse,
	ListDomainsParams,
	UpdateDomainParams,
} from "./types";

export class DomainService {
	constructor(private readonly client: ReloopClient) {}

	async create(params: CreateDomainParams): Promise<ReloopResult<Domain>> {
		return this.client.fetch<Domain>("/api/domain/v1/create", {
			method: "POST",
			body: JSON.stringify(params),
		});
	}

	async list(params?: ListDomainsParams): Promise<ReloopResult<DomainListResponse>> {
		const searchParams = new URLSearchParams();
		if (params?.page !== undefined) searchParams.set("page", params.page.toString());
		if (params?.limit !== undefined) searchParams.set("limit", params.limit.toString());
		if (params?.q) searchParams.set("q", params.q);
		if (params?.status) searchParams.set("status", params.status);

		const queryString = searchParams.toString();
		const path = `/api/domain/v1/list${queryString ? `?${queryString}` : ""}`;

		return this.client.fetch<DomainListResponse>(path, { method: "GET" });
	}

	async get(domainId: string): Promise<ReloopResult<Domain>> {
		return this.client.fetch<Domain>(`/api/domain/v1/${domainId}`, {
			method: "GET",
		});
	}

	async update(domainId: string, params: UpdateDomainParams): Promise<ReloopResult<Domain>> {
		return this.client.fetch<Domain>(`/api/domain/v1/${domainId}`, {
			method: "PATCH",
			body: JSON.stringify(params),
		});
	}

	async delete(domainId: string): Promise<ReloopResult<Domain>> {
		return this.client.fetch<Domain>(`/api/domain/v1/${domainId}`, {
			method: "DELETE",
		});
	}

	async verify(domainId: string): Promise<ReloopResult<DomainStatusResponse>> {
		return this.client.fetch<DomainStatusResponse>(
			`/api/domain/v1/verify/${domainId}`,
			{ method: "POST" },
		);
	}

	async forwardDns(
		domainId: string,
		params: ForwardDnsParams,
	): Promise<ReloopResult<ForwardDnsResponse>> {
		return this.client.fetch<ForwardDnsResponse>(
			`/api/domain/v1/verify/${domainId}/forward-dns`,
			{
				method: "POST",
				body: JSON.stringify(params),
			},
		);
	}
}
