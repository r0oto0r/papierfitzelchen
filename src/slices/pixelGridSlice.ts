import { createSlice, PayloadAction } from '@reduxjs/toolkit'
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
        setPixel: (state, action: PayloadAction<PixelData>) => {
            const pixelData: PixelData = action.payload;
            state.value[pixelData.y][pixelData.x] = pixelData;
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

export const { setPixel, resetGrid } = pixelGridSlice.actions
export const getPixelGrid = (state: RootState) => state.pixelGrid.value;
export default pixelGridSlice.reducer
