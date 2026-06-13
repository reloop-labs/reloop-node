export type DomainStatus =
	| "pending"
	| "verifying"
	| "active"
	| "suspended"
	| "failed";

export type DomainTlsMode = "opportunistic" | "enforced";

export type DnsRecordType =
	| "A"
	| "AAAA"
	| "CNAME"
	| "MX"
	| "TXT"
	| "SPF"
	| "DKIM"
	| "DMARC";

export type DnsRecordTypeName = "MX" | "SPF" | "DKIM" | "DMARC" | "CNAME";

export type DnsRecordPurpose = "sending" | "receiving" | "tracking";

export interface DnsRecord {
	id: string;
	recordType: DnsRecordType;
	recordTypeName: DnsRecordTypeName;
	domain: string;
	name: string;
	value: string;
	ttl: string;
	priority: number | null;
	verificationError: string | null;
	purpose?: DnsRecordPurpose;
	createdAt: string;
	status: DomainStatus;
	updatedAt: string;
}

export interface Domain {
	object: "domain";
	id: string;
	domain: string;
	status: DomainStatus;
	userVerifiedDomain: boolean;
	systemVerified: boolean;
	customReturnPath: string;
	trackingSubdomain: string;
	isClickTrackingEnabled: boolean;
	isOpenTrackingEnabled: boolean;
	tls: DomainTlsMode;
	isTrackingDomain: boolean;
	isSendingEmailEnabled: boolean;
	isReceivingEmailEnabled: boolean;
	verificationFailedReason: string | null;
	dnsRecords: DnsRecord[];
	lastVerifiedAt: string | null;
	createdAt: string;
	updatedAt: string;
	event?: string;
}

export interface CreateDomainParams {
	domain: string;
	custom_return_path?: string;
	tracking?: string;
	click_tracking?: boolean;
	open_tracking?: boolean;
	tls?: DomainTlsMode;
	sending_email?: boolean;
	receiving_email?: boolean;
}

export interface UpdateDomainParams {
	click_tracking?: boolean;
	open_tracking?: boolean;
	sending_email?: boolean;
	receiving_email?: boolean;
	tls?: DomainTlsMode;
}

export interface ListDomainsParams {
	page?: number;
	limit?: number;
	q?: string;
	status?: DomainStatus;
}

export interface DomainListResponse {
	object: "domain";
	domains: Domain[];
	total: number;
	page: number;
	limit: number;
	event: string;
}

export interface DomainStatusResponse {
	id: string;
	status: DomainStatus;
	event?: string;
}

export interface ForwardDnsParams {
	email: string;
}

export interface ForwardDnsResponse {
	success: boolean;
}

export interface DomainNameserversResponse {
	object: "domain_nameservers";
	domainId: string;
	domain: string;
	nameservers: string[] | null;
	dnsProvider: string | null;
	event: string;
}
