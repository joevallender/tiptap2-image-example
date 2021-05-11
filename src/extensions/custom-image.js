import Image from '@tiptap/extension-image'
import { mergeAttributes } from '@tiptap/core'

export default Image.extend({
    name: 'custom-image',

    defaultOptions: {
        ...Image.options,
        sizes: ['small', 'medium', 'large']
    },

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
            // This is unchanged from the original
            // Image setImage function
            // However, if I extended addComands in
            // the same way as addAttributes `this`
            // seemed to lose context, so I've just
            // copied it in here directly
            setImage: (options) => ({ tr, dispatch }) => {
                const { selection } = tr
                const node = this.type.create(options)

                if (dispatch) {
                    tr.replaceRangeWith(selection.from, selection.to, node)
                }

                return true
            },
            setSize: (attributes) => ({ tr, dispatch }) => {
                // Check it's a valid size option
                if (!this.options.sizes.includes(attributes.size)) {
                    return false
                }

                const { selection } = tr

                // We're calling, for example:
                //
                // editor
                //   .chain()
                //   .focus()
                //   .setSize({ size: 'small' })
                //   .run()
                //
                // from the bubble menu
                // so `attributes` is { size: 'small' }
                // which will add/overwrite the current
                // `selection.node.attrs` attributes
                // including, importantly, `src` :)

                const options = {
                    ...selection.node.attrs,
                    ...attributes
                }

                const node = this.type.create(options)

                if (dispatch) {
                    tr.replaceRangeWith(selection.from, selection.to, node)
                }
            }
        }
    },

    renderHTML({ node, HTMLAttributes }) {
        // When we render the HTML, grab the
        // size and add an appropriate
        // corresponding class

        const size = node.attrs.size
        HTMLAttributes.class = ' custom-image-' + size

        return [
            'img',
            mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)
        ]
    }
})
