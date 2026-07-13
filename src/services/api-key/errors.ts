

export class ReloopValidationError extends Error {
	readonly field?: string;

	constructor(message: string, field?: string) {
		super(message);
		this.name = "ReloopValidationError";
		this.field = field;
	}
}
