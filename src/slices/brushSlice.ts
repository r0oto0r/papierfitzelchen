import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store/store'

export const BRUSH_MIN: number = 1;
export const BRUSH_MAX: number = 200;

export enum ToolType {
	brush = 'brush',
	eraser = 'eraser'
}

export enum BrushShape {
	square = 'square',
	circle = 'circle'
}

interface BrushState {
    size: number;
	toolType: ToolType;
	shape: BrushShape;
}

const initialState: BrushState = {
    size: 10,
	toolType: ToolType.brush,
	shape: BrushShape.square
};

export const brushSlice = createSlice({
    name: 'brush', 
    initialState,
    reducers: {
        setBrushSize: (state, action: PayloadAction<number>) => {
			let value = action.payload;
			if(value < BRUSH_MIN) {
				value = BRUSH_MIN;
			}
			if(value > BRUSH_MAX) {
				value = BRUSH_MAX;
			}
            state.size = value;
        },
		setToolType: (state, action: PayloadAction<ToolType>) => {
            state.toolType = action.payload;
        },
		setBrushShape: (state, action: PayloadAction<BrushShape>) => {
            state.shape = action.payload;
        }
    }
});

export const { setBrushSize, setToolType, setBrushShape } = brushSlice.actions;
export const getBrush = (state: RootState) => state.brush;
export default brushSlice.reducer;
