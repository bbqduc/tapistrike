"use strict";

function Entity(drawableobject, physicsobject)
{
	this.drawableObject = drawableobject;
	this.physicsObject = physicsobject;
}

Entity.prototype={
	constructor: Entity,
	SyncDrawWithPhysics: function()
	{
		if(!this.physicsObject || !this.drawableObject) return;
		this.drawableObject.Translate(this.physicsObject.body.GetPosition().get_x(), this.physicsObject.body.GetPosition().get_y(), 0); // relies on Translate & Rotate overwriting previous data
		this.drawableObject.Rotate(0,0,this.physicsObject.body.GetAngle());
	}
};
