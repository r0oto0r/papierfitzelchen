import { Button, FormControlLabel, FormGroup, Grid, Switch, TextField } from "@mui/material";
import React from "react";
import { SocketClient } from "../socket/SocketClient";
import { useAppSelector, useAppDispatch } from '../hooks/general'
import { getServer, setServerAddress } from "../slices/serverSlice";
import { getPixelGrid, setLive } from "../slices/pixelGridSlice";

function SocketSettings(): JSX.Element {
	const { address, connected } = useAppSelector((state) => getServer(state));
	const { live } = useAppSelector((state: any) => getPixelGrid(state));
    const dispatch = useAppDispatch();

	const handleLiveToggleChange = (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
		dispatch(setLive(checked));
	};
	
	const handleServerAddressInputChange: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = (event) => {
		dispatch(setServerAddress(event.target.value));
	};

	return <React.Fragment>
			<Grid container>
				<Grid item xs={9}>
					Settings:
				</Grid>
				<Grid item xs={3} />
			</Grid>
			<br />
			<Grid container>
				<Grid item xs={6}>
					<form noValidate autoComplete="off">
						<TextField size="small" id="outlined-basic" label="server address" variant="outlined" value={address} onChange={handleServerAddressInputChange} />
					</form>
				</Grid>
				<Grid item xs={2}>
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
				<Grid item xs={4} />
			</Grid>
			<br />
			<Grid container>
				<Grid item xs={9}>
					<FormGroup >
						<FormControlLabel
							style={{justifyContent: 'center'}}
							control={<Switch checked={live} onChange={handleLiveToggleChange} />}
							label="Live"
						/>
					</FormGroup>
				</Grid>
				<Grid item xs={3} />
			</Grid>
		</React.Fragment>
}

export default SocketSettings;