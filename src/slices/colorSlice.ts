import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'

interface ColorState {
    color: string
}

const initialState: ColorState = {
    color: '#000000'
}

export const colorSlice = createSlice({
    name: 'color', 
    initialState,
    reducers: {
        setColor: (state, action: PayloadAction<string>) => {
            state.color = action.payload;
        }
    }
})

export const { setColor } = colorSlice.actions
export const getColor = (state: RootState) => state.color;
export default colorSlice.reducer
