import { Resend } from 'resend';
import { PRIVATE_RESEND_API_KEY } from '$app/env/private';

const resend = new Resend(PRIVATE_RESEND_API_KEY);

export default resend;
