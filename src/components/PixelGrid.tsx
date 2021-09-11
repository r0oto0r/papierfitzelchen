import { Button } from "@material-ui/core";
import Pixel from "./Pixel";
import axios from "axios";

interface PixelData { x:number, y:number, r: number; g: number; b: number };

function PixelGrid(): JSX.Element {
	const grid: Array<Array<PixelData>> = new Array<Array<PixelData>>(64);
	for(let i = 0; i < 64; ++i) {
		grid[i] = new Array<PixelData>();
		for(let j = 0; j < 64; ++j) {
			grid[i][j] = {
				x: j,
				y: i,
				r: 0,
				g: 255,
				b: 0
			};
		}
	}
	return <div>
        <div style={{width: 64 * 15 + 'px', height: 64 * 15 + 'px'}}>
            {grid.map((row, index) => (
                <div key={index}>
                    {row.map((column: PixelData) => (
                        <Pixel key={`${column.x},${column.y}`}/>
                    ))}
                </div>
            ))}
        </div>
        <Button color="primary" variant="outlined" onClick={() => {
            axios.post("http://f1shp1.lan:4000/", { pixelGrid: grid }).catch(error => console.error(error));
        }}>Send</Button>
    </div>
}

export default PixelGrid;
