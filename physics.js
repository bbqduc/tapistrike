        "use strict";

function PhysicsObject(body, fixturedef) // todo : maybe need some redesign here
{
    this.body = body;
    this.body.CreateFixture(fixturedef);
}

PhysicsObject.prototype = {
    GetX : function()
    {
        return this.body.GetPosition().get_x();
    },
    GetY : function()
    {
        return this.body.GetPosition().get_y();
    },
    GetAngle : function()
    {
        return this.body.GetAngle();
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
}


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
