
function Pixel(): JSX.Element {
    let backgroundColor = 'blue';
	return <span style={{
        backgroundColor,
		margin: '1px',
        width: '13px',
        height: '13px',
		display: "block",
		float: "left",
		fontSize: "5px"
	}}></span>
}

export default Pixel;
