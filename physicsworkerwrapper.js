"use strict";

function PhysicsWorkerObject(worker, id) {
	this.worker=worker;
	this.id=id;
	this.position={x: 0, y: 0};
	this.angle=0;
}
PhysicsWorkerObject.prototype={
	GetX: function()
	{
		return this.position.x;
	},
	GetY: function()
	{
		return this.position.y;
	},
	GetAngle: function()
	{
		return this.angle;
	},
	SetAngle: function(angle)
	{
		this.worker.postMessage({msg: "SetAngle", args: arguments, id: this.id});
	},
	SetPosition: function(x,y)
	{
		this.worker.postMessage({msg: "SetPosition", args: arguments, id: this.id});
	},
	SetTransform: function(x,y,angle)
	{
		this.worker.postMessage({msg: "SetTransform", args: arguments, id: this.id});
	}
};

function PhysicsWorker()
{
	this.physicsWorker=new Worker("physicsworker.js");
	this.physicsWorker.postMessage({msg: "init"});
}
PhysicsWorker.prototype={
	CreateStaticObject: function(fixturedef, id) // todo : maybe not the best interface design
	{
		this.physicsWorker.postMessage({
			id: id,
			msg: "CreateStaticObject",
			fixtureFunc: fixturedef.func,
			shapeFunc: fixturedef.shape.func,
			shapeArgs: fixturedef.shape.args
		});
		return new PhysicsWorkerObject(this,id);
	},
	CreateDynamicObject: function(fixturedef, id) // todo : maybe not the best interface design
	{
		this.physicsWorker.postMessage({
			id: id,
			msg: "CreateDynamicObject",
			fixtureFunc: fixturedef.func,
			shapeFunc: fixturedef.shape.func,
			shapeArgs: fixturedef.shape.args
		});
		return new PhysicsWorkerObject(this.physicsWorker,id);
	},
	CreateCircleShape: function(radius)
	{
		return {
			func: "CreateSquareShape",
			args: arguments
		};
	},
	CreateSquareShape: function(width, height)
	{
		return {
			func: "CreateSquareShape",
			args: arguments
		};
	},
	CreateDefaultFixtureDef: function(shape)
	{
		return {
			func: "CreateDefaultFixtureDef",
			shape: shape
		};
	}
};
