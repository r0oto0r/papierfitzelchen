import './App.css';
import PixelGrid from './components/PixelGrid';
import { Grid } from '@material-ui/core';
import ColorPicker from 'material-ui-color-picker';
import { useAppSelector, useAppDispatch } from './hooks'
import { setColor, getColor } from './slices/colorSlice'

function App(): JSX.Element {
    const color = useAppSelector((state) => getColor(state).color);
    const dispatch = useAppDispatch();
	return (
		<div className="App">
            <Grid container>
                <Grid item xs={4}/>
                <Grid item xs={4}>
                    <PixelGrid />
                </Grid>
                <Grid item xs={4}>
                    <ColorPicker
                        name='color'
                        defaultValue='#000000'
                        value={color}
                        onChange={color => {
                            dispatch(setColor(color));
                        }}
                    />
                </Grid>
            </Grid>
		</div>
	);
}

export default App;
