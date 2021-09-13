import './App.css';
import PixelGrid from './components/PixelGrid';
import { Button, ButtonGroup, Grid, Slider } from '@material-ui/core';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import { Color, ColorPicker } from 'material-ui-color';
import { useAppSelector, useAppDispatch } from './hooks'
import { setColor, getColor } from './slices/colorSlice'
import axios from 'axios';
import { getPixelGrid, PixelDataGrid, resetGrid } from './slices/pixelGridSlice';
import { BRUSH_MAX, BRUSH_MIN, getBrush, setBrushSize, setToolType, ToolType } from './slices/brushSlice';
import { ToggleButton } from '@material-ui/lab';
import BrushIcon from '@material-ui/icons/Brush';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';

function App(): JSX.Element {
    const { color, colorHistory } = useAppSelector((state) => getColor(state));
	const { size: brushSize, toolType } = useAppSelector((state) => getBrush(state));
	const grid: PixelDataGrid = useAppSelector((state: any) => getPixelGrid(state));
    const dispatch = useAppDispatch();

	const handleSliderChange = (event: any, newValue: number | number[]) => {
		dispatch(setBrushSize(newValue as number));
	};

	const handleToolTypeChange = (event: React.MouseEvent<HTMLElement>, newToolType: ToolType) => {
		dispatch(setToolType(newToolType));
	};

	return (
		<div className="App">
            <Grid container>
                <Grid item xs={4}/>
                <Grid item xs={4}>
                    <PixelGrid />
                </Grid>
                <Grid item xs={4}>
					<Grid container>
						<Grid item xs={4}>
							Color:
							<ColorPicker
								value={color}
								defaultValue={color}
								palette={colorHistory}
								onChange={(color: Color) => {
									dispatch(setColor(color));
								}} />
						</Grid>
					</Grid>
					<Grid container>
						<Grid item xs={4}>
							Brushsize:
							<Slider
								value={brushSize}
								onChange={handleSliderChange}
								aria-labelledby="discrete-slider-small-steps"
								step={1}
								marks
								min={BRUSH_MIN}
								max={BRUSH_MAX}
								valueLabelDisplay="auto"
							/>
						</Grid>
					</Grid>
					<Grid container>
						<Grid item xs={4}>
						<ToggleButtonGroup
							value={toolType}
							exclusive
							onChange={handleToolTypeChange}
							aria-label="text alignment"
							>
								<ToggleButton value="brush">
									<BrushIcon />
								</ToggleButton>
								<ToggleButton value="eraser">
									<HighlightOffIcon />
								</ToggleButton>
							</ToggleButtonGroup>
						</Grid>
					</Grid>
					<br />
					<Grid container>
						<Grid item xs={4}>
							<ButtonGroup color="primary" variant="contained" aria-label="contained primary button group">
								<Button onClick={() => {
									axios.post("http://f1shp1.lan:4000/drawPixelGrid", { pixelGrid: grid }).catch(error => console.error(error));
								}}>Send</Button>
								<Button onClick={() => {
									axios.get("http://f1shp1.lan:4000/clear").catch(error => console.error(error));
									dispatch(resetGrid());
								}}>Clear</Button>
							</ButtonGroup>
						</Grid>
					</Grid>
                </Grid>
            </Grid>
		</div>
	);
}

export default App;
