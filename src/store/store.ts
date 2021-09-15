import { configureStore, EnhancedStore } from '@reduxjs/toolkit'
import brushReducer from '../slices/brushSlice';
import colorReducer from '../slices/colorSlice';
import imageSlice from '../slices/imageSlice';
import pixelGridReducer from '../slices/pixelGridSlice';
import serverReducer from '../slices/serverSlice';

const store: EnhancedStore = configureStore({
    reducer: {
        color: colorReducer,
        grid: pixelGridReducer,
		brush: brushReducer,
		server: serverReducer,
		image: imageSlice
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
