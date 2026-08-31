import { redirect } from '@sveltejs/kit';
import { unwrap } from '$lib/error';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, params }) => {
	const {
		data: { user }
	} = await locals.supabase.auth.getUser();

	if (!user) {
		return redirect(303, '/');
	}

	try {
		const data = unwrap(
			await locals.supabase
				.from('assignment_submissions')
				.select('document ( content ), submitted, user ( name )')
				.eq('id', params.submission),
			97
		);

		const [submission] = data;

		if (!submission) {
			return redirect(303, `/manage/${params.org}/${params.class}/${params.assignment}/`);
		}

		return {
			submission
		};
	} catch {
		return redirect(303, '/error');
	}
};
