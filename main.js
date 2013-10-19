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

    window.onmousemove = function handleMouseMove(event)
    {
        event = event || window.event; // apparently this is for IE?
        mouseX = 2*(event.clientX / window.innerWidth) - 1;
        mouseY = -(2*(event.clientY / window.innerHeight) - 1);
        console.log("X : " + mouseX + " Y : " + mouseY);
    }

	if(!gl) return;

	TextureManager.Initialize(function()
	{
		// initialize world
		
        PhysicsManager.world = new Box2D.b2World(new Box2D.b2Vec2(0.0, -10.0), true);

        var chainpoints = []
        chainpoints.push([-70.0, -70.0]);
        chainpoints.push([70.0, -70.0]);
        chainpoints.push([70.0, 70.0]);
        chainpoints.push([-70.0, 70.0]);

        createStaticChainEntity(chainpoints, true);

        var trianglepoints = [];
        trianglepoints.push([-5, -5]);
        trianglepoints.push([5, -5]);
        trianglepoints.push([0, 5]);
        trianglepoints.push([-10, 5]);
        var e = createDynamicPolygonEntity(trianglepoints);

		// create entities
		var circleshape = PhysicsManager.CreateDefaultFixtureDef(PhysicsManager.CreateCircleShape(1.0));
		var rectshape = PhysicsManager.CreateDefaultFixtureDef(PhysicsManager.CreateSquareShape(1.0, 1.0));

		for(var i=0;i<100;++i)
		{
            var physobject;
            if(i%2 == 0) physobject = PhysicsManager.CreateDynamicObject(circleshape);
            else physobject = PhysicsManager.CreateDynamicObject(rectshape);
            var xpos = Math.random()*138 - 69;
            var ypos = Math.random()*138 - 69;
            physobject.SetPosition(xpos, ypos);

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
            {
                var bcenter = e.physicsObject.body.GetWorldCenter();
                e.physicsObject.body.ApplyLinearImpulse(new Box2D.b2Vec2(100*mouseX, 100*mouseY), bcenter);
                PhysicsManager.world.Step(1.0/60.0, 3, 3);
            }
			prevt = prevt + iterations*1000/60;
			++framecount;
			tdl.webgl.requestAnimationFrame(draw, canvas);
			scrn.Draw();
		})();
		window.onresize=function(){scrn.ResizeCanvas();};
		window.onmousewheel=function(e){handleMouseWheel(e,scrn);}
	});
};

