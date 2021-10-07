import { createSlice } from '@reduxjs/toolkit'
import type { RootState } from '../store/store'

interface GeneralState {
}

const initialState: GeneralState = {
};

export const serverSlice = createSlice({
    name: 'general', 
    initialState,
    reducers: {
    }
});

export const getGeneral = (state: RootState) => state.general;
export default serverSlice.reducer;
