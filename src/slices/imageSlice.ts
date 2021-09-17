import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store/store'

interface ImageState {
    imageData?: ArrayBuffer;
	posX: number;
	posY: number;
}

const initialState: ImageState = {
    imageData: undefined,
	posX: 0,
	posY: 0
};

export const imageSlice = createSlice({
    name: 'image', 
    initialState,
    reducers: {
        setImageData: (state, action: PayloadAction<ArrayBuffer>) => {
            state.imageData = action.payload;
        },
		removeImageData: (state) => {
			state.imageData = undefined;
		},
		setImagePos: (state, action: PayloadAction<{ x: number, y: number }>) => {
            state.posX = action.payload.x;
			state.posY = action.payload.y;
        }
    }
});

export const { setImageData, removeImageData } = imageSlice.actions;
export const getImage = (state: RootState) => state.image;
export default imageSlice.reducer;
