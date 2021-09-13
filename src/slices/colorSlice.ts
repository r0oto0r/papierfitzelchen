import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Color, createColor } from 'material-ui-color';
import type { RootState } from '../store'

interface ColorState {
    color: Color,
	colorHistory: any
}

const initialState: ColorState = {
    color: createColor('#000000'),
	colorHistory: {}
}

export const colorSlice = createSlice({
    name: 'color', 
    initialState,
    reducers: {
        setColor: (state, action: PayloadAction<Color>) => {
            state.color = action.payload;
        },
		pushColorHistory: (state, action: PayloadAction<Color>) => {
			state.colorHistory[0] = '#' + action.payload.hex;
		}
    }
})

export const { setColor, pushColorHistory } = colorSlice.actions
export const getColor = (state: RootState) => state.color;
export default colorSlice.reducer
