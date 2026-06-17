import { checkToken } from '$lib/server/db/token';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { documents } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { error, success } from '$lib/server/db/logs';

export const POST: RequestHandler = async ({ request }) => {
	const userAgent = request.headers.get('user-agent') ?? '';
	const json = await request.json();
	const code: string = json.code;
	const token: string = json.token;
	const autosave: boolean = json.autosave;
	const tokenCheck = checkToken(userAgent, token, code, 'editor');
	if (!tokenCheck) {
		return new Response(null, { status: 401 });
	}
	try {
		await db
			.update(documents)
			.set({
				autosave
			})
			.where(eq(documents.code, code));
	} catch (errorV) {
		error({
			userAgent,
			info: `code:${code},token:${token},autosave:${autosave}`,
			action: 'change-doc-autosave',
			error: JSON.stringify(errorV)
		});
		return new Response(null, { status: 500 });
	}
	success({
		userAgent,
		info: `code:${code},token:${token},autosave:${autosave}`,
		action: 'change-doc-autosave'
	});
	return new Response(null, { status: 200 });
};
