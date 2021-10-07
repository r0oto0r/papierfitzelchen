import { Box, ImageList, ImageListItem, IconButton, Stack } from "@mui/material";
import React from "react";
import { shallowEqual } from "react-redux";
import { useAppSelector, useAppDispatch } from "../hooks/general";
import { getPixelImage, PixelImage, removePixelImage } from "../slices/pixelImageSlice";
import DeleteIcon from '@mui/icons-material/Delete';
import UploadIcon from '@mui/icons-material/Upload';
import { setPixelGrid } from "../slices/pixelGridSlice";

function PixelImageGallery(): JSX.Element {
	const { pixelImages } = useAppSelector(
		(state: any) => getPixelImage(state), 
		(left: any, right: any)  => shallowEqual(left.pixelImages, right.pixelImages)
	);
	const dispatch = useAppDispatch();

	return <React.Fragment>
		<Box style={{ overflowY: 'auto', overflowX: 'clip', padding: 6 }} sx={{ margin: 'auto', height: 150, width: ((128 + 6) * 5) + 12, maxHeight: 150 }}>
			<ImageList cols={5} rowHeight={128} gap={3} style={{ overflowY: 'clip', overflowX: 'clip' }} >
				{pixelImages.map((image: PixelImage) => 
					<div>
						<ImageListItem key={image.uuid}>
							<Stack direction="row" spacing={0} sx={{position: 'absolute'}}>
								<IconButton size="small" aria-label="load" color="primary"
									onClick={() => dispatch(setPixelGrid(image.imageData))}
								>
									<UploadIcon />
								</IconButton>
								<IconButton size="small" aria-label="delete" color="secondary" 
									onClick={() => dispatch(removePixelImage(image.uuid))}
								>
									<DeleteIcon />
								</IconButton>
							</Stack>
							<img
								src={image.preview}
								srcSet={image.preview}
								alt={image.name}
								loading={'lazy'}
							/>
						</ImageListItem>
						<br/>
					</div>
				)}
			</ImageList>
		</Box>
	</React.Fragment>
}

export default PixelImageGallery;
