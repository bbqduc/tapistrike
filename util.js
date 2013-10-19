"use strict";

function convertPolygonToTriangleStrip(vertarray)
{
    var numvertices = vertarray.length;
	var positions = new tdl.primitives.AttribBuffer(2, numvertices);
	var indices = new tdl.primitives.AttribBuffer(1, numvertices, 'Uint16Array');
	var texcoord = new tdl.primitives.AttribBuffer(2, numvertices);

	for(var i = 0; i < numvertices; ++i)
	{
		var x = vertarray[i][0];
		var y = vertarray[i][1];
		positions.push([x, y]);
		texcoord.push([x/2+0.5,y/2+0.5]);
	}
    indices.push([0]);
    for(var i=1;i<numvertices;++i)
    {
        if(i % 2 == 0)
            indices.push([numvertices - Math.floor(i/2)]);
        else
            indices.push([1+Math.floor(i/2)]);
    }

	return {
		position: positions,
		indices: indices,
		texCoord: texcoord
	};
}

function createDynamicPolygonEntity(vertarray)
{
        var tmpchainpoints = [];
        for(var i = 0; i < vertarray.length; ++i)
        {
            tmpchainpoints.push(new Box2D.b2Vec2(vertarray[i][0], vertarray[i][1]));
        }
        var polygonshape = createPolygonShape(tmpchainpoints);
        var chainmodel = new Polygon(vertarray);
        var physbody = PhysicsManager.CreateDynamicObject(PhysicsManager.CreateDefaultFixtureDef(polygonshape));
        return EntityManager.AddDynamicEntity(chainmodel, physbody);
}

function createStaticChainEntity(vertarray, closedloop)
{
        var tmpchainpoints = [];
        for(var i = 0; i < vertarray.length; ++i)
        {
            tmpchainpoints.push(new Box2D.b2Vec2(vertarray[i][0], vertarray[i][1]));
        }
        var chainshape = createChainShape(tmpchainpoints, closedloop);
        var chainmodel = new LineStrip(vertarray, closedloop);
        var physbody = PhysicsManager.CreateStaticObject(PhysicsManager.CreateDefaultFixtureDef(chainshape));
        return EntityManager.AddEntity(chainmodel, physbody);
}

function createLineStrip(vertarray, closedloop)
{
    var numindices = vertarray.length;
    if(closedloop) numindices++;
	var positions = new tdl.primitives.AttribBuffer(2, vertarray.length);
	var indices = new tdl.primitives.AttribBuffer(1, numindices, 'Uint16Array');
	var texcoord = new tdl.primitives.AttribBuffer(2, vertarray.length);

    for(var i = 0; i < vertarray.length; ++i)
    {
        positions.push(vertarray[i]);
        indices.push([i]);
        texcoord.push([vertarray.length/(i+1), 0]);
    }
    if(closedloop) indices.push([0]);

	return {
		position: positions,
		indices: indices,
		texCoord: texcoord
	};
}

function createRectangle(w,h)
{
	var positions = new tdl.primitives.AttribBuffer(2, 4);
	var indices = new tdl.primitives.AttribBuffer(3, 2, 'Uint16Array');
	var texcoord = new tdl.primitives.AttribBuffer(2, 4);

	positions.push([w,-h]);
	positions.push([-w,h]);
	positions.push([w,h]);
	positions.push([-w,-h]);

	texcoord.push([1, 0]);
	texcoord.push([0,1]);
	texcoord.push([1,1]);
	texcoord.push([0,0]);

	indices.push([3,0,1]);
	indices.push([2,1,0]);

	return {
		position: positions,
		indices: indices,
		texCoord: texcoord
	};
}

function createCircle(radius, numvertices)
{
	var accum = 0.0;
	var incr = Math.PI * 2 / numvertices;
	var positions = new tdl.primitives.AttribBuffer(2, numvertices+1);
	var indices = new tdl.primitives.AttribBuffer(3, numvertices+1, 'Uint16Array');
	var texcoord=new tdl.primitives.AttribBuffer(2, numvertices+1);
	positions.push([0,0]);
	texcoord.push([0.5,0.5]);
	for (var i = 1; i <= numvertices; ++i)
	{
		var x = Math.cos(accum);
		var y = Math.sin(accum);
		positions.push([radius * x, radius * y]);
		texcoord.push([x/2+0.5,y/2+0.5]);
		accum += incr;
		if(i > 1)
		{
			indices.push([0, i-1, i]);
		}
	}
	indices.push([0, i-1, 1]);
	return {
		position: positions,
		indices: indices,
		texCoord: texcoord
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

function handleMouseWheel(e,screen)
{
	if(e.wheelDeltaY>0) screen.zoomoutlevel-=5;
	else if(e.wheelDeltaY<0) screen.zoomoutlevel+=5;
	screen.zoomoutlevel=Math.max(1,screen.zoomoutlevel);
	screen.UpdateProjection();
}

function asyncWait(initArray, cb)
{
	var ialen=initArray.length;
	var iaready=0;
	var asyncWaitCb=function()
	{
		if(++iaready === ialen) cb();
	};
	for(var i=0; i<ialen; ++i)
	{
		if(initArray[i].hasOwnProperty("Initialize"))
			initArray[i].Initialize(asyncWaitCb);
		else
			throw "Tried to asyncWait without Initialize-function";
	}
}
