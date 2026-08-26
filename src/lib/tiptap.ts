import { Bold } from '@tiptap/extension-bold';
import { Document } from '@tiptap/extension-document';
import { Heading } from '@tiptap/extension-heading';
import { HorizontalRule } from '@tiptap/extension-horizontal-rule';
import { Italic } from '@tiptap/extension-italic';
import { Paragraph } from '@tiptap/extension-paragraph';
import { Underline } from '@tiptap/extension-underline';
import { UndoRedo } from '@tiptap/extensions';
import { Text } from '@tiptap/extension-text';
import { Extension } from '@tiptap/core';

export const Keybindings = Extension.create({
	addKeyboardShortcuts() {
		return {
			F1: () => this.editor.commands.setHeading({ level: 1 }),
			F2: () => this.editor.commands.setHeading({ level: 2 }),
			F3: () => this.editor.commands.setParagraph(),
			Tab: () => this.editor.commands.insertContent('\t')
		};
	}
});

export const extensions = [
	Bold,
	Document,
	Heading.configure({
		levels: [1, 2]
	}),
	HorizontalRule,
	Italic,
	Paragraph,
	Text,
	Underline
];

export const editorExtensions = [UndoRedo, Keybindings];
