"use strict";

function PhysicsWorkerObject(worker, id) {
	this.worker=worker;
	this.id=id;
	this.position={x: 0, y: 0};
	this.angle=0;
}
PhysicsWorkerObject.id=0;
PhysicsWorkerObject.prototype={
	/*
	GetX: function()
	{
		this.worker.postMessage({msg: "GetX", args: [], id: this.id});
	},
	GetY: function()
	{
		this.worker.postMessage({msg: "GetY", args: [], id: this.id});
	},
	GetAngle: function()
	{
		this.worker.postMessage({msg: "GetAngle", args: [], id: this.id});
	},*/
	SetAngle: function(angle)
	{
		this.worker.postMessage({msg: "SetAngle", args: [angle], id: this.id});
	},
	SetPosition: function(x,y)
	{
		this.worker.postMessage({msg: "SetPosition", args: [x,y], id: this.id});
	},
	SetTransform: function(x,y,angle)
	{
		this.worker.postMessage({msg: "SetTransform", args: [x,y,angle], id: this.id});
	}
};

function PhysicsWorker()
{
	this.physicsWorker=new Worker("physicsworker.js");
	this.physicsWorker.postMessage({msg: "init"});
}
PhysicsWorker.prototype={
	CreateStaticObject: function(fixturedef) // todo : maybe not the best interface design
	{
		var id=PhysicsWorkerObject.id++;
		this.physicsWorker.postMessage({
			id: id,
			msg: "CreateStaticObject",
			fixtureFunc: fixturedef.func,
			shapeFunc: fixturedef.shape.func,
			shapeArgs: fixturedef.shape.args
		});
		return new PhysicsWorkerObject(this.physicsWorker,id);
	},
	CreateDynamicObject: function(fixturedef) // todo : maybe not the best interface design
	{
		var id=PhysicsWorkerObject.id++;
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
			func: "CreateCircleShape",
			args: [radius]
		};
	},
	CreateSquareShape: function(width, height)
	{
		return {
			func: "CreateSquareShape",
			args: [width,height]
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
