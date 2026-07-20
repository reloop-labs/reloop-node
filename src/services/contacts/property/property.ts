import type { ReloopClient } from "@/client";
import { createProperty } from "@/services/contacts/property/create/create";
import { deleteProperty } from "@/services/contacts/property/delete/delete";
import { listProperties } from "@/services/contacts/property/list/list";
import type {
	PropertyListResult,
	PropertyResult,
} from "@/services/contacts/property/result";
import type {
	ContactPropertyResponse,
	CreatePropertyParams,
	DeletePropertyResponse,
	ListPropertiesParams,
	UpdatePropertyParams,
} from "@/services/contacts/property/types";
import { updateProperty } from "@/services/contacts/property/update/update";

export class PropertyService {
	constructor(private readonly client: ReloopClient) {}

	async create(
		params: CreatePropertyParams,
	): Promise<PropertyResult<ContactPropertyResponse>> {
		return createProperty(this.client, params);
	}

	async list(params?: ListPropertiesParams): Promise<PropertyListResult> {
		return listProperties(this.client, params);
	}

	async update(
		id: string,
		params: UpdatePropertyParams,
	): Promise<PropertyResult<ContactPropertyResponse>> {
		return updateProperty(this.client, id, params);
	}

	async delete(id: string): Promise<PropertyResult<DeletePropertyResponse>> {
		return deleteProperty(this.client, id);
	}
}
