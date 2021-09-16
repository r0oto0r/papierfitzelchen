import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Color, createColor } from 'material-ui-color';
import type { RootState } from '../store/store'

export const BRIGHTNESS_MIN: number = 1;
export const BRIGHTNESS_MAX: number = 100;

interface ColorState {
    color: Color,
	colorHistory: any,
	brightness: number
}

const initialState: ColorState = {
    color: createColor('#000000'),
	colorHistory: {},
	brightness: 100
};

export const colorSlice = createSlice({
    name: 'color', 
    initialState,
    reducers: {
        setColor: (state, action: PayloadAction<Color>) => {
            state.color = action.payload;
        },
		pushColorHistory: (state, action: PayloadAction<Color>) => {
			state.colorHistory['#' + action.payload.hex] = '#' + action.payload.hex;
		},
		setBrightness: (state, action: PayloadAction<number>) => {
            state.brightness = action.payload;
        },
    }
});

export const { setColor, pushColorHistory, setBrightness } = colorSlice.actions;
export const getColor = (state: RootState) => state.color;
export default colorSlice.reducer;
