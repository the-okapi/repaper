import type { Actions, PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { object, string, safeParse } from 'valibot';
import { unwrap, unwrapNoData } from '$lib/error';
import { m } from '$lib/paraglide/messages';

export const load: PageServerLoad = async ({ locals, params }) => {
	try {
		const data = unwrap(
			await locals.supabase.rpc('check_invitation_exists', {
				o: params.org,
				i: params.id
			}),
			72
		);

		if (data.length === 0) {
			return redirect(303, '/');
		}

		return {
			title: m.create_account()
		};
	} catch {
		return redirect(303, '/error');
	}
};

const InvitationSchema = object({
	email: string(),
	password: string(),
	confirmPassword: string()
});

export const actions = {
	default: async ({ request, locals, params }) => {
		const formData = safeParse(InvitationSchema, Object.fromEntries(await request.formData()));

		if (!formData.success) {
			return fail(400, {
				fail: true,
				message: m.something_happened(),
				email: ''
			});
		}

		const { email, password, confirmPassword } = formData.output;

		if (password !== confirmPassword) {
			return fail(400, {
				fail: true,
				message: m.password_confirm_dont_match(),
				email
			});
		}

		try {
			const data = unwrap(
				await locals.supabase.rpc('check_invitation', {
					e: email,
					i: params.id,
					o: params.org
				}),
				73
			);

			if (data === '') {
				return fail(500, { fail: true, message: m.email_incorrect(), email });
			}

			unwrapNoData(
				await locals.supabase.auth.signUp({
					email,
					password,
					options: {
						data: {
							name: data,
							organization: params.org
						}
					}
				}),
				74
			);

			unwrapNoData(
				await locals.supabase.from('invitations').delete().eq('id', params.id),
				75
			);
		} catch {
			return fail(500, { fail: true, message: m.something_happened(), email });
		}

		return redirect(303, '/home');
	}
} satisfies Actions;
