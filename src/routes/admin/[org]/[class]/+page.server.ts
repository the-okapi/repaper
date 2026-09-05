import type { Actions, PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { unwrap, unwrapNoData, HttpError } from '$lib/error';
import { m } from '$lib/paraglide/messages';
import { object, string, safeParse } from 'valibot';
import { fail } from '@sveltejs/kit';
import { UserIdSchema } from '$lib/util';

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
			62
		);

		if (!data?.[0]) {
			return redirect(303, '/admin');
		}

		const classData = unwrap(
			await locals.supabase
				.from('class_memberships')
				.select('user ( id, name, email ), admin')
				.eq('class', params.class),
			63
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

const AddSchema = object({
	userId: string(),
	email: string()
});

export const actions = {
	add: async ({ request, locals, params }) => {
		const formData = safeParse(AddSchema, Object.fromEntries(await request.formData()));

		if (!formData.success) {
			return fail(400, { add: m.something_happened(), user: '' });
		}

		const { userId, email } = formData.output;

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
					.eq('user', user.id)
					.eq('admin', true),
				2
			);

			if (!check?.[0]) {
				throw new HttpError(m.invalid_permissions(), 403);
			}

			const check2 = unwrap(
				await locals.supabase
					.from('classes')
					.select('organization')
					.eq('id', params.class)
					.eq('organization', params.org),
				3
			);

			if (!check2 || check2[0].organization !== params.org) {
				throw new HttpError(m.class_not_found(), 404);
			}

			const check3 = unwrap(
				await locals.supabase
					.from('users')
					.select('id')
					.eq('id', userId)
					.eq('email', email)
					.eq('organization', params.org),
				4
			);

			if (!check3?.[0]) {
				throw new HttpError(m.user_not_found(), 400);
			}

			const check4 = unwrap(
				await locals.supabase
					.from('class_memberships')
					.select('class ( organization )')
					.eq('class', params.class)
					.eq('user', userId),
				5
			);

			if (check4?.[0]) {
				throw new HttpError(m.user_already_class(), 409);
			}

			unwrapNoData(
				await locals.supabase.from('class_memberships').insert({
					user: userId,
					class: params.class,
					admin: false
				}),
				6
			);
		} catch (error: any) {
			if (error.statusCode !== 500) {
				return fail(error.statusCode, { add: error.message, user: userId });
			} else {
				return fail(500, { add: m.something_happened(), user: userId });
			}
		}

		return { success: true };
	},
	remove: async ({ request, locals, params }) => {
		const formData = safeParse(UserIdSchema, Object.fromEntries(await request.formData()));

		if (!formData.success) {
			return fail(400, { remove: m.something_happened() });
		}

		const { userId } = formData.output;

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
					.eq('user', user.id)
					.eq('admin', true)
					.eq('organization', params.org),
				7
			);

			if (!check?.[0]) {
				return new HttpError(m.invalid_permissions(), 403);
			}

			unwrapNoData(
				await locals.supabase
					.from('class_memberships')
					.delete()
					.eq('user', userId)
					.eq('class', params.class),
				1
			);
		} catch (error: any) {
			if (error.statusCode !== 500) {
				return fail(error.statusCode, { remove: error.message, userId });
			} else {
				return fail(500, { remove: m.something_happened(), userId });
			}
		}

		return { success: true };
	}
} satisfies Actions;
