import type { ReloopClient } from "@/client";
import { activateAutomation } from "@/services/automation/activate/activate";
import { createAutomation } from "@/services/automation/create/create";
import { deleteAutomation } from "@/services/automation/delete/delete";
import { enrollContact } from "@/services/automation/enroll/enroll";
import { EnrollmentService } from "@/services/automation/enrollment/enrollment";
import { getAutomation } from "@/services/automation/get/get";
import { listAutomations } from "@/services/automation/list/list";
import { pauseAutomation } from "@/services/automation/pause/pause";
import type {
	AutomationListResult,
	AutomationResult,
	EnrollmentResult,
} from "@/services/automation/result";
import type {
	Automation,
	CreateAutomationParams,
	DeleteAutomationResponse,
	EnrollContactParams,
	EnrollContactResponse,
	ListAutomationsParams,
	UpdateAutomationParams,
} from "@/services/automation/types";
import { updateAutomation } from "@/services/automation/update/update";

export class AutomationService {
	public readonly enrollments: EnrollmentService;

	constructor(private readonly client: ReloopClient) {
		this.enrollments = new EnrollmentService(client);
	}

	/** Creates an automation from steps and the connections between them. */
	async create(
		params: CreateAutomationParams,
	): Promise<AutomationResult<Automation>> {
		return createAutomation(this.client, params);
	}

	async list(params?: ListAutomationsParams): Promise<AutomationListResult> {
		return listAutomations(this.client, params);
	}

	async get(id: string): Promise<AutomationResult<Automation>> {
		return getAutomation(this.client, id);
	}

	/** Renames, replaces the steps, or starts (`active`) / stops (`paused`) it. */
	async update(
		id: string,
		params: UpdateAutomationParams,
	): Promise<AutomationResult<Automation>> {
		return updateAutomation(this.client, id, params);
	}

	async delete(id: string): Promise<AutomationResult<DeleteAutomationResponse>> {
		return deleteAutomation(this.client, id);
	}

	/** Publishes the current steps and starts running it for new events. */
	async activate(id: string): Promise<AutomationResult<Automation>> {
		return activateAutomation(this.client, id);
	}

	/** Stops new enrollments. */
	async pause(id: string): Promise<AutomationResult<Automation>> {
		return pauseAutomation(this.client, id);
	}

	/** Starts an active automation for one contact without an event. */
	async enroll(
		id: string,
		params: EnrollContactParams,
	): Promise<EnrollmentResult<EnrollContactResponse>> {
		return enrollContact(this.client, id, params);
	}
}
