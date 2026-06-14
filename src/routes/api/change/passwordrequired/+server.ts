import { error } from '$lib/server/db/logs';
import { documents } from '$lib/server/db/schema';
import { checkToken } from '$lib/server/db/token';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';

export const POST: RequestHandler = async ({ request }) => {
	const userAgent = request.headers.get('user-agent') ?? '';
	const json = await request.json();
	const code: string = json.code;
	const token: string = json.token;
	const passwordRequired: boolean = json.passwordRequired;
	const tokenCheck = await checkToken(userAgent, token, code, 'editor');
	if (!tokenCheck) {
		return new Response(null, { status: 401 });
	}
	try {
		await db
			.update(documents)
			.set({
				passwordRequired: passwordRequired ? 1 : 0
			})
			.where(eq(documents.code, code));
	} catch (errorV) {
		error({
			userAgent,
			info: `code:${code},token:${token},required:${passwordRequired}`,
			action: 'change-pass-req',
			error: JSON.stringify(errorV)
		});
		return new Response(null, { status: 500 });
	}
	return new Response(null, { status: 200 });
};
