import { Button, ButtonGroup } from "@material-ui/core";
import Pixel from "./Pixel";
import axios from "axios";
import { getPixelGrid, PixelData, PixelDataGrid, setPixel, resetGrid } from "../slices/pixelGridSlice";
import { useAppDispatch, useAppSelector } from '../hooks'
import React, { useEffect, useRef } from "react";
import { getColor } from "../slices/colorSlice";
import convert from 'color-convert';

const GRID_COLOR = '#C2C2C2';
const WHITE = '#FFFFFF';
let mouseDown = false;

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

    function handleMouseDown(event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) {
        mouseDown = true;
        const canvas = canvasRef.current;
        if(!canvas) {
            return;
        }
        const rect = canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;
        for(let i = 0; i < 64; ++i) {
            for(let j = 0; j < 64; ++j) {
                const xPosUpperLeft = (j * 10) + 2;
                const yPosUpperLeft = (i * 10) + 2;
                const xPosLowerRight = xPosUpperLeft + 8;
                const yPosLowerRight = yPosUpperLeft + 8;
                if(mouseX > xPosUpperLeft && mouseX < xPosLowerRight && mouseY > yPosUpperLeft && mouseY < yPosLowerRight) {
                    const { r: currentR, g: currentG, b: currentB } = grid[i][j];
                    const [ r, g, b ] = convert.hex.rgb(hexColorFromStore);
                    if(r !== currentR && g !== currentG && b !== currentB) {
                        const pixelData: PixelData = { x: j, y: i, r, g, b};
                        dispatch(setPixel(pixelData));
                    }
                }
            }
        }
    }

    function handleMouseUp() {
        mouseDown = false;
    }

    function handleMouseMove(event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) {
        if(mouseDown) {
            const canvas = canvasRef.current;
            if(!canvas) {
                return;
            }
            const rect = canvas.getBoundingClientRect();
            const mouseX = event.clientX - rect.left;
            const mouseY = event.clientY - rect.top;
            for(let i = 0; i < 64; ++i) {
                for(let j = 0; j < 64; ++j) {
                    const xPosUpperLeft = (j * 10) + 2;
                    const yPosUpperLeft = (i * 10) + 2;
                    const xPosLowerRight = xPosUpperLeft + 8;
                    const yPosLowerRight = yPosUpperLeft + 8;
                    if(mouseX > xPosUpperLeft && mouseX < xPosLowerRight && mouseY > yPosUpperLeft && mouseY < yPosLowerRight) {
                        const { r: currentR, g: currentG, b: currentB } = grid[i][j];
                        const [ r, g, b ] = convert.hex.rgb(hexColorFromStore);
                        if(r !== currentR && g !== currentG && b !== currentB) {
                            const pixelData: PixelData = { x: j, y: i, r, g, b};
                            dispatch(setPixel(pixelData));
                        }
                    }
                }
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
        <div>
            <canvas 
                width={(64 * 10) + 2}
                height={(64 * 10) + 2}
                ref={canvasRef}
                onMouseDown={(event) => handleMouseDown(event)}
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
