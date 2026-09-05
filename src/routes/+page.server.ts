import { redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { unwrapNoData } from '$lib/error';

export const load: PageServerLoad = async ({ parent }) => {
	const data = await parent();
	if (data.loggedIn) {
		return redirect(307, '/student');
	}

	return {
		title: 'Repaper'
	};
};

export const actions = {
	signOut: async ({ locals }) => {
		try {
			unwrapNoData(await locals.supabase.auth.signOut(), 84);
		} catch {
			return redirect(303, '/error');
		}

		return redirect(303, '/');
	}
} satisfies Actions;
