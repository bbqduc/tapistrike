"use strict";

function DrawableObject(vshader, fshader) {
	this.uniforms={
		MV: new Float32Array(16)
	};
	this.shape=null;
	this.modelMatrix = new Float32Array(16);
	this.rotationMatrix = new Float32Array(16);
	this.program = ProgramManager.LoadProgram(vshader, fshader);
	this.Translate(0,0,0);
	this.Rotate(0,0,0);
	return this;
}

DrawableObject.prototype={
	constructor: DrawableObject,
	Draw: function()
	{
		tdl.fast.matrix4.mul(this.uniforms.MV, this.modelMatrix, this.rotationMatrix);
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
	}
};
