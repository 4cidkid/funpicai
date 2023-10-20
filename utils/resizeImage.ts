import { createCanvas, loadImage } from "canvas";

async function resizeImage(file: File, width: number, height: number): Promise<Buffer> {
    return new Promise(async (resolve, reject) => {


        const canvas = createCanvas(width, height);
        const ctx = canvas.getContext('2d');

        try {
            const image = await loadImage(Buffer.from(await file.arrayBuffer()));

            ctx.drawImage(image, 0, 0, width, height);

            const arrayBuffer = canvas.toBuffer();
            resolve(arrayBuffer);
        } catch (error) {
            reject(error);
        }
    });
}

export default resizeImage;