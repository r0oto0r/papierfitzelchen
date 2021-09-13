import { getPixelGrid, PixelData, PixelDataGrid, setPixels } from "../slices/pixelGridSlice";
import { useAppDispatch, useAppSelector } from '../hooks'
import React, { useEffect, useRef } from "react";
import { getColor, pushColorHistory } from "../slices/colorSlice";
import convert from 'color-convert';
import { getBrush, ToolType } from "../slices/brushSlice";

interface Box {
    x: number;
    y: number;
    width: number;
    height: number;
}

export const getPixelDataDiff = (fromDb: PixelData[], fromRequest:  PixelData[]): { toAdd: PixelData[], toDelete: PixelData[] } => {
	return {
		toAdd: fromRequest.filter(x => !fromDb.find(y => x.x === y.x && x.y === y.y)),
		toDelete: fromDb.filter(x => !fromRequest.find(y => x.y === y.y && x.x === y.x))
	}
};

const GRID_COLOR = '#C2C2C2';
const WHITE = '#FFFFFF';
let mouseDown = false;
let buttonType: number;
let pixelsUnderMouse: Array<PixelData> = new Array<PixelData>();
let lastPixelsUnderMouse: Array<PixelData> = new Array<PixelData>();

function PixelGrid(props: any): JSX.Element {
    const dispatch = useAppDispatch();
	const grid: PixelDataGrid = useAppSelector((state: any) => getPixelGrid(state));
	const { size: brushSize, toolType } = useAppSelector((state: any) => getBrush(state));
    const canvasRef = useRef<HTMLCanvasElement>(null);
	const canvasRef2 = useRef<HTMLCanvasElement>(null);

    const hexColorFromStore = useAppSelector((state: any) => getColor(state)).color;

    const draw = (context: CanvasRenderingContext2D) => {
        const canvas = canvasRef.current;
        context.fillStyle = GRID_COLOR;
        context.fillRect(0, 0, canvas ? canvas.width : 0, canvas ? canvas.height : 0);
        for(let i = 0; i < 64; ++i) {
            for(let j = 0; j < 64; ++j) {
                const { r, g, b } = grid[i][j];
                const hexColor = '#' + convert.rgb.hex([r, g, b]);
                const xPos = (j * 10) + 2;
                const yPos = (i * 10) + 2;
                context.fillStyle = hexColor;
                context.fillRect(xPos, yPos, 8, 8);
            }
        }
    }

    function boxesIntersect(a: Box, b: Box) {
        return	a.x < b.x + b.width &&
				a.x + a.width > b.x &&
				a.y < b.y + b.height &&
				a.y + a.height > b.y
    }

    function mouseOverPixel(event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) {
        const canvas = canvasRef2.current;
        if(!canvas) {
            return false;
        }
		const context = canvas?.getContext('2d');
        const rect = canvas.getBoundingClientRect();
        let brushBoxX = event.clientX - rect.left - brushSize / 2;
        let brushBoxY = event.clientY - rect.top - brushSize / 2;
        let brushBoxWidth = brushSize;
        let brushBoxHeight = brushSize;

        let brushBox: Box = {
            x: brushBoxX,
            y: brushBoxY,
            width: brushBoxWidth,
            height: brushBoxHeight
        };

		if(context) {
			context.clearRect(0, 0, rect.width, rect.height);
			context.globalAlpha = 0.5;
			context.fillStyle = WHITE;
			context.fillRect(brushBoxX, brushBoxY, brushBoxWidth, brushBoxHeight);
			context.globalAlpha = 0.0;
		}

		const currentpPixelUnderMouse: Array<PixelData> = new Array<PixelData>();

        for(let i = 0; i < 64; ++i) {
            for(let j = 0; j < 64; ++j) {
                const currentPixelX = (j * 10) + 2;
                const currentPixelY = (i * 10) + 2
                const pixelBox: Box = {
                    x: currentPixelX,
                    y: currentPixelY,
                    width: 8,
                    height: 8
                }

                const doBoxesIntersect = boxesIntersect(brushBox, pixelBox);
                if(doBoxesIntersect) {
                    currentpPixelUnderMouse.push(grid[i][j]);
                }
            }
        }

		lastPixelsUnderMouse = pixelsUnderMouse;
		pixelsUnderMouse = currentpPixelUnderMouse;
    }

    function colorPixelUnderMouse() {
		const pixels: Array<PixelData> = new Array<PixelData>();
		const [ r, g, b ] = hexColorFromStore.rgb;

		dispatch(pushColorHistory(hexColorFromStore));

        for(const pixelUnderMouse of pixelsUnderMouse) {
            const { x, y } = pixelUnderMouse;
            const { r: currentR, g: currentG, b: currentB } = grid[y][x];
            if(r !== currentR && g !== currentG && b !== currentB) {
                const pixelData: PixelData = { x, y, r, g, b};
                pixels.push(pixelData);
            }
        }

		dispatch(setPixels(pixels));
    }

	function clearPixelUnderMouse() {
		const pixels: Array<PixelData> = new Array<PixelData>();
		const [ r, g, b ] = convert.hex.rgb('#000000');

        for(const pixelUnderMouse of pixelsUnderMouse) {
            const { x, y } = pixelUnderMouse;
            const { r: currentR, g: currentG, b: currentB } = grid[y][x];
            if(r !== currentR && g !== currentG && b !== currentB) {
                const pixelData: PixelData = { x, y, r, g, b};
                pixels.push(pixelData);
            }
        }

		dispatch(setPixels(pixels));
    }

    function handleMouseDown(event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) {
		if(!mouseDown) {
			mouseDown = true;
			buttonType = event.buttons;
			if(pixelsUnderMouse.length > 0) {
				doPrimaryButtonAction();
			}
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
        mouseOverPixel(event);
		if(mouseDown && pixelsUnderMouse.length > 0) {
			const { toAdd, toDelete } = getPixelDataDiff(pixelsUnderMouse, lastPixelsUnderMouse);
			if(toAdd.length > 0 || toDelete.length > 0) {
				doPrimaryButtonAction();
			}
		}
    }

	function doPrimaryButtonAction() {
		if(buttonType === 1) {
			switch(toolType) {
				case ToolType.brush:
					colorPixelUnderMouse();
					break;
				case ToolType.eraser:
					clearPixelUnderMouse();
					break;
				default:
					break;
			}	
		}
	}

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas?.getContext('2d');

        if(context) {
            draw(context);
        }
    })

	return <React.Fragment>
		<div style={{position: 'relative'}}>
            <canvas
				style={{position: 'absolute', left: 0, top: 0, zIndex: 0, backgroundColor: 'transparent'}}
                width={(64 * 10) + 2}
                height={(64 * 10) + 2}
                ref={canvasRef}
                {...props}
            />
			<canvas
				style={{position: 'absolute', left: 0, top: 0, zIndex: 1, backgroundColor: 'transparent'}}
                width={(64 * 10) + 2}
                height={(64 * 10) + 2}
                ref={canvasRef2}
				onMouseDown={(event) => handleMouseDown(event)}
                onMouseUp={() => handleMouseUp()}
                onMouseMove={(event) => handleMouseMove(event)}
				onMouseEnter={(event) => handleMouseEnter(event)}
				onMouseLeave={() => handleMouseUp()}
                {...props}
            />
		</div>
	</React.Fragment>

}

export default PixelGrid;
