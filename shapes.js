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
	this.program = ProgramManager.LoadProgram("texturedVert", "texturedFrag");
	this.shape = createRectangle(width, height);
	this.texture=TextureManager.GetTexture("another");
	this.width = width;
	this.height = height;
	this.tdlmodel=ModelManager.GetModel(this);
}

function LineStrip(vertarray, closedloop)
{
	this.program = ProgramManager.LoadProgram("texturedVert", "texturedFrag");
	this.shape = createLineStrip(vertarray, closedloop);
	this.texture=TextureManager.GetTexture("test");
	this.tdlmodel=ModelManager.GetModel(this);
    this.tdlmodel.mode = gl.LINE_STRIP;
}
LineStrip.prototype=Object.create(Model.prototype);
LineStrip.prototype.constructor=LineStrip;

function Polygon(vertarray)
{
	this.program = ProgramManager.LoadProgram("texturedVert", "texturedFrag");
	this.shape = convertPolygonToTriangleStrip(vertarray);
	this.texture=TextureManager.GetTexture("test");
	this.tdlmodel=ModelManager.GetModel(this);
    this.tdlmodel.mode = gl.TRIANGLE_STRIP;
}
Polygon.prototype=Object.create(Model.prototype);
Polygon.prototype.constructor=Polygon;

Circle.prototype=Object.create(Model.prototype);
Circle.prototype.constructor=Circle;
function Circle()
{
	this.program = ProgramManager.LoadProgram("texturedVert", "texturedFrag");
	this.shape = createCircle(1, 20);
	this.texture=TextureManager.GetTexture("test");
	this.tdlmodel=ModelManager.GetModel(this);
}
