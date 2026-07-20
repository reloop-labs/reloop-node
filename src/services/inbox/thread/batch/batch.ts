import type { ReloopClient } from "@/client";
import { ReloopValidationError } from "@/services/inbox/thread/errors";
import {
	requireBatchAction,
	requireIdArray,
} from "@/services/inbox/thread/fields";
import { threadBatchPath } from "@/services/inbox/thread/paths";
import {
	toThreadResult,
	type ThreadResult,
} from "@/services/inbox/thread/result";
import type {
	BatchThreadsParams,
	ThreadBatchResponse,
} from "@/services/inbox/thread/types";

function validateBatchParams(
	params: BatchThreadsParams | null | undefined,
): BatchThreadsParams {
	if (params === null || params === undefined || typeof params !== "object") {
		throw new ReloopValidationError(
			"batch params are required and must be an object.",
			"params",
		);
	}
	return {
		ids: requireIdArray(params.ids),
		action: requireBatchAction(params.action),
	};
}

export async function batchThreads(
	client: ReloopClient,
	params: BatchThreadsParams,
): Promise<ThreadResult<ThreadBatchResponse>> {
	const body = validateBatchParams(params);
	const result = await client.fetch<ThreadBatchResponse>(threadBatchPath(), {
		method: "POST",
		body: JSON.stringify(body),
	});
	return toThreadResult(result);
}
