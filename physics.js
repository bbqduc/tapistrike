"use strict";

function PhysicsObject(body, fixturedef) // todo : maybe need some redesign here
{
	this.body = body;
	this.body.CreateFixture(fixturedef);
	this.prevx=0;
	this.prevy=0;
	this.preva=0;
}

PhysicsObject.prototype = {
	GetX : function()
	{
		var x=this.body.GetPosition().get_x();
		if(x!==this.prevx)
		{
			self.postMessage({msg: "GetX", args: [x]});
			this.prevx=x;
		}

	},
	GetY : function()
	{
		var y=this.body.GetPosition().get_y();
		if(y!==this.prevy)
		{
			self.postMessage({msg: "GetY", args: [y]});
			this.prevy=y;
		}
	},
	GetAngle : function()
	{
		var a=this.body.GetAngle();
		if(a!==this.preva)
		{
			self.postMessage({msg: "GetAngle", args: [a]});
			this.preva=a;
		}
	},
	SetAngle : function(angle)
	{
		this.SetTransform(this.GetX(), this.GetY(), angle);
	},
	SetPosition : function(x,y)
	{
		this.SetTransform(x, y, this.GetAngle());
	},
	SetTransform : function(x,y,angle)
	{
		this.body.SetTransform(new Box2D.b2Vec2(x,y), angle);
	}
};


/*function PhysicsWorld(gravity, sleep)
{
	this.world = new Box2D.b2World(gravity, sleep);
	this.gravity = gravity;
}

PhysicsWorld.prototype={
	constructor: PhysicsWorld,
	createDynamicBody: function()
	{
		var bodydef = new Box2D.b2BodyDef();
		bodydef.set_type(Box2D.b2_dynamicBody);
		var body = this.world.CreateBody(bodydef);
		return new PhysicsBody(body, bodydef);
	},
	createStaticBody: function()
	{
		var bodydef = new Box2D.b2BodyDef();
		var body = this.world.CreateBody(bodydef);
		return new PhysicsBody(body, bodydef);
	},
};*/
