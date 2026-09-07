import { redirect, error } from '@sveltejs/kit';
import { m } from '$lib/paraglide/messages';

export class HttpError extends Error {
	status: number;

	constructor(status: number, message: string) {
		super(message);

		this.status = status;
	}
}

export function unwrap(response: { data: any; error: any }, code: number) {
	if (response.error) {
		console.error(response.error, 'Error Code ' + code);
		throw new HttpError(500, response.error.message);
	} else {
		return response.data;
	}
}

export function unwrapNoData(response: { error: any }, code: number) {
	if (response.error) {
		console.error(response.error, 'Error Code ' + code);
		throw new HttpError(500, response.error.message);
	}
}

export function handleHttpError(e: HttpError) {
	if (e.status === 303) {
		return redirect(303, e.message);
	} else {
		return error(e.status, m.something_happened());
	}
}

export function error500() {
	return error(500, m.something_happened());
}
