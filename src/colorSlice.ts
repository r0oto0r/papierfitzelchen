import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from './store'

// Define a type for the slice state
interface ColorState {
    color: string
}
// Define the initial state using that type
const initialState: ColorState = {
    color: '#000000'
}

export const colorSlice = createSlice({
    name: 'color',  // `createSlice` will infer the state type from the `initialState` argument
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
