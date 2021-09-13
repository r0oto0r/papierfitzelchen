import { Button, ButtonGroup } from "@material-ui/core";
import axios from "axios";
import { getPixelGrid, PixelData, PixelDataGrid, setPixel, resetGrid } from "../slices/pixelGridSlice";
import { useAppDispatch, useAppSelector } from '../hooks'
import React, { useEffect, useRef } from "react";
import { getColor } from "../slices/colorSlice";
import convert from 'color-convert';

const enum BrushSize {
    small,
    middle,
    big
}

interface Box {
    x: number;
    y: number;
    width: number;
    height: number;
}

const GRID_COLOR = '#C2C2C2';
const WHITE = '#FFFFFF';
let mouseDown = false;
let pixelUnderMouse: PixelData | undefined;
let brushSize: BrushSize = BrushSize.small;

function PixelGrid(props: any): JSX.Element {
    const dispatch = useAppDispatch();
	const grid: PixelDataGrid = useAppSelector((state) => getPixelGrid(state));
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const hexColorFromStore = useAppSelector((state) => getColor(state)).color;

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
        return  Math.abs(a.x + (a.x + a.width) - b.x - b.x + b.width) <= a.x + a.width - a.x + b.x + b.width - b.x &&
                Math.abs(a.y + a.y + a.height - b.y - b.y + b.height) <= a.y - a.y + a.height + b.y - b.y + b.height
    }

    function mouseOverPixel(event: React.MouseEvent<HTMLCanvasElement, MouseEvent>): boolean {
        const canvas = canvasRef.current;
        if(!canvas) {
            return false;
        }
        const context = canvas?.getContext('2d');
        const rect = canvas.getBoundingClientRect();
        let brushBoxX = event.clientX - rect.left;
        let brushBoxY = event.clientY - rect.top;
        let brushBoxWidth = 2;
        let brushBoxHeight = 2;
        switch(brushSize) {
            case BrushSize.middle:
                brushBoxX = brushBoxX - 9;
                brushBoxY = brushBoxY - 9;
                brushBoxWidth = 18;
                brushBoxHeight = 18;
                break;
            case BrushSize.big:
                brushBoxX = brushBoxX - 19;
                brushBoxY = brushBoxY - 19;
                brushBoxWidth = 38;
                brushBoxHeight = 38;
                break;
            default:
                break;
        }
        let brushBox: Box = {
            x: brushBoxX,
            y: brushBoxY,
            width: brushBoxWidth,
            height: brushBoxHeight
        };

        let pixelHit = false
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
                console.log(doBoxesIntersect)
                if(doBoxesIntersect && !pixelUnderMouse) {
                    pixelUnderMouse = grid[i][j];
                    console.log(pixelUnderMouse)
                    if(context) {
                        context.globalAlpha = 0.5;
                        context.fillStyle = WHITE;
                        context.fillRect(currentPixelX, currentPixelY, 8, 8);
                        context.globalAlpha = 1.0;
                    }
                    pixelHit = true;
                } else {
                    if(context && pixelUnderMouse) {
                        const { r, g, b } = pixelUnderMouse;
                        const hexColor = '#' + convert.rgb.hex([r, g, b]);
                        context.fillStyle = hexColor;
                        context.fillRect(currentPixelX, currentPixelY, 8, 8);
                    }
                    pixelUnderMouse = undefined;
                }
            }
        }

        return pixelHit;
    }

    function colorPixelUnderMouse() {
        if(pixelUnderMouse) {
            const { x, y } = pixelUnderMouse;
            const { r: currentR, g: currentG, b: currentB } = grid[y][x];
            const [ r, g, b ] = convert.hex.rgb(hexColorFromStore);
            if(r !== currentR && g !== currentG && b !== currentB) {
                const pixelData: PixelData = { x, y, r, g, b};
                dispatch(setPixel(pixelData));
            }
        }
    }

    function handleMouseDown() {
        mouseDown = true;
        if(pixelUnderMouse) {
            colorPixelUnderMouse();
        }
    }

    function handleMouseUp() {
        mouseDown = false;
    }

    function handleMouseMove(event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) {
        const pixelHit = mouseOverPixel(event);
        if(pixelHit) {
            if(mouseDown && pixelUnderMouse) {
                colorPixelUnderMouse()
            }
        } else {
            pixelUnderMouse = undefined;
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
        <div>
            <canvas 
                width={(64 * 10) + 2}
                height={(64 * 10) + 2}
                ref={canvasRef}
                onMouseDown={() => handleMouseDown()}
                onMouseUp={() => handleMouseUp()}
                onMouseMove={(event) => handleMouseMove(event)}
                {...props}
            />
        </div>
        <ButtonGroup color="primary" variant="outlined" aria-label="outlined primary button group">
            <Button onClick={() => {
                axios.post("http://f1shp1.lan:4000/drawPixelGrid", { pixelGrid: grid }).catch(error => console.error(error));
            }}>Send</Button>
            <Button onClick={() => {
                axios.get("http://f1shp1.lan:4000/clear").catch(error => console.error(error));
                dispatch(resetGrid());
            }}>Clear</Button>
        </ButtonGroup>
    </React.Fragment>
}

export default PixelGrid;
