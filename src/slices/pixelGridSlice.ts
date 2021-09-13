import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios';
import type { RootState } from '../store'

export interface PixelData { x:number, y:number, r: number; g: number; b: number };
export type PixelDataGrid = Array<Array<PixelData>>;

interface PixelGridState {
    value: PixelDataGrid
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

const initialState = { value: initialPixelDataGrid } as PixelGridState

export const pixelGridSlice = createSlice({
    name: 'pixelGrid', 
    initialState,
    reducers: {
        setPixels: (state, action: PayloadAction<Array<PixelData>>) => {
            const pixelDataArray: Array<PixelData> = action.payload;
			for(const pixelData of pixelDataArray) {
				state.value[pixelData.y][pixelData.x] = pixelData;
			}
			axios.post("http://f1shp1.lan:4000/drawPixels", { pixels: pixelDataArray }).catch(error => console.error(error));
        },
        resetGrid: (state) => {
            state.value = Array<Array<PixelData>>(64);
            for(let i = 0; i < state.value.length; ++i) {
                state.value[i] = new Array<PixelData>(64);
                for(let j = 0; j < state.value[i].length; ++j) {
                    state.value[i][j] = {
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

export const { setPixels, resetGrid } = pixelGridSlice.actions
export const getPixelGrid = (state: RootState) => state.pixelGrid.value;
export default pixelGridSlice.reducer
