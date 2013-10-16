"use strict";

function Rectangle(width, height)
{
	Rectangle.prototype.constructor=Rectangle;
	DrawableObject.apply(this, ["vshader/mvp", "fshader/plain-white"]);
	this.shape = createSquare();
	this.width = width;
	this.height = height;
}
Rectangle.prototype=DrawableObject.prototype;

function Sphere()
{
	Sphere.prototype.constructor=Sphere;
	DrawableObject.apply(this, ["vshader/mvp", "fshader/plain-white"]);
	this.shape = createCircle(1, 20);
	this.texture=TextureManager.GetTexture("test");
	this.model=ModelManager.GetModel(this);
	return this;
}
Sphere.prototype=DrawableObject.prototype;
