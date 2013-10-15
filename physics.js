"use strict";

function PhysicsBody(body, bodydef, shape)
{
    this.body = body;
    this.bodydef = bodydef;
    this.shape = shape;
}

PhysicsBody.prototype={
    setPosition: function(x,y)
    {
//		this.bodydef.set_position(new Box2D.b2Vec2(x,y));
        this.body.SetTransform(new Box2D.b2Vec2(x,y), this.body.GetAngle());
    },
    createFixture: function(shape)
    {
        this.body.CreateFixture(shape, 0.0);
    }
}

function PhysicsWorld(gravity, sleep)
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
    createCircleShape: function(radius)
    {
        var shape = new Box2D.b2CircleShape();
        shape.set_m_p(new Box2D.b2Vec2(0.0, 0.0));
        shape.set_m_radius(radius);
        return shape;
    }
};
