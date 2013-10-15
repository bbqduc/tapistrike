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
		models[classname]=new tdl.models.Model(drawableobject.program, drawableobject.shape);
	return models[classname];
};
