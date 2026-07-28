import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { m } from '$lib/paraglide/messages';

export const load: PageLoad = async ({ parent, data }) => {
	const parentData = await parent();
	if (!parentData.loggedIn) {
		return redirect(307, '/');
	}

	return { title: m.home(), ...data };
};
