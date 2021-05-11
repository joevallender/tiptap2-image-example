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
            setImage: (options) => ({ tr, commands }) => {
                if(tr.selection?.node?.type?.name == 'custom-image') {
                    return commands.updateAttributes('custom-image', options)
                }
                else {
                    return commands.insertContent({
                        type: this.name,
                        attrs: options
                    })
                }
            },
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



