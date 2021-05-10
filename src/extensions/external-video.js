import { Node, mergeAttributes } from '@tiptap/core'

export default Node.create({
    name: 'external-video',
  
    defaultOptions: {
      inline: false,
      HTMLAttributes: {},
    },
  
    inline() {
      return this.options.inline
    },
  
    group() {
      return this.options.inline ? 'inline' : 'block'
    },
  
    draggable: true,
  
    addAttributes() {
      return {
        src: {
          default: null,
        },
        title: {
          default: null,
        },
        frameborder: {
          default: '0',
        },
        allow: {
            default: 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
        },
        allowfullscreen: {
            default: 'allowfullscreen'
        }
      }
    },
  
    parseHTML() {
      return [
        {
          tag: 'iframe[src]',
        },
      ]
    },
  
    renderHTML({ HTMLAttributes }) {
      return ['div', {class: 'video-wrapper'}, ['iframe', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0]]
      
    },
    addCommands() {
      return {
        setExternalVideo: options => ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: options,
          })
        },
      }
    },

})