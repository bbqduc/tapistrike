"use strict";

function Model() {
	this.shape=null; // tdl shape
	this.texture=undefined;
	this.program=undefined;
    this.tdlmodel=undefined;
}

Model.prototype={
	constructor: Model,
	Draw: function(uniforms)
	{
		this.tdlmodel.draw(uniforms);
	}
};

Rectangle.prototype=Object.create(Model.prototype);
Rectangle.prototype.constructor=Rectangle;
function Rectangle(width, height)
{
//	Model.call(this,arguments);
	this.program = ProgramManager.LoadProgram("vshader/mvp", "fshader/plain-white");
	this.shape = createRectangle(width, height);
	this.texture=TextureManager.GetTexture("another");
	this.width = width;
	this.height = height;
	this.tdlmodel=ModelManager.GetModel(this);
}

Circle.prototype=Object.create(Model.prototype);
Circle.prototype.constructor=Circle;
function Circle()
{
//	Model.call(this,arguments);
	this.program = ProgramManager.LoadProgram("vshader/mvp", "fshader/plain-white");
	this.shape = createCircle(1, 20);
	this.texture=TextureManager.GetTexture("test");
	this.tdlmodel=ModelManager.GetModel(this);
}
