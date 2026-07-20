import type { ReloopApiError, ReloopResult } from "@/core/result";
import type { SendMailResponse } from "@/services/mail/types";

export type EmailResult =
	| { response: SendMailResponse; emailError: null }
	| { response: null; emailError: ReloopApiError };

export function toEmailResult(
	result: ReloopResult<SendMailResponse>,
): EmailResult {
	if (result.error) {
		return { response: null, emailError: result.error };
	}
	return { response: result.response as SendMailResponse, emailError: null };
}
