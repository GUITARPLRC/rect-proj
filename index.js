let add = document.querySelector('#add');
let clear = document.querySelector('#clear');
let checkbox = document.querySelector('input[type=checkbox]');
let board = document.querySelector('#board');

let colorArray = ['#b72025', '#1abc9c', '#e67e22', '#3498db', '#9b59b6'];
let prevColor = null; // check prev color choice so not to duplicate

let changeColor = false;

checkbox.addEventListener('change', () => {
	changeColor = !changeColor;
});

// alternate colors
function colorCheck() {
	var color = Math.floor(Math.random() * colorArray.length);
	if (prevColor == color) {
		return colorCheck();
	}
	prevColor = color;
	return colorArray[color];
}

//add rect to page
add.addEventListener('click', () => {
	let rect = document.createElement('div');

	let color = colorCheck();

	rect.className = 'rect';
	rect.style.backgroundColor = color;

	board.appendChild(rect);
});

// // remove rect
board.addEventListener('dblclick', e => {
	// check if div is child of board or any rect
	if (e.target.parentNode !== board) {
		return;
	}
	board.removeChild(e.target);
});

// change rect color
board.addEventListener('click', e => {
	if (e.target.parentNode !== board) {
		return;
	} else if (!changeColor) {
		return;
	}
	let color = colorCheck();
	e.target.style.backgroundColor = `${color}`;
});

// clear all rects
clear.addEventListener('click', () => {
	while (board.firstChild) {
		board.removeChild(board.firstChild);
	}
});

interact('.rect')
	.draggable({
		inertia: true,
		onmove: window.dragMoveListener
	})
	.resizable({
		edges: { left: true, right: true, bottom: true, top: true }
	})
	.on('resizemove', function(event) {
		let target = event.target,
			x = parseFloat(target.getAttribute('data-x')) || 0,
			y = parseFloat(target.getAttribute('data-y')) || 0;

		// update the element's style
		target.style.width = event.rect.width + 'px';
		target.style.height = event.rect.height + 'px';

		// translate when resizing from top or left edges
		x += event.deltaRect.left;
		y += event.deltaRect.top;

		target.style.webkitTransform = target.style.transform =
			'translate(' + x + 'px,' + y + 'px)';

		target.setAttribute('data-x', x);
		target.setAttribute('data-y', y);
	});

function dragMoveListener(event) {
	let target = event.target,
		// keep the dragged position in the data-x/data-y attributes
		x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
		y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

	// translate the element
	target.style.webkitTransform = target.style.transform = `translate(${x}px, ${y}px)`;

	// update the posiion attributes
	target.setAttribute('data-x', x);
	target.setAttribute('data-y', y);
}

window.dragMoveListener = dragMoveListener;
