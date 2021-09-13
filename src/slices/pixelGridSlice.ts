import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios';
import { socketClient } from '..';
import type { RootState } from '../store'

export interface PixelData { x:number, y:number, r: number; g: number; b: number };
export type PixelDataGrid = Array<Array<PixelData>>;

interface PixelGridState {
    grid: PixelDataGrid;
    live: boolean;
};

const initialPixelDataGrid: Array<Array<PixelData>> = Array<Array<PixelData>>(64);
for(let i = 0; i < initialPixelDataGrid.length; ++i) {
    initialPixelDataGrid[i] = new Array<PixelData>(64);
    for(let j = 0; j < initialPixelDataGrid[i].length; ++j) {
        initialPixelDataGrid[i][j] = {
            x: j,
            y: i,
            r: 0,
            g: 0,
            b: 0
        } as PixelData
    }
}

const initialState: PixelGridState = { 
    grid: initialPixelDataGrid,
    live: false
};

export const pixelGridSlice = createSlice({
    name: 'pixelGrid', 
    initialState,
    reducers: {
        setPixels: (state, action: PayloadAction<Array<PixelData>>) => {
            const pixelDataArray: Array<PixelData> = action.payload;
			for(const pixelData of pixelDataArray) {
				state.grid[pixelData.y][pixelData.x] = pixelData;
			}
            if(state.live) {
                socketClient.emit('/drawPixels', pixelDataArray);
                //axios.post("http://f1shp1.lan:4000/drawPixels", { pixels: pixelDataArray }).catch(error => console.error(error));
            }
        },
        setLive: (state, action: PayloadAction<boolean>) => {
            state.live = action.payload;
        },
        resetGrid: (state) => {
            state.grid = Array<Array<PixelData>>(64);
            for(let i = 0; i < state.grid.length; ++i) {
                state.grid[i] = new Array<PixelData>(64);
                for(let j = 0; j < state.grid[i].length; ++j) {
                    state.grid[i][j] = {
                        x: j,
                        y: i,
                        r: 0,
                        g: 0,
                        b: 0
                    } as PixelData
                }
            }
        }
    }
})

export const { setPixels, setLive, resetGrid } = pixelGridSlice.actions
export const getPixelGrid = (state: RootState) => state.pixelGrid;
export default pixelGridSlice.reducer
