import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store/store'

export interface PixelData { x:number, y:number, r: number; g: number; b: number };
export type PixelDataGrid = Array<Array<PixelData>>;

interface PixelGridState {
    grid: PixelDataGrid;
    live: boolean;
};

function createInitialPixelDataGrid() {
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

	return initialPixelDataGrid;
}

const initialState: PixelGridState = {
    grid: createInitialPixelDataGrid(),
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
        },
        setLive: (state, action: PayloadAction<boolean>) => {
            state.live = action.payload;
        },
        resetGrid: (state) => {
            state.grid = createInitialPixelDataGrid();
        }
    }
});

export const { setPixels, setLive, resetGrid } = pixelGridSlice.actions
export const getPixelGrid = (state: RootState) => state.grid;
export default pixelGridSlice.reducer
