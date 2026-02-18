'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import CharacterCount from '@tiptap/extension-character-count';
import { useCallback, useEffect } from 'react';
import {
    Bold,
    Italic,
    List,
    ListOrdered,
    Quote,
    Undo,
    Redo,
    Heading1,
    Heading2,
    Heading3,
    Code,
    ImageIcon,
    Link2,
} from 'lucide-react';

const MenuBar = ({ editor }) => {
    if (!editor) return null;

    const addImage = useCallback(() => {
        const url = window.prompt('Enter image URL:');
        if (url) {
            editor.chain().focus().setImage({ src: url }).run();
        }
    }, [editor]);

    const setLink = useCallback(() => {
        const previousUrl = editor.getAttributes('link').href;
        const url = window.prompt('Enter URL:', previousUrl);

        if (url === null) return;

        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
        }

        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    }, [editor]);

    return (
        <div className="border-b border-gray-200 dark:border-gray-700 p-2 flex flex-wrap gap-1">
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleBold().run()}
                disabled={!editor.can().chain().focus().toggleBold().run()}
                className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${editor.isActive('bold') ? 'bg-gray-200 dark:bg-gray-600' : ''
                    }`}
                title="Bold"
            >
                <Bold className="w-4 h-4" />
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleItalic().run()}
                disabled={!editor.can().chain().focus().toggleItalic().run()}
                className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${editor.isActive('italic') ? 'bg-gray-200 dark:bg-gray-600' : ''
                    }`}
                title="Italic"
            >
                <Italic className="w-4 h-4" />
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${editor.isActive('heading', { level: 1 }) ? 'bg-gray-200 dark:bg-gray-600' : ''
                    }`}
                title="Heading 1"
            >
                <Heading1 className="w-4 h-4" />
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-200 dark:bg-gray-600' : ''
                    }`}
                title="Heading 2"
            >
                <Heading2 className="w-4 h-4" />
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${editor.isActive('heading', { level: 3 }) ? 'bg-gray-200 dark:bg-gray-600' : ''
                    }`}
                title="Heading 3"
            >
                <Heading3 className="w-4 h-4" />
            </button>
            <div className="w-px h-8 bg-gray-300 dark:bg-gray-600 mx-1" />
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${editor.isActive('bulletList') ? 'bg-gray-200 dark:bg-gray-600' : ''
                    }`}
                title="Bullet List"
            >
                <List className="w-4 h-4" />
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${editor.isActive('orderedList') ? 'bg-gray-200 dark:bg-gray-600' : ''
                    }`}
                title="Numbered List"
            >
                <ListOrdered className="w-4 h-4" />
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${editor.isActive('blockquote') ? 'bg-gray-200 dark:bg-gray-600' : ''
                    }`}
                title="Quote"
            >
                <Quote className="w-4 h-4" />
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${editor.isActive('codeBlock') ? 'bg-gray-200 dark:bg-gray-600' : ''
                    }`}
                title="Code Block"
            >
                <Code className="w-4 h-4" />
            </button>
            <div className="w-px h-8 bg-gray-300 dark:bg-gray-600 mx-1" />
            <button
                type="button"
                onClick={setLink}
                className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${editor.isActive('link') ? 'bg-gray-200 dark:bg-gray-600' : ''
                    }`}
                title="Add Link"
            >
                <Link2 className="w-4 h-4" />
            </button>
            <button
                type="button"
                onClick={addImage}
                className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title="Add Image"
            >
                <ImageIcon className="w-4 h-4" />
            </button>
            <div className="w-px h-8 bg-gray-300 dark:bg-gray-600 mx-1" />
            <button
                type="button"
                onClick={() => editor.chain().focus().undo().run()}
                disabled={!editor.can().chain().focus().undo().run()}
                className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                title="Undo"
            >
                <Undo className="w-4 h-4" />
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().redo().run()}
                disabled={!editor.can().chain().focus().redo().run()}
                className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                title="Redo"
            >
                <Redo className="w-4 h-4" />
            </button>
        </div>
    );
};

const TiptapEditor = ({ content, onChange, placeholder = 'Start writing your blog post...', error }) => {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Image.configure({
                HTMLAttributes: {
                    class: 'max-w-full h-auto rounded-lg my-4',
                },
            }),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-blue-600 dark:text-blue-400 underline',
                },
            }),
            Placeholder.configure({
                placeholder,
            }),
            CharacterCount,
        ],
        content,
        editorProps: {
            attributes: {
                class: 'prose prose-sm sm:prose lg:prose-lg dark:prose-invert max-w-none focus:outline-none min-h-[400px] p-4',
            },
        },
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        // CRITICAL: Fix SSR hydration mismatch
        immediatelyRender: false,
    });

    // Update editor content when prop changes (for edit mode)
    useEffect(() => {
        if (editor && content !== undefined && content !== editor.getHTML()) {
            editor.commands.setContent(content);
        }
    }, [content, editor]);

    // Show loading state while editor initializes
    if (!editor) {
        return (
            <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden bg-white dark:bg-gray-800">
                <div className="border-b border-gray-200 dark:border-gray-700 p-2 h-12 bg-gray-50 dark:bg-gray-900 animate-pulse" />
                <div className="p-4 min-h-[400px] flex items-center justify-center">
                    <div className="text-sm text-gray-500 dark:text-gray-400">Loading editor...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-2">
            <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden bg-white dark:bg-gray-800">
                <MenuBar editor={editor} />
                <EditorContent editor={editor} />
            </div>
            {editor && (
                <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
                    <span>
                        {editor.storage.characterCount.characters()} characters,{' '}
                        {editor.storage.characterCount.words()} words
                    </span>
                    {error && <span className="text-red-600 dark:text-red-400">{error}</span>}
                </div>
            )}
        </div>
    );
};

export default TiptapEditor;