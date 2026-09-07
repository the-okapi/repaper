import type { LayoutServerLoad } from './$types';
import { error500, unwrap, unwrapNoData } from '$lib/error';

export const load: LayoutServerLoad = async ({ cookies, locals }) => {
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
				.select('admin, organization ( id, name )')
				.eq('user', user.id),
			100
		);

		let admin = false;
		let organization = null;

		if (orgMemberships.length === 0 || orgMemberships[0].admin) {
			admin = true;
			organization = orgMemberships[0].organization;
		}

		return {
			cookies: cookies.getAll(),
			loggedIn: true,
			admin,
			organization,
			name: check.name
		};
	} catch {
		return error500();
	}
};
