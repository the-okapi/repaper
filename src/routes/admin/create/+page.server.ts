import { redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { error500, HttpError } from '$lib/error';
import { m } from '$lib/paraglide/messages';
import { unwrapNoData } from '$lib/error';

export const load: PageServerLoad = async ({ locals }) => {
	const {
		data: { user }
	} = await locals.supabase.auth.getUser();

	if (!user) {
		throw new HttpError(303, '/');
	}

	const { data: memberships, error: e } = await locals.supabase
		.from('organization_memberships')
		.select('id')
		.eq('user', user.id);

	if (e) {
		console.error(e.message, 'Error Code 102');
		return error500();
	}

	if (memberships.length > 0) {
		return redirect(303, '/admin');
	}

	return {
		title: m.create_organization()
	};
};

export const actions = {
	default: async ({ locals, request }) => {
		const { name } = Object.fromEntries(await request.formData());

		const {
			data: { user }
		} = await locals.supabase.auth.getUser();

		if (!user) {
			return redirect(303, '/');
		}

		try {
			const id = crypto.randomUUID();

			unwrapNoData(
				await locals.supabase.from('organizations').insert({
					id,
					name,
					creator: user.id
				}),
				81
			);

			unwrapNoData(
				await locals.supabase
					.from('users')
					.update({
						organization: id
					})
					.eq('id', user.id),
				82
			);
		} catch {
			return error500();
		}

		return redirect(303, '/admin');
	}
} satisfies Actions;
