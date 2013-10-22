"use strict";
function PhysicsManager(){}
PhysicsManager.Objects={};
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

self.addEventListener("message", function(e)
{
	switch(e.msg)
	{
		case "init":
			PhysicsManager.world = new Box2D.b2World(new Box2D.b2Vec2(0.0, -10.0), true);
			break;
		case "CreateDynamicObject":
			var shape=PhysicsManager[e.shapeFunc].call(e.shapeArgs);
			var fixture=PhysicsManager[e.fixtureFunc](shape);
			PhysicsManager[e.id]=PhysicsManager.CreateDynamicObject(fixture);
			break;
		case "CreateStaticObject":
			var shape=PhysicsManager[e.shapeFunc].call(e.shapeArgs);
			var fixture=PhysicsManager[e.fixtureFunc](shape);
			PhysicsManager[e.id]=PhysicsManager.CreateStaticObject(fixture);
			break;
		default:
			PhysicsManager[e.id][e.msg].call(e.args);
			break;
	}
}, false);

var prevt = window.performance.now();
function tick()
{
	var curt = window.performance.now();
	var iterations = Math.floor((curt - prevt)*60/1000);
	//console.log("Simulating " + iterations + " iterations.");
	for(var i = 0; i < iterations; ++i)
	{
		//rotateTowardMouse(e);
		//applyThrusters(e);
		PhysicsManager.world.Step(1.0/60.0, 1, 1);
	}
	prevt = prevt + iterations*1000/60;
	//postMessage("tick", 
	setTimeout(tick, 1000/60);
}
setTimeout(tick, 1000/60);
