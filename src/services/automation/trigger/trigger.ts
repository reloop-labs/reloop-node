import type { ReloopClient } from "@/client";
import { createTrigger } from "@/services/automation/trigger/create/create";
import { deleteTrigger } from "@/services/automation/trigger/delete/delete";
import { getTrigger } from "@/services/automation/trigger/get/get";
import { listTriggers } from "@/services/automation/trigger/list/list";
import type {
	TriggerListResult,
	TriggerResult,
} from "@/services/automation/trigger/result";
import type {
	AutomationTrigger,
	CreateTriggerParams,
	DeleteTriggerResponse,
	ListTriggersParams,
	UpdateTriggerParams,
} from "@/services/automation/trigger/types";
import { updateTrigger } from "@/services/automation/trigger/update/update";

/**
 * The events your app sends with `automations.start`. Not related to webhook
 * events.
 */
export class TriggerService {
	constructor(private readonly client: ReloopClient) {}

	async create(
		params: CreateTriggerParams,
	): Promise<TriggerResult<AutomationTrigger>> {
		return createTrigger(this.client, params);
	}

	async list(params?: ListTriggersParams): Promise<TriggerListResult> {
		return listTriggers(this.client, params);
	}

	/** Takes the trigger's id or its key (the `trigger.` prefix is optional). */
	async get(idOrKey: string): Promise<TriggerResult<AutomationTrigger>> {
		return getTrigger(this.client, idOrKey);
	}

	/** `properties` replaces every property. */
	async update(
		id: string,
		params: UpdateTriggerParams,
	): Promise<TriggerResult<AutomationTrigger>> {
		return updateTrigger(this.client, id, params);
	}

	async delete(id: string): Promise<TriggerResult<DeleteTriggerResponse>> {
		return deleteTrigger(this.client, id);
	}
}
