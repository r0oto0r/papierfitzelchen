import './App.css';
import PixelGrid from './components/PixelGrid';
import { Button, ButtonGroup, FormControlLabel, FormGroup, Grid, Slider, Switch, TextField } from '@material-ui/core';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import { Color, ColorPicker } from 'material-ui-color';
import { useAppSelector, useAppDispatch } from './hooks/general'
import { setColor, getColor, BRIGHTNESS_MIN, BRIGHTNESS_MAX, setBrightness } from './slices/colorSlice'
import { getPixelGrid, resetGrid, setLive } from './slices/pixelGridSlice';
import { BrushShape, BRUSH_MAX, BRUSH_MIN, getBrush, setBrushShape, setBrushSize, setToolType, ToolType } from './slices/brushSlice';
import { ToggleButton } from '@material-ui/lab';
import BrushIcon from '@material-ui/icons/Brush';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import { getServer, setServerAddress } from './slices/serverSlice';
import { SocketClient } from './socket/SocketClient';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import ImageDrop from './components/ImageDrop';
import { Pixelator } from './tools/Pixelator';

function App(): JSX.Element {
    const { color, colorHistory, brightness } = useAppSelector((state) => getColor(state));
	const { address, connected } = useAppSelector((state) => getServer(state));
	const { size: brushSize, toolType, shape } = useAppSelector((state) => getBrush(state));
	const { grid, live } = useAppSelector((state: any) => getPixelGrid(state));
    const dispatch = useAppDispatch();

	const handleBrushSizeChange = (event: any, newValue: number | number[]) => {
		dispatch(setBrushSize(newValue as number));
	};

	const handleBrightnessChange = (event: any, newValue: number | number[]) => {
		dispatch(setBrightness(newValue as number));
		SocketClient.emit('setBrightness', newValue);
	};

	const handleToolTypeChange = (event: React.MouseEvent<HTMLElement>, newToolType: ToolType) => {
        if(newToolType) {
            dispatch(setToolType(newToolType));
        }
	};

	const handleBrushShapeChange = (event: React.MouseEvent<HTMLElement>, newBrushShape: BrushShape) => {
        if(newBrushShape) {
            dispatch(setBrushShape(newBrushShape));
        }
	};

    const handleLiveToggleChange = (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
		dispatch(setLive(checked));
	};

	const handleServerAddressInputChange: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = (event) => {
		dispatch(setServerAddress(event.target.value));
	};

	return (
		<div className="App">
            <Grid container>
                <Grid item xs={4}>
					<Grid container>
						<Grid item xs={12}>
							Settings:
						</Grid>
					</Grid>
					<br />
					<Grid container>
						<Grid item xs={12}>
							<form noValidate autoComplete="off">
								<TextField size="small" id="outlined-basic" label="server address" variant="outlined" value={address} onChange={handleServerAddressInputChange} />
							</form>
							{connected ?
									<Button color="secondary" variant="contained" onClick={() => 
										SocketClient.disconnectFromServer()
									}>Disconnect</Button>
								:
									<Button color="primary" variant="contained" onClick={() => 
										SocketClient.connectToServer()
									}>Connect</Button>
								}
						</Grid>
                    </Grid>
					<br />
                    <Grid container>
						<Grid item xs={12}>
							<FormGroup >
								<FormControlLabel
									style={{justifyContent: 'center'}}
									control={<Switch checked={live} onChange={handleLiveToggleChange} />}
									label="Live"
								/>
							</FormGroup>
                        </Grid>
                    </Grid>
				</Grid>
                <Grid item xs={5}>
                    <PixelGrid />
                </Grid>
                <Grid item xs={3}>
					<Grid container>
						<Grid item xs={3}>
							Color:
						</Grid>
						<Grid item xs={3}>

							<ColorPicker
								value={color}
								defaultValue={color}
								palette={colorHistory}
								onChange={(color: Color) => {
									dispatch(setColor(color));
								}} />
						</Grid>
						<Grid item xs={3}/>
						<Grid item xs={3}/>
					</Grid>
					<Grid container>
						<Grid item xs={3}>
							Brushsize:
						</Grid>
						<Grid item xs={6}>
							<Slider
								value={brushSize}
								onChange={handleBrushSizeChange}
								step={1}
								marks
								min={BRUSH_MIN}
								max={BRUSH_MAX}
								valueLabelDisplay="auto"
							/>
						</Grid>
						<Grid item xs={3}/>
					</Grid>
					<Grid container>
						<Grid item xs={3}>
							Brightness:
						</Grid>
						<Grid item xs={6}>
							<Slider
								value={brightness}
								onChange={handleBrightnessChange}
								step={1}
								marks
								min={BRIGHTNESS_MIN}
								max={BRIGHTNESS_MAX}
								valueLabelDisplay="auto"
							/>
						</Grid>
						<Grid item xs={3}/>
					</Grid>
					<Grid container>
						<Grid item xs={9}>
							<ToggleButtonGroup value={toolType} exclusive onChange={handleToolTypeChange} >
								<ToggleButton value="brush">
									<BrushIcon />
								</ToggleButton>
								<ToggleButton value="eraser">
									<HighlightOffIcon />
								</ToggleButton>
							</ToggleButtonGroup>
						</Grid>
						<Grid item xs={3}/>
					</Grid>
					<Grid container>
						<Grid item xs={9}>
							<ToggleButtonGroup value={shape} exclusive onChange={handleBrushShapeChange} >
								<ToggleButton value="square">
									<CheckBoxOutlineBlankIcon />
								</ToggleButton>
								<ToggleButton value="circle">
									<RadioButtonUncheckedIcon />
								</ToggleButton>
							</ToggleButtonGroup>
						</Grid>
						<Grid item xs={3}/>
					</Grid>
					<br />
					<Grid container>
						<Grid item xs={6}>
							<ImageDrop />
						</Grid>
						<Grid item xs={3} >
							<Button variant="contained" onClick={() =>
								Pixelator.pixelate()
							}>Pixelate</Button>
						</Grid>
						<Grid item xs={3}/>
					</Grid>
					<br />
					<Grid container>
						<Grid item xs={9}>
							<ButtonGroup variant="contained" aria-label="contained primary button group">
								<Button color="primary" onClick={() => {
									SocketClient.emit('drawPixelGrid', grid);
								}}>Send</Button>
								<Button onClick={() => {
									SocketClient.emit('clear');
									dispatch(resetGrid());
								}}>Clear</Button>
							</ButtonGroup>
						</Grid>
						<Grid item xs={3}/>
					</Grid>
                </Grid>
            </Grid>
		</div>
	);
}

export default App;
