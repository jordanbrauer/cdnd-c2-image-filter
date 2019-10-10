import fs from 'fs'
import Jimp from 'jimp'

/**
 * Helper function to download, filter, and save the filtered image locally.
 * 
 * @param {string} url A publicly accessible url to an image file
 * @returns {string} A promise of a string containing the absolute path to the local image
 */
export async function filterImageFromURL(url: string): Promise<string> {
    return new Promise(async (resolve) => {
        const image = await Jimp.read(url)
        const path = `tmp/filtered.${Math.floor(Math.random() * Date.now())}.jpg`
        const fqpn = `${__dirname}/${path}`
        
        image.resize(256, 256)
            .quality(60)
            .greyscale()
            .write(fqpn, (img) => resolve(fqpn))
    });
}

/**
 * Helper function to delete files on the local disk. Useful to cleanup after
 * tasks.
 *
 * @param {string[]} files An array of absolute paths to files
 * @returns {void}
 */
export async function deleteLocalFiles(files: Array<string>): Promise<void> {
    for (let file of files) {
        fs.unlinkSync(file);
    }
}