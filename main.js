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

	if(!gl) return;

	TextureManager.Initialize(function()
	{
		// initialize world
		
        PhysicsManager.world = new Box2D.b2World(new Box2D.b2Vec2(0.0, -10.0), true);

        var edgepoints = [];
        edgepoints.push([-40.0, 0.0]);
        edgepoints.push([40.0, -6.0]);
		// create ground entity (invisible for now)
		var edgeshape = new Box2D.b2EdgeShape();
		edgeshape.Set(new Box2D.b2Vec2(-40.0, 0.0), new Box2D.b2Vec2(40.0, -6.0));
		var groundphysobject = PhysicsManager.CreateStaticObject(PhysicsManager.CreateDefaultFixtureDef(edgeshape));

		EntityManager.AddEntity(new LineStrip(edgepoints), groundphysobject);

		// create entities
		var circleshape = PhysicsManager.CreateDefaultFixtureDef(PhysicsManager.CreateCircleShape(1.0));
		var rectshape = PhysicsManager.CreateDefaultFixtureDef(PhysicsManager.CreateSquareShape(1.0, 1.0));

		for(var i=0;i<100;++i)
		{
            var physobject;
            if(i%2 == 0) physobject = PhysicsManager.CreateDynamicObject(circleshape);
            else physobject = PhysicsManager.CreateDynamicObject(rectshape);
            physobject.SetPosition(Math.random(), i*2);

			if(i%2 == 0) EntityManager.AddDynamicEntity(new Circle, physobject);
			else EntityManager.AddDynamicEntity(new Rectangle(1.0, 1.0), physobject);
		}

		var scrn=new Screen(canvas, zoomoutlevel);

		var prevt = window.performance.now();
		(function draw()
		{
			var curt = window.performance.now();
			var iterations = Math.floor((curt - prevt)*60/1000);
			//console.log("Simulating " + iterations + " iterations.");
			for(var i = 0; i < iterations; ++i)
				PhysicsManager.world.Step(1.0/60.0, 3, 3);
			prevt = prevt + iterations*1000/60;
			++framecount;
			tdl.webgl.requestAnimationFrame(draw, canvas);
			scrn.Draw();
		})();
		window.onresize=function(){scrn.ResizeCanvas();};
		window.onmousewheel=function(e){handleMouseWheel(e,scrn);}
	});
};
