import type { ReloopClient } from "@/client";
import { archiveThread } from "@/services/inbox/thread/archive/archive";
import { batchThreads } from "@/services/inbox/thread/batch/batch";
import { deleteThread } from "@/services/inbox/thread/delete/delete";
import { getThread } from "@/services/inbox/thread/get/get";
import { getThreadAttachment } from "@/services/inbox/thread/get-attachment/get-attachment";
import { listThreads } from "@/services/inbox/thread/list/list";
import { restoreThread } from "@/services/inbox/thread/restore/restore";
import type {
	ThreadListResult,
	ThreadResult,
} from "@/services/inbox/thread/result";
import { setThreadRead } from "@/services/inbox/thread/set-read/set-read";
import { setThreadStar } from "@/services/inbox/thread/set-star/set-star";
import type {
	BatchThreadsParams,
	InboxSuccessResponse,
	ListThreadsParams,
	SetThreadReadParams,
	SetThreadStarParams,
	ThreadBatchResponse,
	ThreadDetail,
	UpdateThreadParams,
} from "@/services/inbox/thread/types";
import { trashThread } from "@/services/inbox/thread/trash/trash";
import { updateThread } from "@/services/inbox/thread/update/update";
import type { MessageAttachment } from "@/services/inbox/types";

export class ThreadService {
	constructor(private readonly client: ReloopClient) {}

	async list(params?: ListThreadsParams): Promise<ThreadListResult> {
		return listThreads(this.client, params);
	}

	async batch(
		params: BatchThreadsParams,
	): Promise<ThreadResult<ThreadBatchResponse>> {
		return batchThreads(this.client, params);
	}

	async get(id: string): Promise<ThreadResult<ThreadDetail>> {
		return getThread(this.client, id);
	}

	async getAttachment(
		id: string,
		attachmentId: string,
	): Promise<ThreadResult<MessageAttachment>> {
		return getThreadAttachment(this.client, id, attachmentId);
	}

	async update(
		id: string,
		params: UpdateThreadParams,
	): Promise<ThreadResult<InboxSuccessResponse>> {
		return updateThread(this.client, id, params);
	}

	async setRead(
		id: string,
		params: SetThreadReadParams,
	): Promise<ThreadResult<InboxSuccessResponse>> {
		return setThreadRead(this.client, id, params);
	}

	async setStar(
		id: string,
		params: SetThreadStarParams,
	): Promise<ThreadResult<InboxSuccessResponse>> {
		return setThreadStar(this.client, id, params);
	}

	async archive(id: string): Promise<ThreadResult<InboxSuccessResponse>> {
		return archiveThread(this.client, id);
	}

	async trash(id: string): Promise<ThreadResult<InboxSuccessResponse>> {
		return trashThread(this.client, id);
	}

	async restore(id: string): Promise<ThreadResult<InboxSuccessResponse>> {
		return restoreThread(this.client, id);
	}

	async delete(id: string): Promise<ThreadResult<InboxSuccessResponse>> {
		return deleteThread(this.client, id);
	}
}
