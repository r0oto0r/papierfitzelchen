export interface Box {
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface Circle {
    x: number;
    y: number;
    r: number;
}


export function boxesIntersect(a: Box, b: Box) {
	return	a.x < b.x + b.width &&
			a.x + a.width > b.x &&
			a.y < b.y + b.height &&
			a.y + a.height > b.y
}

export function circleWithBoxIntersect(circle: Circle, box: Box) {
	const circleDistanceX = Math.abs(circle.x - box.x);
	const circleDistanceY = Math.abs(circle.y - box.y);

	if (circleDistanceX > (box.width / 2 + circle.r)) {
		return false;
	}
	if (circleDistanceY > (box.height / 2 + circle.r)) {
		return false;
	}
	if (circleDistanceX <= (box.width / 2)) {
		return true;
	} 
	if (circleDistanceY <= (box.height /2 )) {
		return true;
	}

	const cornerDistanceSQ =	Math.pow((circleDistanceX - box.width / 2 ), 2) +
								Math.pow((circleDistanceY - box.height / 2 ), 2);

	return cornerDistanceSQ <= (Math.pow(circle.r, 2));
}
