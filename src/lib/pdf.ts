import { browser } from '$app/environment';

export async function downloadDocument(title: string, text: string) {
	if (!browser) return;

	const html2pdf = (await import('html2pdf.js')).default;

	const titleElement = document.createElement('div');
	titleElement.innerHTML = `<h1>${title}</h1>`;

	titleElement.style.paddingBottom = '10px';
	titleElement.style.fontWeight = 'bold';
	titleElement.style.fontSize = '35pt';
	titleElement.style.textAlign = 'center';
	titleElement.style.color = '#000';
	titleElement.style.backgroundColor = '#fff';

	const container = document.createElement('div');
	container.id = 'pdf';
	container.innerHTML = text;

	container.style.color = '#000';
	container.style.backgroundColor = '#fff';
	container.style.paddingBottom = '10px';
	container.style.whiteSpace = 'pre-wrap';

	(container.querySelectorAll('h1') as NodeListOf<HTMLElement>).forEach((item) => {
		item.style.fontSize = '30pt';
		item.style.fontWeight = 'bold';
		item.style.textAlign = 'center';
	});

	(container.querySelectorAll('h2') as NodeListOf<HTMLElement>).forEach((item) => {
		item.style.fontSize = '18pt';
		item.style.fontWeight = 'bold';
		item.style.textAlign = 'center';
	});

	(container.querySelectorAll('p') as NodeListOf<HTMLElement>).forEach((item) => {
		item.style.lineHeight = '1.15rem';
		item.style.marginBottom = '0.4rem';
	});

	const main = document.createElement('div');

	main.appendChild(titleElement);
	main.appendChild(container);

	html2pdf()
		.from(main)
		.set({
			margin: 10,
			filename: title + '.pdf',
			// @ts-expect-error For some reason doesn't detect this property
			pagebreak: {
				mode: 'avoid-all'
			},
			jsPDF: {
				format: 'letter'
			}
		})
		.save();
}
