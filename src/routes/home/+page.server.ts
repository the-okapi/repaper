import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { unwrap, unwrapNoData } from '$lib/error';
import { m } from '$lib/paraglide/messages';

export const load: PageServerLoad = async ({ locals }) => {
	const {
		data: { user }
	} = await locals.supabase.auth.getUser();

	if (!user) {
		return redirect(303, '/');
	}

	return { user: user.id };
};

export const actions = {
	create: async ({ request, locals }) => {
		const { className, organization } = Object.fromEntries(await request.formData());

		try {
			const {
				data: { user }
			} = await locals.supabase.auth.getUser();

			if (!user) {
				return redirect(303, '/');
			}

			const check = unwrap(
				await locals.supabase
					.from('organization_memberships')
					.select('id')
					.eq('organization', organization)
					.eq('owner', true)
					.eq('user', user.id),
				79
			);

			if (!check?.[0]) {
				return redirect(303, '/home');
			}

			unwrapNoData(
				await locals.supabase.from('classes').insert({
					name: className,
					creator: user.id,
					organization
				}),
				80
			);
		} catch {
			return fail(500, { createFailure: true, message: m.something_happened() });
		}

		return { success: true };
	},
	organization: async ({ request, locals }) => {
		const { orgName } = Object.fromEntries(await request.formData());
		try {
			const {
				data: { user }
			} = await locals.supabase.auth.getUser();

			if (!user) {
				return redirect(303, '/');
			}

			const id = crypto.randomUUID();

			unwrapNoData(
				await locals.supabase.from('organizations').insert({
					id,
					name: orgName,
					creator: user.id
				}),
				82
			);

			unwrapNoData(
				await locals.supabase
					.from('users')
					.update({
						organization: id
					})
					.eq('id', user.id),
				83
			);
		} catch {
			return fail(500, { orgFailure: true, message: m.something_happened() });
		}

		return { success: true };
	}
} satisfies Actions;
