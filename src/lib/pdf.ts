import { browser } from '$app/environment';

export async function downloadDocument(text: string) {
	if (!browser) return;

	const html2pdf = (await import('html2pdf.js')).default;

	const container = document.createElement('div');
	container.innerHTML = text;

	container.style.color = '#000';
	container.style.backgroundColor = '#fff';

	html2pdf()
		.from(container)
		.set({
			margin: 10,
			filename: 'Document.pdf'
		})
		.save();
}
