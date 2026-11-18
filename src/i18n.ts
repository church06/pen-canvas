import { getLanguage } from 'obsidian';

// Interface language: follows Obsidian's language (Chinese -> Chinese, anything else -> English) unless the
// plugin setting picks one. Strings are looked up when the UI is built, so a change applies to newly opened canvases.
export type Lang = 'auto' | 'zh' | 'en';
let lang: Lang = 'auto';
export function setLang(l: Lang): void { lang = l; }
export function isZh(): boolean {
	if (lang !== 'auto') return lang === 'zh';
	return getLanguage().startsWith('zh');
}
/** Chinese or English text for the current interface language. */
export const tr = (zh: string, en: string): string => (isZh() ? zh : en);
