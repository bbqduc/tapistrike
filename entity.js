"use strict";

tdl.require("tdl.fast");

function Entity(drawableobject, physicsobject) // this would probably be an abstract class in another language
{
	this.model = drawableobject;
	this.physicsObject = physicsobject;
	this.id=physobject.id;
}
Entity.prototype={
	constructor: Entity,
	PrepareUniforms: function(uniforms) // this should probably always be overridden
	{
		tdl.fast.identity4(uniforms.MV);
	},
	Draw: function(uniforms)
	{
		this.PrepareUniforms(uniforms);
		this.model.Draw(uniforms);
	}
};

function StaticEntity(x,y,angle,model) // can also have physics with a static entity
{
	this.model = model;
	this.x = x;
	this.y = y;
	this.angle = angle;
}
StaticEntity.prototype = Object.create(Entity.prototype);
StaticEntity.prototype.PrepareUniforms = function(uniforms)
{
	tdl.fast.matrix4.rotationZ(uniforms.MV, this.angle);
	tdl.fast.matrix4.translate(uniforms.MV, this.x, this.y, 0);
};

function DynamicEntity(model, physicsobject)
{
	this.physicsObject = physicsobject;
	this.model = model;
}
DynamicEntity.prototype = Object.create(Entity.prototype);
DynamicEntity.prototype.PrepareUniforms = function(uniforms)
{
	tdl.fast.matrix4.translation(uniforms.MV, [this.physicsObject.GetX(), this.physicsObject.GetY(), 0]);
	tdl.fast.matrix4.rotateZ(uniforms.MV, this.physicsObject.GetAngle());
};
