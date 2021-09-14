import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store/store'

interface ServerState {
    address: string;
}

const initialState: ServerState = {
    address: 'http://f1shp1.lan:5000'
}

export const serverSlice = createSlice({
    name: 'server', 
    initialState,
    reducers: {
		setServerAddress: (state, action: PayloadAction<string>) => {
            state.address = action.payload;
        }
    }
})

export const { setServerAddress } = serverSlice.actions
export const getServerAddress = (state: RootState) => state.server;
export default serverSlice.reducer
