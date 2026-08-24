import { command, form, getRequestEvent } from '$app/server';
import { object, string } from 'valibot';
import { unwrap, unwrapNoData } from '$lib/error';
import { m } from '$lib/paraglide/messages';
import { redirect } from '@sveltejs/kit';

export const signOutC = command(async () => {
	const { locals } = getRequestEvent();

	try {
		unwrapNoData(await locals.supabase.auth.signOut(), 84);
	} catch {
		return { status: 500 };
	}

	return { status: 200 };
});

export const signOut = form(async () => {
	const { locals } = getRequestEvent();

	try {
		unwrapNoData(await locals.supabase.auth.signOut(), 84);
	} catch {
		return redirect(303, '/error');
	}

	return redirect(303, '/');
});

const LogInSchema = object({
	email: string(),
	password: string()
});

export const logInForm = form(LogInSchema, async ({ email, password }) => {
	const { locals } = getRequestEvent();

	try {
		const {
			data: { user },
			error
		} = await locals.supabase.auth.signInWithPassword({
			email,
			password
		});

		if (error || !user) {
			return { status: 404, message: m.user_not_found() };
		}

		const check = unwrap(
			await locals.supabase.from('users').select('can_delete').eq('id', user.id),
			85
		);

		if (!check[0].can_delete) {
			return redirect(303, '/home');
		}

		unwrapNoData(await locals.supabase.auth.signOut(), 86);

		return { status: 404, message: m.user_not_found() };
	} catch {
		return { status: 500, message: m.something_happened() };
	}
});

export const logIn = command(LogInSchema, async ({ email, password }) => {
	const { locals } = getRequestEvent();

	try {
		const {
			data: { user },
			error
		} = await locals.supabase.auth.signInWithPassword({
			email,
			password
		});

		if (error || !user) {
			return { status: 404, message: m.user_not_found() };
		}

		const check = unwrap(
			await locals.supabase.from('users').select('can_delete').eq('id', user.id),
			85
		);

		if (!check[0].can_delete) {
			return { status: 200 };
		}

		unwrapNoData(await locals.supabase.auth.signOut(), 86);

		return { status: 404, message: m.user_not_found() };
	} catch {
		return { status: 500, message: m.something_happened() };
	}
});
