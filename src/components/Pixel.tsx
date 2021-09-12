
import { useAppSelector, useAppDispatch } from '../hooks'
import { getColor } from '../slices/colorSlice';
import { PixelData, setPixel } from '../slices/pixelGridSlice';
import convert from 'color-convert';

interface PixelProps { x: number, y: number, r: number, b: number, g: number };

function Pixel(props: PixelProps): JSX.Element {
    const dispatch = useAppDispatch();
    const hexColorFromStore = useAppSelector((state) => getColor(state)).color;
    const { x, y, r, g, b } = props;
    const hexColor = convert.rgb.hex([r, g, b]);
    
	return <span style={{
        backgroundColor: '#' + hexColor,
		margin: '1px',
        width: '8px',
        height: '8px',
		display: "block",
		float: "left",
		fontSize: "5px"
	}} onClick={() => {
        const [ r, g, b ] = convert.hex.rgb(hexColorFromStore);
        const pixelData: PixelData = {
            x,
            y,
            r,
            g,
            b
        };
        dispatch(setPixel(pixelData));
    }}>
    </span>
}

export default Pixel;
