import { Box, ImageList, ImageListItem } from "@material-ui/core";
import { useAppSelector } from "../hooks/general";
import { getPixelImage, PixelImage } from "../slices/pixelImageSlice";

function PixelImageGallery(): JSX.Element {
	const { pixelImages } = useAppSelector((state: any) => getPixelImage(state), (left, right) => {
		return left.pixelImages.length === right.pixelImages.length;
	});
	return <Box style={{ overflowY: 'auto', overflowX: 'clip', padding: 6 }} sx={{ margin: 'auto', height: 150, width: ((128 + 6) * 5) + 12, maxHeight: 150 }}>
		<ImageList cols={5} rowHeight={128} gap={3}>
			{pixelImages.map((image: PixelImage, index: number) => 
				<ImageListItem>
					<img key={index}
						src={image.preview}
						srcSet={image.preview}
						alt={image.name}
						loading={'lazy'}
					/>
				</ImageListItem>
			)}
		</ImageList>
	</Box>
}

export default PixelImageGallery;
