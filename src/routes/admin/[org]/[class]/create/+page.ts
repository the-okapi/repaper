import type { PageLoad } from './$types';
import { m } from '$lib/paraglide/messages';

export const load: PageLoad = () => {
	return {
		title: m.create_assignment()
	};
};
