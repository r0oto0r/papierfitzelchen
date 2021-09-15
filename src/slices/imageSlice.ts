import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store/store'

interface ImageState {
    imageData?: string | ArrayBuffer | null;
}

const initialState: ImageState = {
    imageData: undefined
};

export const imageSlice = createSlice({
    name: 'image', 
    initialState,
    reducers: {
        setImageData: (state, action: PayloadAction<string | ArrayBuffer | null>) => {
            state.imageData = action.payload;
        },
		removeImageData: (state) => {
			state.imageData = null;
		}
    }
});

export const { setImageData, removeImageData } = imageSlice.actions;
export const getImage = (state: RootState) => state.image;
export default imageSlice.reducer;
