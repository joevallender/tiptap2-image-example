import Image from '@tiptap/extension-image'
import { mergeAttributes } from '@tiptap/core'

export default Image.extend({
    name: 'custom-image',

    addAttributes() {
        return {
            ...Image.config.addAttributes(),
            size: {
                default: 'small',
                rendered: false
            }
        }
    },

    addCommands() {
        return {
            setImage: (options) => ({ commands }) => {
                return commands.insertContent({
                    type: this.name,
                    attrs: options
                })
            },
            setSize: (options) => ({ tr, commands }) => {
                return commands.insertContent({
                    type: this.name,
                    attrs: {
                        ...tr.selection.node.attrs,
                        ...options
                    }
                })
            }
        }
    },

    renderHTML({ node, HTMLAttributes }) {
        const size = node.attrs.size
        HTMLAttributes.class = ' custom-image-' + size

        return [
            'img',
            mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)
        ]
    }
})
