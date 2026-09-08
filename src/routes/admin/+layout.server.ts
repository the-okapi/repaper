import type { LayoutServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { handleHttpError, HttpError, unwrap } from '$lib/error';

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

	try {
		const memberships = unwrap(
			await locals.supabase
				.from('organization_memberships')
				.select('id, organization')
				.eq('user', user.id),
			103
		);

		if (memberships.length < 1) {
			throw new HttpError(303, '/admin/create');
		}

		const classes = unwrap(
			await locals.supabase
				.from('classes')
				.select('id, name')
				.eq('organization', memberships[0].organization),
			15
		);

		return {
			classes: classes.map((a: { id: string; name: string }) => ({
				value: a.id,
				label: a.name
			}))
		};
	} catch (e: any) {
		return handleHttpError(e);
	}
};
