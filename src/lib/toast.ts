import { toast } from 'svelte-sonner';
import Toast from '$lib/components/Toast.svelte';

export function showToast(message: string, state = 'default') {
	toast.custom(Toast, {
		// @ts-expect-error Type checker does not register closeToast event
		componentProps: {
			message,
			state
		}
	});
}
