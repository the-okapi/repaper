import { browser } from '$app/environment';

export async function downloadDocument(text: string) {
	if (!browser) return;

	const html2pdf = (await import('html2pdf.js')).default;

	const container = document.createElement('div');
	container.id = 'pdf';
	container.innerHTML = text;

	container.style.color = '#000';
	container.style.backgroundColor = '#fff';
	container.style.paddingBottom = '10px';

	html2pdf()
		.from(container)
		.set({
			margin: 10,
			filename: 'Document.pdf',
			// @ts-expect-error For some reason doesn't detect this property
			pagebreak: {
				mode: 'avoid-all'
			}
		})
		.save();
}
