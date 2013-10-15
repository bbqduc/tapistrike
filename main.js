"use strict";

tdl.require('tdl.buffers');
tdl.require('tdl.fast');
tdl.require('tdl.math');
tdl.require('tdl.models');
tdl.require('tdl.primitives');
tdl.require('tdl.programs');
tdl.require('tdl.webgl');

window.onload=function()
{
	var zoomoutlevel = 100.0;
	var world=new PhysicsWorld(new Box2D.b2Vec2(0.0, -10.0), true);
	var canvas=createCanvas();
	var gl = tdl.webgl.setupWebGL(canvas);
	var framecount=0;

	if(!gl) return;

	// initialize world
	var physworld = new PhysicsWorld(new Box2D.b2Vec2(0.0, -10.0));
	var world = physworld.world;

	// create ground entity (invisible for now)
	var groundphysobject = physworld.createStaticBody();
	var edgeshape = new Box2D.b2EdgeShape();
	edgeshape.Set(new Box2D.b2Vec2(-40.0, 0.0), new Box2D.b2Vec2(40.0, -6.0));
	groundphysobject.createFixture(edgeshape);
	EntityManager.AddEntity(null, groundphysobject);

	// create sphere entity
	var circleshape = physworld.createCircleShape(1.0);

	for(var i=0;i<100;++i)
	{
		var circlephysobject = physworld.createDynamicBody();
		circlephysobject.setPosition(0, i*2);
		circlephysobject.createFixture(circleshape);

		var spheredrawableobject = new Sphere();
		EntityManager.AddEntity(spheredrawableobject, circlephysobject);
	}

	var scrn=new Screen(canvas, zoomoutlevel);
	for(var i=0;i<EntityManager.entities.length;++i)
	{
		var ent=EntityManager.entities[i];
		if(ent.drawableObject)
			scrn.AddObject(ent.drawableObject);
	}

	var prevt = window.performance.now();
	(function draw()
	{
		var curt = window.performance.now();
		var iterations = Math.floor((curt - prevt)*60/1000);
		console.log("Simulating " + iterations + " iterations.");
		for(var i = 0; i < iterations; ++i)
			world.Step(1.0/60.0, 3, 3);
		prevt = prevt + iterations*1000/60;
		++framecount;
		tdl.webgl.requestAnimationFrame(draw, canvas);
		scrn.Draw();
	})();
	window.onresize=function(){scrn.ResizeCanvas();};
};
