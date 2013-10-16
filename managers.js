"use strict";

function EntityManager() {}
EntityManager.entities=[];
EntityManager.AddEntity = function(drawableObject, physicsobject)
{
	EntityManager.entities.push(new Entity(drawableObject, physicsobject));
}

function ProgramManager() {}
ProgramManager.programs={};
ProgramManager.LoadProgram=function(vec,frag)
{
	var catenated=vec+frag;
	var progs=ProgramManager.programs;
	if(!progs[catenated])
		progs[catenated]=tdl.programs.loadProgramFromScriptTags(vec, frag);
	return progs[catenated];
};

function ModelManager() {}
ModelManager.models={};
ModelManager.GetModel=function(drawableobject)
{
	var models=ModelManager.models;
	var classname=drawableobject.constructor.name;
	if(!models[classname])
	{
		// Name 'texsampler' must correspond to sampler2D name in the fragment shader
		models[classname]=new tdl.models.Model(drawableobject.program, drawableobject.shape, {texsampler: drawableobject.texture});
	}
	return models[classname];
};

function TextureManager() {}
TextureManager.initialized=false;
TextureManager.textures={
	test: "testTexture.png"
};
TextureManager.Initialize=function(cb)
{
	var ready=0;
	var texturecount=Object.keys(TextureManager.textures).length;
	for(var texname in TextureManager.textures)
	{// Replace texture path with actual texture id
		TextureManager.textures[texname]=tdl.textures.loadTexture(TextureManager.textures[texname], true, function()
		{// Call callback when all textures are loaded
			console.log("Texture manager initialized");
			TextureManager.initialized=true;
			if(++ready==texturecount) cb();
		});
	}
}
TextureManager.GetTexture=function(texname)
{
	if(!TextureManager.initialized) throw "TextureManager not initialized";
	var tex=TextureManager.textures[texname];
	if(!tex) throw "Texture " + texname + " not found";
	return tex;
}
