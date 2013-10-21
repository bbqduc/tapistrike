"use strict";

tdl.require("tdl.programs");
tdl.require("tdl.fast");

function EntityManager() {}
EntityManager.entities=[];
EntityManager.AddConstructedEntity = function(entity)
{
	EntityManager.entities.push(entity);
	return entity;
}
EntityManager.AddEntity = function(drawableObject, physicsobject)
{
	return this.AddConstructedEntity(new Entity(drawableObject, physicsobject));
}
EntityManager.AddDynamicEntity = function(drawableObject, physicsobject)
{
	return this.AddConstructedEntity(new DynamicEntity(drawableObject, physicsobject));
}
EntityManager.AddStaticEntity = function(drawableObject, physicsobject)
{
	return this.AddConstructedEntity(new StaticEntity(drawableObject, physicsobject));
}

function ProgramManager() {}
ProgramManager.programs={};
ProgramManager.LoadProgram=function(vert,frag)
{
	var catenated=vert+frag;
	var progs=ProgramManager.programs;
	if(!progs[catenated])
		progs[catenated]=new tdl.programs.loadProgram(ShaderManager.GetShader(vert), ShaderManager.GetShader(frag));
	return progs[catenated];
};

function ModelManager() {}
ModelManager.models={};
ModelManager.GetModel=function(drawableobject)
{
	var models=ModelManager.models;
	var classname=drawableobject.constructor.name;
	if(drawableobject.texture) classname+=drawableobject.texture.id;
	if(!models[classname])
	{
		// Name 'texsampler' must correspond to sampler2D name in the fragment shader
		models[classname]=new tdl.models.Model(drawableobject.program, drawableobject.shape, {texsampler: drawableobject.texture.texture});
	}
	return models[classname];
};

function ShaderManager() {}
ShaderManager.initialized=false;
ShaderManager.shaders={
	texturedVert: "shaders/mvp.vert",
	texturedFrag: "shaders/textured.frag"
};
ShaderManager.Initialize=function(cb)
{
	if(!XMLHttpRequest) throw "TODO: This browser does not support XMLHttpRequest";
	var ready=0;
	var shadercount=Object.keys(ShaderManager.shaders).length;
	for(var sname in ShaderManager.shaders)
	{
		(function(sname)
		{
			var req=new XMLHttpRequest();
			req.open("GET", ShaderManager.shaders[sname], true);
			req.onload=function(e)
			{
				ShaderManager.shaders[sname]=req.responseText;
				if(++ready==shadercount)
				{
					console.log("ShaderManager initialized");
					ShaderManager.initialized=true;
					cb();
				}
			}
			req.onerror=function(e)
			{
				throw e;
			}
			req.send(null);
		})(sname);
	}
};
ShaderManager.GetShader=function(sname)
{
	if(!ShaderManager.initialized) throw "ShaderManager not initialized";
	var s=ShaderManager.shaders[sname];
	if(!s) throw "Shader " + sname + " not found";
	return s;
};

function TextureManager() {}
TextureManager.initialized=false;
TextureManager.textures={
	another: "anotherTexture.png",
	test: "testTexture.png"
};
TextureManager.Initialize=function(cb)
{
	var texid=1;
	var ready=0;
	var texturecount=Object.keys(TextureManager.textures).length;
	for(var texname in TextureManager.textures)
	{// Replace texture path with actual texture id
		TextureManager.textures[texname]={texture: tdl.textures.loadTexture(TextureManager.textures[texname], true, function()
		{// Call callback when all textures are loaded
			if(++ready==texturecount)
			{
				console.log("Texture manager initialized");
				TextureManager.initialized=true;
				cb();
			}
		}), id: texid++};
	}
};
TextureManager.GetTexture=function(texname)
{
	if(!TextureManager.initialized) throw "TextureManager not initialized";
	var tex=TextureManager.textures[texname];
	if(!tex) throw "Texture " + texname + " not found";
	return tex;
};

function PhysicsManager(){}
PhysicsManager.CreateStaticObject = function(fixturedef) // todo : maybe not the best interface design
{
	var bodydef = new Box2D.b2BodyDef();
	var body = PhysicsManager.world.CreateBody(bodydef);
	return new PhysicsObject(body, fixturedef);
}
PhysicsManager.CreateDynamicObject = function(fixturedef) // todo : maybe not the best interface design
{
	var bodydef = new Box2D.b2BodyDef();
	bodydef.set_type(Box2D.b2_dynamicBody);
	var body = PhysicsManager.world.CreateBody(bodydef);
	return new PhysicsObject(body, fixturedef);
}
PhysicsManager.CreateCircleShape = function(radius)
{
	var shape = new Box2D.b2CircleShape();
	shape.set_m_p(new Box2D.b2Vec2(0.0, 0.0));
	shape.set_m_radius(radius);
	return shape;
}
PhysicsManager.CreateSquareShape = function(width, height)
{
	var shape = new Box2D.b2PolygonShape();
	shape.SetAsBox(width, height);
	return shape;
}
PhysicsManager.CreateDefaultFixtureDef = function(shape)
{
	var fixturedef = new Box2D.b2FixtureDef();
	fixturedef.set_shape(shape);
	fixturedef.set_friction(0.3);
	fixturedef.set_density(1);
	return fixturedef;
}
