import en from '$lib/lang/en';
import fr from '$lib/lang/fr';

export const languageState = $state({
	lang: 'en'
});

export function setLanguage(lang: string) {
	languageState.lang = lang;
}

export default function get(langState: { lang: string }, key: string) {
	if (langState.lang === 'en') {
		return en[key];
	} else if (langState.lang === 'fr') {
		return fr[key];
	}
}
