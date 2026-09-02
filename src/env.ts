import { defineEnvVars } from '@sveltejs/kit/env';

export const variables = defineEnvVars({
	PRIVATE_SUPABASE_URL: {},
	PRIVATE_SUPABASE_PUBLISHABLE_KEY: {},
	PRIVATE_RESEND_API_KEY: {},
	PUBLIC_REPAPER_URL: {
		public: true
	},
	PUBLIC_HELP_URL: {
		public: true
	}
});
