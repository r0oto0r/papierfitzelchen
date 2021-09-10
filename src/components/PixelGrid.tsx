import Pixel from "./Pixel";

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
				g: 0,
				b: 0
			};
		}
	}
	return <div style={{width: 64 * 15 + 'px', height: 64 * 15 + 'px'}}>
		{grid.map((row) => (
			<div>
				{row.map((column: PixelData) => (
					<Pixel />
				))}
			</div>
		))}
	</div>
}

export default PixelGrid;
