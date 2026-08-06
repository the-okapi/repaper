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

export function formatDateInput(date: string) {
	const d = new Date(date);

	const pad = (n: number) => String(n).padStart(2, '0');

	return (
		d.getFullYear() +
		'-' +
		pad(d.getMonth() + 1) +
		'-' +
		pad(d.getDate()) +
		'T' +
		pad(d.getHours()) +
		':' +
		pad(d.getMinutes())
	);
}
