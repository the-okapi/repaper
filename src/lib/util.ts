import { getLocale } from '$lib/paraglide/runtime';

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
