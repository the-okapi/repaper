import type { PageServerLoad, Actions } from './$types';
import { redirect, fail } from '@sveltejs/kit';
import { unwrap, unwrapNoData } from '$lib/error';
import { m } from '$lib/paraglide/messages';

export const load: PageServerLoad = async ({ locals }) => {
	const {
		data: { user }
	} = await locals.supabase.auth.getUser();

	if (!user) {
		return redirect(303, '/');
	}

	try {
		const orgData = unwrap(
			await locals.supabase
				.from('organization_memberships')
				.select('organization ( id, name ), admin')
				.eq('user', user.id)
				.limit(1),
			76
		);

		if (orgData.length === 0) {
			return { organization: null, classes: [] };
		}

		const organization = {
			admin: orgData[0].admin,
			id: orgData[0].organization.id,
			name: orgData[0].organization.name
		};

		const data = unwrap(
			await locals.supabase
				.from('class_memberships')
				.select('class ( id, name )')
				.eq('user', user.id)
				.eq('admin', true),
			77
		);

		const classes = data.map((c: { class: { id: string; name: string } }) => c.class);

		return { classes, organization, title: m.home() };
	} catch {
		return redirect(303, '/error');
	}
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
					.eq('admin', true)
					.eq('user', user.id),
				79
			);

			if (!check?.[0]) {
				return redirect(303, '/admin');
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
			return fail(500, { orgFailure: true, message: m.something_happened() });
		}

		return { success: true };
	}
} satisfies Actions;
