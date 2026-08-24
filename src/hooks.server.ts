import { sequence } from '@sveltejs/kit/hooks';
import { getTextDirection } from '$lib/paraglide/runtime';
import { paraglideMiddleware } from '$lib/paraglide/server';
import type { Handle } from '@sveltejs/kit';
import { createServerClient } from '@supabase/ssr';
import { PRIVATE_SUPABASE_PUBLISHABLE_KEY, PRIVATE_SUPABASE_URL } from '$app/env/private';

const originalHandle: Handle = async ({ event, resolve }) => {
	event.locals.supabase = createServerClient(
		PRIVATE_SUPABASE_URL,
		PRIVATE_SUPABASE_PUBLISHABLE_KEY,
		{
			cookies: {
				getAll() {
					return event.cookies.getAll();
				},

				setAll(cookiesToSet) {
					cookiesToSet.forEach(({ name, value, options }) =>
						event.cookies.set(name, value, { ...options, path: '/' })
					);
				}
			}
		}
	);

	return resolve(event, {
		filterSerializedResponseHeaders(name) {
			return name === 'content-range' || name === 'x-supabase-api-version';
		}
	});
};

const handleParaglide: Handle = ({ event, resolve }) =>
	paraglideMiddleware(event.request, ({ request, locale }) => {
		event.request = request;

		return resolve(event, {
			transformPageChunk: ({ html }) =>
				html
					.replace('%paraglide.lang%', locale)
					.replace('%paraglide.dir%', getTextDirection(locale))
		});
	});

export const handle = sequence(originalHandle, handleParaglide);
