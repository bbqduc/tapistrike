"use strict";

Rectangle.prototype=new DrawableObject;
Rectangle.prototype.constructor=Rectangle;
function Rectangle(width, height)
{
	DrawableObject.call(this,arguments);
	this.LoadProgram("vshader/mvp", "fshader/plain-white");
	this.shape = createRectangle(width, height);
	this.texture=TextureManager.GetTexture("another");
	this.width = width;
	this.height = height;
	this.model=ModelManager.GetModel(this);
	return this;
}

Sphere.prototype=new DrawableObject;
Sphere.prototype.constructor=Sphere;
function Sphere()
{
	DrawableObject.call(this,arguments);
	this.LoadProgram("vshader/mvp", "fshader/plain-white");
	this.shape = createCircle(1, 20);
	this.texture=TextureManager.GetTexture("test");
	this.model=ModelManager.GetModel(this);
	return this;
}
