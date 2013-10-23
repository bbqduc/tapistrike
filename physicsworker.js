"use strict";

self.importScripts("box2d.js");
self.importScripts("physics.js");

function PhysicsManager(){}
PhysicsManager.Objects=[];
PhysicsManager.CreateStaticObject = function(fixturedef) // todo : maybe not the best interface design
{
	var bodydef = new Box2D.b2BodyDef();
	var body = PhysicsManager.world.CreateBody(bodydef);
	return new PhysicsObject(body, fixturedef);
};
PhysicsManager.CreateDynamicObject = function(fixturedef) // todo : maybe not the best interface design
{
	var bodydef = new Box2D.b2BodyDef();
	bodydef.set_type(Box2D.b2_dynamicBody);
	var body = PhysicsManager.world.CreateBody(bodydef);
	return new PhysicsObject(body, fixturedef);
};
PhysicsManager.CreateCircleShape = function(radius)
{
	var shape = new Box2D.b2CircleShape();
	shape.set_m_p(new Box2D.b2Vec2(0.0, 0.0));
	shape.set_m_radius(radius);
	return shape;
};
PhysicsManager.CreateSquareShape = function(width, height)
{
	var shape = new Box2D.b2PolygonShape();
	shape.SetAsBox(width, height);
	return shape;
};
PhysicsManager.CreateDefaultFixtureDef = function(shape)
{
	var fixturedef = new Box2D.b2FixtureDef();
	fixturedef.set_shape(shape);
	fixturedef.set_friction(0.3);
	fixturedef.set_density(1);
	return fixturedef;
};


var prevt = self.performance.now();
function tick()
{
	var curt = self.performance.now();
	var iterations = Math.floor((curt - prevt)*60/1000);
	//console.log("Simulating " + iterations + " iterations.");
	for(var i = 0; i < iterations; ++i)
	{
		//rotateTowardMouse(e);
		//applyThrusters(e);
		PhysicsManager.world.Step(1.0/60.0, 1, 1);
	}
	var len=PhysicsManager.Objects.length;
	var obj={
		buffers: new Float32Array(3*len)
	};
	for(var i=0; i<len; ++i)
	{
		var physobj=PhysicsManager.Objects[i];
		obj.buffers[i*3]=(physobj.GetX());
		obj.buffers[i*3+1]=(physobj.GetY());
		obj.buffers[i*3+2]=(physobj.GetAngle());
	}
	prevt = prevt + iterations*1000/60;
	postMessage(obj, [obj.buffers.buffer]);
	setTimeout(tick, 1000/60);
}

self.addEventListener("message", function(e)
{
	var e=e.data;
	switch(e.msg)
	{
		case "init":
			PhysicsManager.world = new Box2D.b2World(new Box2D.b2Vec2(0.0, -10.0), true);
			self.postMessage("World intialized");
			setTimeout(tick, 1000/60);
			break;
		case "CreateDynamicObject":
			var shape=PhysicsManager[e.shapeFunc].apply(self, e.shapeArgs);
			var fixture=PhysicsManager[e.fixtureFunc](shape);
			PhysicsManager.Objects[e.id]=PhysicsManager.CreateDynamicObject(fixture);
			self.postMessage("DynamicObject " + e.id + " created.");
			break;
		case "CreateStaticObject":
			var shape=PhysicsManager[e.shapeFunc].apply(self, e.shapeArgs);
			var fixture=PhysicsManager[e.fixtureFunc](shape);
			PhysicsManager.Objects[e.id]=PhysicsManager.CreateStaticObject(fixture);
			self.postMessage("StaticObject " + e.id + " created.");
			break;
		default:
			var obj=PhysicsManager.Objects[e.id];
			obj[e.msg].apply(obj, e.args);
			break;
	}
}, false);
