import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store/store'
import { PixelDataGrid } from './pixelGridSlice';

export interface PixelImage {
	name: string;
	imageData: PixelDataGrid;
	preview: string;
}

interface PixelImageState {
	pixelImages: Array<PixelImage>;
};

const initialState: PixelImageState = {
	pixelImages: new Array<PixelImage>()
};

export const pixelImagelice = createSlice({
    name: 'pixelImage', 
    initialState,
    reducers: {
		addPixelImage: (state, action: PayloadAction<PixelImage>) => {
            state.pixelImages = [
				action.payload,
				...state.pixelImages
			];
		},
		setPixelImages: (state, action: PayloadAction<Array<PixelImage>>) => {
            state.pixelImages = action.payload;
		}
    }
});

export const { addPixelImage, setPixelImages } = pixelImagelice.actions
export const getPixelImage = (state: RootState) => state.pixelImage;
export default pixelImagelice.reducer
