import { getRequestEvent, query } from '$app/server';
import { string } from 'valibot';
import { redirect } from '@sveltejs/kit';
import { handleHttpError, HttpError, unwrap } from '$lib/error';

export const load = query(string(), async (organization: string) => {
	const { locals } = getRequestEvent();

	const {
		data: { user }
	} = await locals.supabase.auth.getUser();

	if (!user) {
		return redirect(303, '/');
	}

	try {
		const check = unwrap(
			await locals.supabase
				.from('organization_memberships')
				.select('id')
				.eq('organization', organization)
				.eq('admin', true)
				.eq('user', user.id),
			35
		);

		if (!check?.[0]) {
			throw new HttpError(303, '/admin');
		}

		const data = unwrap(
			await locals.supabase
				.from('organization_memberships')
				.select('user ( id, name, email ), admin')
				.eq('organization', organization),
			36
		);

		return { data };
	} catch (e: any) {
		return handleHttpError(e);
	}
});
