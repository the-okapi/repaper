import { db } from '$lib/server/db';
import { sessions } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import type { RequestHandler } from './$types';
import { error } from '$lib/server/db/logs';

export const POST: RequestHandler = async ({ url, request }) => {
	const host = url.hostname;
	if (!(host === 'localhost' && import.meta.env.DEV) && host !== 'repaper.unlimitedstuffltd.com') {
		return new Response(null, { status: 401 });
	}

	const userAgent = request.headers.get('user-agent') ?? '';
	const json = await request.json();
	const token = json.token;
	try {
		await db.delete(sessions).where(eq(sessions.token, token));
	} catch (errorV) {
		error({
			userAgent,
			info: `token:${token}`,
			action: 'delete-sessions',
			error: JSON.stringify(errorV)
		});
	}
	return new Response(null, { status: 200 });
};
