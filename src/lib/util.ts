import { getLocale } from '$lib/paraglide/runtime';
import { object, string } from 'valibot';

export const UserIdSchema = object({
	userId: string()
});

export type SelectItemType = {
	label: string;
	value: string;
};

export type OrganizationMember = {
	user: {
		id: string;
		name: string;
		email: string;
	};
	admin: boolean;
};

export type Assignment = {
	id: string;
	assignment: {
		id: string;
		name: string;
		description: string;
		due_date: string;
		class: string;
	};
	submitted: string;
};

export function formatDate(date: string) {
	const d = new Date(date);

	return d.toLocaleString(`${getLocale()}-CA`, {
		weekday: 'short',
		year: 'numeric',
		month: 'short',
		day: 'numeric',
		hour: 'numeric',
		minute: 'numeric'
	});
}

export function getDaysUntil(date: string) {
	const d = new Date(date);
	const nD = new Date();

	const dUTC = Date.UTC(d.getFullYear(), d.getMonth(), d.getDate());
	const nDUTC = Date.UTC(nD.getFullYear(), nD.getMonth(), nD.getDate());

	return Math.floor((dUTC - nDUTC) / (1000 * 60 * 60 * 24));
}
