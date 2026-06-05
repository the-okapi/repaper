export const languageState = $state({
	lang: 'en'
});

export function setLanguage(lang: string) {
	languageState.lang = lang;
}

export default function get(langState: { lang: string }, en: string, fr: string): string {
	if (langState.lang === 'fr') {
		return fr;
	} else {
		return en;
	}
}
