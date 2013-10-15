"use strict";

function createSquare()
{
	var positions = new tdl.primitives.AttribBuffer(2, 4);
	var indices = new tdl.primitives.AttribBuffer(3, 2, 'Uint16Array');

	positions.push([0.5,-0.5]);
	positions.push([-0.5,0.5]);
	positions.push([0.5,0.5]);
	positions.push([-0.5,-0.5]);

	indices.push([3,0,1]);
	indices.push([2,1,0]);

	return {
		position: positions,
			indices: indices
	};
}

function createCircle(radius, numvertices)
{
	var accum = 0.0;
	var incr = Math.PI * 2 / numvertices;
	var positions = new tdl.primitives.AttribBuffer(2, numvertices+1);
	var indices = new tdl.primitives.AttribBuffer(3, numvertices+1, 'Uint16Array');
	positions.push([0,0]);
	for (var i = 1; i <= numvertices; ++i)
	{
		var x = Math.cos(accum);
		var y = Math.sin(accum);
		positions.push([radius * x, radius * y]);
		accum += incr;
		if(i > 1)
		{
			indices.push([0, i-1, i]);
		}
	}
	indices.push([0, i-1, 1]);
	return {
		position: positions,
			indices: indices
	};
}

function createCanvas()
{
	var canvas=document.createElement("canvas");
	canvas.width=document.body.offsetWidth;
	canvas.height=document.body.offsetHeight;
	document.body.appendChild(canvas);
	return canvas;
}
