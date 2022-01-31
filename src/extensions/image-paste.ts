/* eslint-disable @typescript-eslint/naming-convention */
import {  Extension } from '@tiptap/core'
import {  Plugin,  PluginKey } from 'prosemirror-state'

export interface ImagePasteOptions {
    fileMatchRegex: RegExp
    disableImagePaste: boolean
    render?: () => {
        onImagePaste?: (files: File[]) => void
        onImageDrop?: (files: File[]) => void
        onDisabledImagePaste?: (text: string) => void
    }
}

const mapDataItems = (
    data: DataTransferItemList,
    fileMatchRegex: RegExp
): File[] => {
    const files: File[] = []
    Array.from(data).forEach((item) => {
        if (item.type.match(fileMatchRegex)) {
            const file = item.getAsFile()
            if (file) {
                files.push(file)
            }
        }
    })
    return files
    // return Array.from(data)
    //     .map((item) =>
    //         item.type.match(fileMatchRegex) ? item.getAsFile() : null
    //     )
    //     .filter((item) => item !== null)
}

const mapTextItems = async (data: DataTransferItemList): Promise<string> => {
    const fullSet = Array.from(data)
    const plainText = fullSet.find((item) => item.type === 'text/plain')
    const richText = fullSet.find((item) => item.type === 'text/html')
    return new Promise((resolve) => {
        ;(richText || plainText).getAsString((html) => {
            const value = html.replace(/<img[^>]*>/g, '')
            resolve(value)
        })
    })
}

export const ImagePaste = Extension.create<ImagePasteOptions>({
    name: 'imagePaste',

    defaultOptions: {
        fileMatchRegex: /^image\/(gif|jpe?g|a?png|svg|webp|bmp)/i,
        disableImagePaste: false
    },

    addProseMirrorPlugins() {
        const options = this.options
        const renderer = this.options.render?.()

        return [
            new Plugin({
                key: new PluginKey('imagePasteHandler'),
                props: {
                    handlePaste(_view, event) {
                        if (
                            options.disableImagePaste &&
                            renderer?.onDisabledImagePaste &&
                            event.clipboardData
                        ) {
                            mapTextItems(event.clipboardData.items).then(
                                (value) => {
                                    if (value && renderer) {
                                        renderer.onDisabledImagePaste(value)
                                    }
                                }
                            )

                            return true
                        }

                        if (
                            !options.disableImagePaste &&
                            renderer?.onImagePaste &&
                            event.clipboardData?.items?.length
                        ) {
                            const files = mapDataItems(
                                event.clipboardData.items,
                                options.fileMatchRegex
                            )

                            if (files?.length) {
                                renderer.onImagePaste(files)

                                return true
                            }
                        }
                        return false
                    },

                    handleDrop(_view, event: DragEvent) {
                        if (
                            !options.disableImagePaste &&
                            event.dataTransfer?.files?.length &&
                            renderer?.onImageDrop
                        ) {
                            const files = mapDataItems(
                                event.dataTransfer.items,
                                options.fileMatchRegex
                            )

                            if (files?.length) {
                                renderer.onImageDrop(files)

                                return true
                            }
                        }

                        return false
                    }
                }
            })
        ]
    }
})
