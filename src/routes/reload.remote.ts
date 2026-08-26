import { command, getRequestEvent } from '$app/server';

export const reloadSession = command(async () => {
	const { locals } = getRequestEvent();

	await locals.supabase.auth.refreshSession();
});
