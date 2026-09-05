import type { LayoutServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { unwrap, unwrapNoData } from '$lib/error';

export const load: LayoutServerLoad = async ({ cookies, locals, route }) => {
	if (route.id === '/error') {
		return;
	}

	try {
		const {
			data: { user }
		} = await locals.supabase.auth.getUser();

		if (!user) {
			return {
				cookies: cookies.getAll(),
				loggedIn: false
			};
		}

		await locals.supabase.auth.refreshSession();

		const [check] = unwrap(
			await locals.supabase.from('users').select('name, can_delete').eq('id', user.id),
			37
		);

		if (check.can_delete !== null) {
			unwrapNoData(await locals.supabase.auth.signOut(), 38);
			return {
				cookies: cookies.getAll(),
				loggedIn: false
			};
		}

		const orgMemberships = unwrap(
			await locals.supabase
				.from('organization_memberships')
				.select('admin')
				.eq('user', user.id),
			99
		);

		let admin = false;

		if (orgMemberships.length === 0 || orgMemberships[0].admin) {
			admin = true;
		}

		return {
			cookies: cookies.getAll(),
			loggedIn: true,
			admin,
			name: check.name
		};
	} catch {
		return redirect(303, '/error');
	}
};
