"use strict";

tdl.require('tdl.buffers');
tdl.require('tdl.fast');
tdl.require('tdl.math');
tdl.require('tdl.models');
tdl.require('tdl.primitives');
tdl.require('tdl.programs');
tdl.require('tdl.textures');
tdl.require('tdl.webgl');

window.onload=function()
{
	var zoomoutlevel = 100.0;
	var canvas=createCanvas();
	var gl = tdl.webgl.setupWebGL(canvas);
	var framecount=0;

	var mouseX = 0;
	var mouseY = 0;
	var wdown = true;

	window.onkeydown = function(e) {
		var key = e.keyCode ? e.keyCode : e.which;
		if(key === 87)
		{
			wdown = true;
		}
	};

	window.onkeyup = function(e) {
		var key = e.keyCode ? e.keyCode : e.which;
		if(key === 87)
		{
			wdown = false;
		}
	};

	window.onmousemove = function handleMouseMove(event)
	{
		event = event || window.event; // apparently this is for IE?
		mouseX = 2*(event.clientX / window.innerWidth) - 1;
		mouseY = -(2*(event.clientY / window.innerHeight) - 1);
	};

	if(!gl) return;

	var worker=new PhysicsWorker();
	worker.physicsWorker.onmessage=function(e)
	{
		if(typeof e.data === "string")
		{// Debug message
			console.log(e.data);
		}
		else
		{// State update
			PhysicsState=e.data.buffers;
		}
	};

	asyncWait([ShaderManager, TextureManager], function()
	{
		// initialize world
		/*
		var chainpoints = [];
		chainpoints.push([-70.0, -70.0]);
		chainpoints.push([70.0, -70.0]);
		chainpoints.push([70.0, 70.0]);
		chainpoints.push([-70.0, 70.0]);

		createStaticChainEntity(chainpoints, true);
		*/

		/*
		var trianglepoints = [];
		trianglepoints.push([-5, 0]);
		trianglepoints.push([0, -5]);
		trianglepoints.push([15, 0]);
		trianglepoints.push([0, 5]);
		var e = createDynamicPolygonEntity(trianglepoints);
		*/

		// create entities
		var circleshape = worker.CreateDefaultFixtureDef(worker.CreateCircleShape(1.0));
		var rectshape = worker.CreateDefaultFixtureDef(worker.CreateSquareShape(1.0, 1.0));

		for(var i=0;i<100;++i)
		{
			var physobject;
			if(i%2 === 0) physobject = worker.CreateDynamicObject(circleshape);
			else physobject = worker.CreateDynamicObject(rectshape);
			var xpos = Math.random()*138 - 69;
			var ypos = Math.random()*138 - 69;
			physobject.SetPosition(xpos, ypos);

			if(i%2 === 0) EntityManager.AddDynamicEntity(new Circle(), physobject);
			else EntityManager.AddDynamicEntity(new Rectangle(1.0, 1.0), physobject);
		}

		var scrn=new Screen(canvas, zoomoutlevel);

		(function draw()
		{
			++framecount;
			tdl.webgl.requestAnimationFrame(draw, canvas);
			scrn.Draw();
		})();
		window.onresize=function(){scrn.ResizeCanvas();};
		window.onmousewheel=function(e){handleMouseWheel(e,scrn);};
	});

	/*
	function applyThrusters(e)
	{
		var bcenter = e.physicsObject.body.GetWorldCenter();
		var bvector = e.physicsObject.body.GetWorldVector(new Box2D.b2Vec2(100.0,0.0));
		if(wdown)
			e.physicsObject.body.ApplyLinearImpulse(bvector, bcenter);
	}*/
};
