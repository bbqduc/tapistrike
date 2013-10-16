"use strict";

tdl.require("tdl.programs");
tdl.require("tdl.fast");

function DrawableObject() {
	this.uniforms={
		MV: new Float32Array(16)
	};
	this.shape=null;
	this.modelMatrix = new Float32Array(16);
	this.rotationMatrix = new Float32Array(16);
	this.Translate(0,0,0);
	this.Rotate(0,0,0);
	this.texture=undefined;
	this.program=undefined;
	return this;
}

DrawableObject.prototype={
	constructor: DrawableObject,
	Draw: function()
	{
		tdl.fast.matrix4.mul(this.uniforms.MV, this.rotationMatrix, this.modelMatrix);
		this.model.draw(this.uniforms);
	},
	ResetMatrix: function()
	{
		tdl.fast.matrix4.identity(this.modelMatrix);
	},
	Translate: function(x,y,z)
	{
		tdl.fast.matrix4.translation(this.modelMatrix, [x,y,z]);
	},
	Rotate: function(x,y,z)
	{
		// todo : fix so rotations don't get overwritten
		//			tdl.fast.matrix4.rotationX(this.rotationMatrix, x);
		//			tdl.fast.matrix4.rotationY(this.rotationMatrix, y);
		tdl.fast.matrix4.rotationZ(this.rotationMatrix, z);
	},
	LoadProgram: function(vshader, fshader)
	{
		this.program=ProgramManager.LoadProgram(vshader, fshader);
	}
};
