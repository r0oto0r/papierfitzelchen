import { Button, ButtonGroup, Grid, Slider, ToggleButton, ToggleButtonGroup } from "@mui/material";
import React from "react";
import { SocketClient } from "../socket/SocketClient";
import { useAppSelector, useAppDispatch } from '../hooks/general'
import { getPixelGrid, resetGrid } from "../slices/pixelGridSlice";
import { Color, ColorPicker } from "material-ui-color";
import BrushIcon from '@mui/icons-material/Brush';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import { v4 } from "uuid";
import { BrushShape, BRUSH_MAX, BRUSH_MIN, getBrush, setBrushShape, setBrushSize, setToolType, ToolType } from "../slices/brushSlice";
import { BRIGHTNESS_MAX, BRIGHTNESS_MIN, getColor, setBrightness, setColor } from "../slices/colorSlice";
import { mainCanvasRef } from "./PixelGrid";
import { Pixelator } from "../tools/Pixelator";
import ImageDrop from "./ImageDrop";
import { addPixelImage, PixelImage } from "../slices/pixelImageSlice";

function ToolPanel(): JSX.Element {
	const { color, colorHistory, brightness } = useAppSelector((state) => getColor(state));
	const { size: brushSize, toolType, shape } = useAppSelector((state) => getBrush(state));
	const { grid } = useAppSelector((state: any) => getPixelGrid(state));
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

	const saveImage = () => {
		const canvas = mainCanvasRef.current;
		if(!canvas) return;
		const pixelImage: PixelImage = {
			uuid: v4(),
			name: 'TEST',
			imageData: grid,
			preview: canvas.toDataURL('image/jpeg')
		};
		SocketClient.emit('savePixelImage', pixelImage);
		dispatch(addPixelImage(pixelImage));
	}

	return <React.Fragment>
		<Grid container>
			<Grid item xs={3} style={{textAlign: 'left'}}>
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
				<Grid item xs={3} style={{textAlign: 'left'}}>
					Brushsize:
				</Grid>
				<Grid item xs={6}>
					<Slider
						value={brushSize}
						onChange={handleBrushSizeChange}
						step={1}
						min={BRUSH_MIN}
						max={BRUSH_MAX}
						valueLabelDisplay="auto"
					/>
				</Grid>
				<Grid item xs={3}/>
			</Grid>
			<Grid container>
				<Grid item xs={3} style={{textAlign: 'left'}}>
					Brightness:
				</Grid>
				<Grid item xs={6}>
					<Slider
						value={brightness}
						onChange={handleBrightnessChange}
						step={1}
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
				<Grid item xs={9}>
					<ImageDrop />
				</Grid>
				<Grid item xs={3}/>
			</Grid>
			<Grid container>
				<Grid item xs={9}>
					<Button variant="contained" onClick={() =>
						Pixelator.pixelate()
					}>Pixelate</Button>
				</Grid>
				<Grid item xs={3}/>
			</Grid>
			<br />
			<br />
			<Grid container>
				<Grid item xs={9}>
					<ButtonGroup variant="contained" aria-label="contained primary button group">
						<Button color="primary" onClick={() => {
							SocketClient.emit('drawPixelGrid', grid);
						}}>Send</Button>
						<Button color="secondary" onClick={() => 
							saveImage()
						}>Save</Button>
						<Button onClick={() => {
							SocketClient.emit('clear');
							dispatch(resetGrid());
						}}>Clear</Button>
					</ButtonGroup>
				</Grid>
				<Grid item xs={3}/>
			</Grid>
	</React.Fragment>
}

export default ToolPanel;
