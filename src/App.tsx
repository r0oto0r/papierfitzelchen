import './App.css';
import PixelGrid from './components/PixelGrid';
import { Grid } from '@material-ui/core';
import ColorPicker from 'material-ui-color-picker';
import { useAppSelector, useAppDispatch } from './hooks'
import { setColor } from './colorSlice'

function App(): JSX.Element {
    const count = useAppSelector((state) => state.color);
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
                    // value={this.state.color} - for controlled component
                    onChange={color => { 
                        setColor(color);
                    }}
                />
</Grid>
            </Grid>
		</div>
	);
}

export default App;
