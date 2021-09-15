import { useRef } from "react";
import { useAppSelector } from "../hooks/general";
import useWindowDimensions from "../hooks/useWindowDimensions";
import { getImage } from "../slices/imageSlice";
import Jimp from 'jimp';

let mouseDown = false;
let oldMouseX = 0;
let oldMouseY = 0;
let oldImageX = 0;
let oldImageY = 0;

function ImagePreviewCanvas(props: any): JSX.Element {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const imageData = useAppSelector((state: any) => getImage(state)).imageData;
	const canvas = canvasRef.current;
	const rect = canvas?.getBoundingClientRect();
	const { height, width } = useWindowDimensions();
	const context = canvas?.getContext('2d');
	oldImageX = 0;
	oldImageY = 0;
	if(imageData) {
		var img = new Image();
		img.onload = function() {
			if(context) {
				context.clearRect(0, 0, rect ? rect.width : 0, rect ? rect.height : 0);
				context.drawImage(img, 0, 0);
			}
		};
		img.src = imageData;
	} else {
		if(context) {
			context.clearRect(0, 0, rect ? rect.width : 0, rect ? rect.height : 0);
		}
	}

	function handleMouseDown(event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) {
		mouseDown = true;
		if(rect) {
			const mouseX = event.clientX - rect.left;
			const mouseY = event.clientY - rect.top;
			oldMouseX = mouseX;
			oldMouseY = mouseY;
		}
    }

    function handleMouseUp() {
        mouseDown = false;
    }

	function handleMouseEnter(event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) {
		if(event.buttons === 1) {
			mouseDown = true;
		}
	}

    function handleMouseMove(event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) {
		if(!rect || !mouseDown) return;
		const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;
		const deltaX = mouseX - oldMouseX;
		const deltaY = mouseY - oldMouseY;
		const newImageX = oldImageX + deltaX;
		const newImageY = oldImageY + deltaY;
        if(imageData) {
			var img = new Image();
			img.onload = function() {
				if(context) {
					context.clearRect(0, 0, rect ? rect.width : 0, rect ? rect.height : 0);
					context.drawImage(img,  newImageX, newImageY);
				}
			};
			img.src = imageData;
		} else {
			if(context) {
				context.clearRect(0, 0, rect ? rect.width : 0, rect ? rect.height : 0);
			}
		}
		oldImageX = newImageX;
		oldImageY = newImageY;
		oldMouseX = mouseX;
		oldMouseY = mouseY;
    }

	return <canvas
		style={{position: 'absolute', left: 0, top: 0, zIndex: 0, backgroundColor: 'transparent'}}
		width={width}
		height={height}
		ref={canvasRef}
		onMouseDown={(event) => handleMouseDown(event)}
		onMouseUp={() => handleMouseUp()}
		onMouseMove={(event) => handleMouseMove(event)}
		onMouseEnter={(event) => handleMouseEnter(event)}
		onMouseLeave={() => handleMouseUp()}
		{...props}
	/>
}

export default ImagePreviewCanvas;
