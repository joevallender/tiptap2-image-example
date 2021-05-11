<template>
    <div class="frame">
        <div v-if="editor" class="controls">
            <button
                @click="editor.chain().focus().toggleBold().run()"
                :class="{ 'is-active': editor.isActive('bold') }"
            >
                B
            </button>
            <button
                @click="editor.chain().focus().toggleItalic().run()"
                :class="{ 'is-active': editor.isActive('italic') }"
            >
                <em>I</em>
            </button>
            <button
                @click="
                    editor.chain().focus().toggleHeading({ level: 1 }).run()
                "
                :class="{
                    'is-active': editor.isActive('heading', { level: 1 })
                }"
            >
                H1
            </button>
            <button
                @click="
                    editor.chain().focus().toggleHeading({ level: 2 }).run()
                "
                :class="{
                    'is-active': editor.isActive('heading', { level: 2 })
                }"
            >
                H2
            </button>
            <button
                @click="
                    editor.chain().focus().toggleHeading({ level: 3 }).run()
                "
                :class="{
                    'is-active': editor.isActive('heading', { level: 3 })
                }"
            >
                H3
            </button>

            <button @click="addImage">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    style="width: 20px; height: 20px"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                </svg>
            </button>
            <button @click="addVideo">Video</button>
        </div>
        <bubble-menu
            class="bubble-menu"
            :tippy-options="{ animation: false }"
            :editor="editor"
            v-if="editor"
            v-show="editor.isActive('custom-image')"
        >
            <button
                @click="
                    editor
                        .chain()
                        .focus()
                        .setImage({ size: 'small' })
                        .run()
                "
                :class="{
                    'is-active': editor.isActive('custom-image', {
                        size: 'small'
                    })
                }"
            >
                Small
            </button>
            <button
                @click="
                    editor
                        .chain()
                        .focus()
                        .setImage({ size: 'medium' })
                        .run()
                "
                :class="{
                    'is-active': editor.isActive('custom-image', {
                        size: 'medium'
                    })
                }"
            >
                Medium
            </button>
            <button
                @click="
                    editor
                        .chain()
                        .focus()
                        .setImage({ size: 'large' })
                        .run()
                "
                :class="{
                    'is-active': editor.isActive('custom-image', {
                        size: 'large'
                    })
                }"
            >
                Large
            </button>
            <span style="color: #aaa">|</span>
            <button @click="addImage">Change</button>
        </bubble-menu>
        <editor-content :editor="editor" style="padding: 20px" />
    </div>
</template>

<script>
import { Editor, EditorContent, BubbleMenu } from '@tiptap/vue-3'
import { defaultExtensions } from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
// import CustomImage from '../extensions/custom-image'
// import CustomImage from '../extensions/custom-image-2'
import CustomImage from '../extensions/custom-image-3'
import ExternalVideo from '../extensions/external-video'

export default {
    components: {
        EditorContent,
        BubbleMenu
    },

    data() {
        return {
            editor: null
        }
    },

    mounted() {
        this.editor = new Editor({
            content: `
        <h1>Tiptap image example</h1>
        <p>Based on the Tiptap official examples for images and the bubble menu.</p>
        <p>Explained in a <a href="https://aboutweb.dev/blog">blog post here</a>.</p>
        <img src="https://source.unsplash.com/8xznAGy4HcY/800x400" />
        <p>This is a basic example of implementing images. Drag to re-order.</p>
        <img src="https://source.unsplash.com/K9QHL52rE2k/800x400" />
        `,
            extensions: [
                ...defaultExtensions(),
                Link,
                // You can just bring CustomImage in
                // here, but it's a good example of
                // adding a default class
                CustomImage.configure({
                    HTMLAttributes: {
                        class: 'custom-image'
                    }
                }),
                ExternalVideo
            ]
        })
    },

    beforeUnmount() {
        this.editor.destroy()
    },

    methods: {
        addVideo() {
            const url = window.prompt(
                'Video URL',
                'https://www.youtube.com/embed/iyd8dY8rRtA'
            )

            if (url) {
                this.editor.chain().focus().setExternalVideo({ src: url }).run()
            }
        },
        addImage() {
            const url = window.prompt(
                'Image URL',
                // Using picsum.photo/id/... and NOT
                // picsum.photos/w/h or the image will
                // change when we change the size and
                // tiptap redraws
                `https://picsum.photos/id/${
                    Math.floor(Math.random() * 200) + 1
                }/200/300`
            )

            if (url) {
                this.editor.chain().focus().setImage({ src: url }).run()
            }
        }
    }
}
</script>

<style lang="scss">
.frame {
    max-width: 900px;
    background: white;
    margin: 0 auto;
}
.controls {
    padding: 10px;
    border-bottom: 3px solid #eee;
    display: flex;
    width: 100%;
    align-items: center;
    button {
        background: none;
        font-weight: bold;
        width: 36px;
        height: 36px;
        display: flex;
        justify-content: center;
        margin-right: 4px;
        align-items: center;
        color: #0d0d0d;
        padding: 7px;
        border: 1px solid #ccc;
        &.is-active {
            background: #ddd;
        }
    }
}
.video-wrapper { 
    position: relative; padding-bottom: 56.25%; padding-top: 10px; height: 0; overflow: hidden; 
}
.video-wrapper iframe { 
    position: absolute; top: 0; left: 0; width: 100%; height: 100%; 
}
.ProseMirror {
    &:focus,
    &:active {
        outline: none;
    }

    > * + * {
        margin-top: 0.75em;
    }

    img {
        width: 100%;
        height: auto;
        display: block;
        margin-left: auto;
        margin-right: auto;

        &.ProseMirror-selectednode {
            outline: 3px solid #68cef8;
        }
    }
    .custom-image-small {
        max-width: 200px;
    }
    .custom-image-medium {
        max-width: 500px;
    }
    .custom-image-large {
        max-width: 100%;
    }
}

.bubble-menu {
    display: flex;
    background-color: #0d0d0d;
    padding: 0.2rem;
    border-radius: 0.5rem;

    button {
        border: none;
        background: none;
        color: #fff;
        font-size: 0.85rem;
        font-weight: 500;
        padding: 0 0.2rem;
        opacity: 0.6;

        &:hover,
        &.is-active {
            opacity: 1;
        }
        &.is-active {
            text-decoration: underline;
        }
    }
}
</style>
