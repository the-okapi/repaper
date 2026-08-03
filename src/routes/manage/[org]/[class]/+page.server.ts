import type { Actions, PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { add, remove } from './actions';
import { unwrap } from '$lib/error';

export const load: PageServerLoad = async ({ locals, params }) => {
	try {
		const {
			data: { user }
		} = await locals.supabase.auth.getUser();

		if (!user) {
			return redirect(303, '/');
		}

		const data = unwrap(
			await locals.supabase
				.from('class_memberships')
				.select('class ( name, organization ( id, name ) )')
				.eq('class', params.class)
				.eq('user', user.id)
				.eq('admin', true),
			31
		);

		if (!data?.[0]) {
			return redirect(303, '/home');
		}

		const classData = unwrap(
			await locals.supabase
				.from('class_memberships')
				.select('user ( id, name, email ), admin')
				.eq('class', params.class),
			32
		);

		return {
			members: classData,
			title: data[0].class.name,
			organization: data[0].class.organization,
			user: user.id
		};
	} catch {
		return redirect(303, '/error');
	}
};

export const actions = {
	add,
	remove
} satisfies Actions;
