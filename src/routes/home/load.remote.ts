import { getRequestEvent, query } from '$app/server';
import { redirect } from '@sveltejs/kit';
import { string } from 'valibot';
import { unwrap } from '$lib/error';

export const loadAdmin = query(string(), async (userId) => {
	const { locals } = getRequestEvent();

	try {
		const orgData = unwrap(
			await locals.supabase
				.from('organization_memberships')
				.select('organization ( id, name ), admin')
				.eq('user', userId)
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
				.eq('user', userId)
				.eq('admin', true),
			77
		);

		const classes = data.map((c: { class: { id: string; name: string } }) => c.class);

		return { classes, organization };
	} catch {
		return redirect(303, '/error');
	}
});

export const loadStudent = query(string(), async (userId) => {
	const { locals } = getRequestEvent();

	try {
		const classMemberships = unwrap(
			await locals.supabase
				.from('class_memberships')
				.select('id, class ( id, name ), admin')
				.eq('user', userId),
			17
		);

		return {
			classes: classMemberships
		};
	} catch {
		return redirect(303, '/error');
	}
});
