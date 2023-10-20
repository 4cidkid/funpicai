import { createCanvas, loadImage } from "canvas"

const processImage = async (imageBuffer:Buffer) => {
  const image = await loadImage(imageBuffer);

  const canvas = createCanvas(image.width, image.height);
  const ctx = canvas.getContext('2d');

  ctx.drawImage(image, 0, 0, image.width, image.height);

  const imageData = ctx.getImageData(0, 0, image.width, image.height);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {


    if (data[i] > 200 && data[i + 1] < 100 && data[i + 2] < 100) {
      data[i + 3] = 0;
    } else {
      data[i] = 0;   
      data[i + 1] = 0; 
      data[i + 2] = 255; 
      data[i + 3] = 255; 
    }

  }

  ctx.putImageData(imageData, 0, 0);

  const processedImageBuffer = canvas.toBuffer('image/png');
  const blob = new Blob([processedImageBuffer], { type: 'image/png' });
  return blob;
};
export default processImage;