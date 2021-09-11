
function Pixel(): JSX.Element {
    let backgroundColor = 'black';
	return <span style={{
        backgroundColor,
		margin: '1px',
        width: '10px',
        height: '10px',
		display: "block",
		float: "left",
		fontSize: "5px"
	}}></span>
}

export default Pixel;
