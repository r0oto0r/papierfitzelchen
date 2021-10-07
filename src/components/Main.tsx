import React from "react";
import PixelGrid from './PixelGrid';
import { Grid } from '@mui/material';
import PixelImageGallery from './PixelImageGallery';
import SocketSettings from "./SocketSettings";
import ToolPanel from "./ToolPanel";

function Main(): JSX.Element {
	return <React.Fragment>
		<Grid container>
			<Grid item xs={3}>
				<SocketSettings />
			</Grid>
			<Grid item xs={6}>
				<PixelGrid />
			</Grid>
			<Grid item xs={3}>
				<ToolPanel />
			</Grid>
		</Grid>
		<br />
		<br />
		<br />
		<Grid container>
			<Grid item xs={12}>
				<PixelImageGallery />
			</Grid>
		</Grid>
	</React.Fragment>
}

export default Main;
