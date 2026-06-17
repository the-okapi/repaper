import type { RequestHandler } from './$types';
import { checkToken } from '$lib/server/db/token';

export const POST: RequestHandler = async ({ request }) => {
	const json = await request.json();
	const documentCode = json.documentCode;
	const token = json.token;
	const permissions = json.mode;
	const userAgent = request.headers.get('user-agent') ?? '';
	const tokenCheck = await checkToken(userAgent, token, documentCode, permissions);
	
	return new Response(null, { status: tokenCheck ? 200 : 401 });
};
