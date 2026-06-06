export { Editor } from '@tiptap/core';
export { default as Document } from '@tiptap/extension-document';
export { default as Text } from '@tiptap/extension-text';
export { default as Paragraph } from '@tiptap/extension-paragraph';
export { TextStyle, FontSize } from '@tiptap/extension-text-style';
export { default as TextAlign } from '@tiptap/extension-text-align';
export { UndoRedo } from '@tiptap/extensions';

import ItalicTiptap from '@tiptap/extension-italic';
import BoldTiptap from '@tiptap/extension-bold';
import UnderlineTiptap from '@tiptap/extension-underline';

export const Bold = BoldTiptap.extend({
	addKeyboardShortcuts() {
		return {
			F3: () => this.editor.commands.toggleBold(),
			'Mod-b': () => this.editor.commands.toggleBold()
		};
	}
});

export const Italic = ItalicTiptap.extend({
	addKeyboardShortcuts() {
		return {
			F4: () => this.editor.commands.toggleItalic(),
			'Mod-i': () => this.editor.commands.toggleItalic()
		};
	}
});

export const Underline = UnderlineTiptap.extend({
	addKeyboardShortcuts() {
		return {
			F5: () => this.editor.commands.toggleUnderline(),
			'Mod-u': () => this.editor.commands.toggleUnderline()
		};
	}
});
