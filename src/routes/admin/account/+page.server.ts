import type { PageServerLoad } from './$types';
import { m } from '$lib/paraglide/messages';

export const load: PageServerLoad = () => {
	return {
		title: m.account()
	};
};
