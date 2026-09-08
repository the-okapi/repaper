import type { Actions } from './$types';
import { redirect, fail } from '@sveltejs/kit';
import { unwrap, unwrapNoData } from '$lib/error';
import { m } from '$lib/paraglide/messages';

export const actions = {
	default: async ({ request, locals, params }) => {
		const { name } = Object.fromEntries(await request.formData());

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
					.eq('organization', params.org)
					.eq('admin', true)
					.eq('user', user.id),
				105
			);

			if (!check?.[0]) {
				return redirect(303, '/admin');
			}

			unwrapNoData(
				await locals.supabase.from('classes').insert({
					name,
					creator: user.id,
					organization: params.org
				}),
				106
			);
		} catch {
			return fail(500, { failure: true, message: m.something_happened() });
		}

		return { success: true };
	}
} satisfies Actions;
