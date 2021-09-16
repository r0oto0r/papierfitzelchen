import { PixelData, setPixels } from '../slices/pixelGridSlice';
import store, { RootState } from '../store/store';
import Jimp from 'jimp';
import { Box, boxesIntersect } from './Collision';
import { mainCanvasRef } from '../components/PixelGrid';
import { SocketClient } from '../socket/SocketClient';

export class Pixelator {
	private constructor() {}

	public static async pixelate() {
		const { imageData, posX, posY } = (store.getState() as RootState).image;
		const { live } = (store.getState() as RootState).grid;
		const pixels: Array<PixelData> = new Array<PixelData>();
		const canvas = mainCanvasRef.current;
		if(!canvas) return;
        const context = canvas?.getContext('2d');
		if(!context) return;
		const rect = canvas.getBoundingClientRect();
		const jimpImage = await Jimp.read(imageData);
		if(jimpImage.getHeight() >= jimpImage.getWidth()) {
			jimpImage.resize(Math.floor((rect.width / jimpImage.getWidth()) * jimpImage.getWidth()), rect.height);
		} else {
			jimpImage.resize(rect.width, Math.floor((rect.height / jimpImage.getHeight()) * jimpImage.getHeight()));
		}
		const pixelatedImage = jimpImage.pixelate(10, 0, 0, 640, 640);

		const canvasImageData = new ImageData(
			Uint8ClampedArray.from(pixelatedImage.bitmap.data),
			pixelatedImage.bitmap.width,
			pixelatedImage.bitmap.height
		);

		const imageBox: Box = {
			x: posX,
			y: posY,
			width: pixelatedImage.bitmap.width,
			height: pixelatedImage.bitmap.height
		};

		const pixelGridBox: Box = {
			x: rect.left,
			y: rect.top,
			width: rect.width,
			height: rect.height
		};

		const intersectionBox: Box = {
			x: Math.abs(imageBox.y - pixelGridBox.x),
			y: Math.abs(imageBox.x - pixelGridBox.x),
			width: Math.abs(imageBox.width - pixelGridBox.width),
			height: Math.abs(imageBox.height - pixelGridBox.height)
		};

		if(boxesIntersect(imageBox, pixelGridBox)) {
			console.log(intersectionBox)
			//context.clearRect(0, 0, rect.width, rect.height);
			//context.fillStyle = '#FFFFFF';
			//context.fillRect(intersectionBox.x, intersectionBox.y, intersectionBox.width, intersectionBox.height);
		}

		for(let i = 0; i < 64 && (i * 10 + 2) < canvasImageData.width; i++) {
			for(let j = 0; j < 64 && (j * 10 + 2) < canvasImageData.height; j++) {
				const { r, g, b } = Jimp.intToRGBA(pixelatedImage.getPixelColor((i * 10 + 2), (j * 10 + 2)));
				pixels.push({
					x: i,
					y: j,
					r,
					g,
					b
				})
			}
		}
		if(live && pixels?.length > 0) {
			SocketClient.emit('drawPixels', pixels);
		}
		store.dispatch(setPixels(pixels));
	}
}
