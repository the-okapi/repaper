export { Editor } from '@tiptap/core';
export { default as Document } from '@tiptap/extension-document';
export { default as Text } from '@tiptap/extension-text';
export { default as Paragraph } from '@tiptap/extension-paragraph';
export { TextStyle, FontSize } from '@tiptap/extension-text-style';
export { default as TextAlign } from '@tiptap/extension-text-align';
export { UndoRedo } from '@tiptap/extensions';
export { default as Bold } from '@tiptap/extension-bold';
export { default as Italic } from '@tiptap/extension-italic';
export { default as Underline } from '@tiptap/extension-underline';
export { default as Heading } from '@tiptap/extension-heading';

import { Extension } from '@tiptap/core';

export const Tab = Extension.create({
	name: 'tab',

	addKeyboardShortcuts() {
		return {
			Tab: () => this.editor.commands.insertContent('\t')
		};
	}
});
