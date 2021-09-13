import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'

export const BRUSH_MIN: number = 1;
export const BRUSH_MAX: number = 200;

export enum ToolType {
	brush = 'brush',
	eraser = 'eraser'
}

interface BrushState {
    size: number
	toolType: ToolType
}

const initialState: BrushState = {
    size: 1,
	toolType: ToolType.brush
}

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
        }
    }
})

export const { setBrushSize, setToolType } = brushSlice.actions
export const getBrush = (state: RootState) => state.brush;
export default brushSlice.reducer
