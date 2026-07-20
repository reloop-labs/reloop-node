export type PropertyType = "string" | "number";

export interface ContactProperty {
	object: "contact_property";
	id: string;
	propertyName: string;
	propertyType: PropertyType;
	defaultValue: string | null;
	createdAt: string;
	updatedAt: string;
}

export interface ContactPropertyResponse extends ContactProperty {
	event: string;
}

export interface ContactPropertyListItem {
	id: string;
	propertyName: string;
	propertyType: PropertyType;
	defaultValue: string | null;
	createdAt: string;
	updatedAt: string;
}

export interface CreatePropertyParams {
	name: string;
	type: PropertyType;
	fallbackValue?: string;
}

export interface UpdatePropertyParams {
	fallbackValue: string | null;
}

export interface ListPropertiesParams {
	page?: number;
	limit?: number;
	search?: string;
	type?: PropertyType;
}

export interface PropertyListResponse {
	object: "contact_property";
	properties: ContactPropertyListItem[];
	total: number;
	page: number;
	limit: number;
	event: string;
}

export interface DeletePropertyResponse {
	object: "contact_property";
	success: boolean;
	id: string;
	name: string;
	event: string;
}
