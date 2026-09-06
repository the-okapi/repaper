import type { LayoutServerLoad } from './$types';
import { error, redirect } from '@sveltejs/kit';
import { m } from '$lib/paraglide/messages';

export const load: LayoutServerLoad = async ({ parent, route, locals }) => {
	const parentData = await parent();
	if (!parentData.loggedIn) {
		return redirect(303, '/');
	}

	if (!parentData.admin) {
		return redirect(303, '/student');
	}

	if (route.id === '/admin/create') {
		return;
	}

	const {
		data: { user }
	} = await locals.supabase.auth.getUser();

	if (!user) {
		return redirect(303, '/');
	}

	const { data: memberships, error: e } = await locals.supabase
		.from('organization_memberships')
		.select('id')
		.eq('user', user.id);

	if (e) {
		console.error(e.message, 'Error Code 103');
		return error(500, m.something_happened());
	}

	if (memberships.length < 1) {
		return redirect(303, '/admin/create');
	}
};
