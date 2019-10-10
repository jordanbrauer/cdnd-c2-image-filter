import fs, { ReadStream } from 'fs'
import Jimp from 'jimp'

/**
 * Helper function to download, filter, and save the filtered image locally.
 * 
 * @param {URL} url A publicly accessible url to an image file
 * @returns {ReadStream} A promise of a string containing the absolute path to the local image
 */
export async function filterImageFromURL(url: URL): Promise<ReadStream> {
    return new Promise(async (resolve, reject) => {
        const image: any = await Jimp.read(url.href).catch((error) => reject(`${error}`))
        
        if (undefined === image) {
            return
        }

        const ext = url.pathname.split('.').pop();
        const path = `tmp/filtered.${Math.floor(Math.random() * Date.now())}.${ext}`
        const fqpn = `${__dirname}/${path}`
        
        image.resize(256, 256)
            .quality(60)
            .greyscale()
            .write(fqpn, (img: any): void => {
                const stream = fs.createReadStream(fqpn).once('close', () => {
                    stream.destroy()
                    deleteLocalFiles([fqpn])
                })

                resolve(stream)
            })
    });
}

/**
 * Helper function to delete files on the local disk. Useful to cleanup after
 * tasks.
 *
 * @param {String[]} files An array of absolute paths to files
 * @returns {void}
 */
export async function deleteLocalFiles(files: Array<string>): Promise<void> {
    for (let file of files) {
        fs.unlinkSync(file);
    }
}