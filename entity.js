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
	if(PhysicsState)
	{
		var x=PhysicsState[this.id*3];
		var y=PhysicsState[this.id*3+1];
		var angle=PhysicsState[this.id*3+2];
		tdl.fast.matrix4.rotationZ(uniforms.MV, angle);
		tdl.fast.matrix4.translate(uniforms.MV, x, y, 0);
	}
};

function DynamicEntity(model, physicsobject)
{
	this.physicsObject = physicsobject;
	this.model = model;
	this.id=physicsobject.id;
}
DynamicEntity.prototype = Object.create(Entity.prototype);
DynamicEntity.prototype.PrepareUniforms = function(uniforms)
{
	if(PhysicsState)
	{
		var x=PhysicsState[this.id*3];
		var y=PhysicsState[this.id*3+1];
		var angle=PhysicsState[this.id*3+2];
		tdl.fast.matrix4.translation(uniforms.MV, [x, y, 0]);
		tdl.fast.matrix4.rotateZ(uniforms.MV, angle);
	}
};
