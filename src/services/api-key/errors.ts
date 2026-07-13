/**
 * Thrown when caller input fails client-side validation.
 * No HTTP request is made when this is thrown.
 */
export class ReloopValidationError extends Error {
	readonly field?: string;

	constructor(message: string, field?: string) {
		super(message);
		this.name = "ReloopValidationError";
		this.field = field;
	}
}
