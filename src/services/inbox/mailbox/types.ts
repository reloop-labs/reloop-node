import type { InboxSuccessResponse } from "@/services/inbox/types";

export type MailboxStatus = "active" | "disabled";

export interface Mailbox {
	id: string;
	email: string;
	quota: string;
	status: string;
	displayName: string | null;
	createdAt: string;
}

export interface MailboxDetail extends Mailbox {
	domainId: string;
	updatedAt: string;
}

export interface CreateMailboxResponse {
	id: string;
	email: string;
	status: string;
}

export interface CreateMailboxParams {
	domainId: string;
	email: string;
	password?: string;
	quota?: string;
	displayName?: string;
}

export interface UpdateMailboxParams {
	displayName?: string;
	status?: MailboxStatus;
	quota?: string;
}

export type { InboxSuccessResponse };
