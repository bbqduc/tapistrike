"use strict";

tdl.require('tdl.buffers');
tdl.require('tdl.fast');
tdl.require('tdl.math');
tdl.require('tdl.models');
tdl.require('tdl.primitives');
tdl.require('tdl.programs');
tdl.require('tdl.webgl');

window.onload=function()
{
	var canvas=document.createElement("canvas");
	canvas.width=document.body.offsetWidth;
	canvas.height=document.body.offsetHeight;
	document.body.appendChild(canvas);
	var gl = tdl.webgl.setupWebGL(canvas);
	var framecount=0;

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

	function DrawableObject(mvp, shader) {
		this.uniforms={
			MV: new Float32Array(16)
		};
		this.shape=null;
		this.modelMatrix = new Float32Array(16);
		this.rotationMatrix = new Float32Array(16);
		this.program = ProgramManager.LoadProgram(mvp, shader);
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
		Translate: function(x,y,z)
		{
			tdl.fast.matrix4.translation(this.modelMatrix, [x,y,z]);
		},
		Rotate: function(x,y,z)
		{
			tdl.fast.matrix4.rotationX(this.rotationMatrix, x);
			tdl.fast.matrix4.rotationY(this.rotationMatrix, y);
			tdl.fast.matrix4.rotationZ(this.rotationMatrix, z);
		}
	};

	function Sphere()
	{
		Sphere.prototype.constructor=Sphere;
		DrawableObject.apply(this, ["shader/mvp", "shader/plain-white"]);
		this.shape=tdl.primitives.createSphere(0.1, 10, 100);
		this.model=ModelManager.GetModel(this);
		return this;
	}
	Sphere.prototype=DrawableObject.prototype;

	function Screen()
	{
		this.objects={};
		tdl.fast.matrix4.ortho(Screen.sharedUniforms.P, -1, 1, -1.0/Screen.aspectRatio, 1.0/Screen.aspectRatio, 1, 5000);
		return this;
	}
	Screen.sharedUniforms={
		P: new Float32Array(16)
	}
	Screen.aspectRatio=canvas.width/canvas.height;
	Screen.prototype={
		Draw: function()
		{
			gl.colorMask(true, true, true, true);
			gl.clear(gl.COLOR_BUFFER_BIT);
			for(var cls in this.objects)
			{
				ModelManager.models[cls].drawPrep(Screen.sharedUniforms);
				for(var i=0, len=this.objects[cls].length; i<len; ++i)
				{
					this.objects[cls][i].Draw();
				}
			}
		},
		AddObject: function(o)
		{
			if(!this.objects[o.constructor.name])
				this.objects[o.constructor.name]=[o];
			else this.objects[o.constructor.name].push(o);
		}
	};

	(function initialize()
	{
		if(!gl) return;
		var scrn=new Screen();
		var s=new Sphere;
		s.Translate(0.2, 0, 0);
		var s2=new Sphere;
		s2.Translate(0.4, 0, 0);
		scrn.AddObject(s);
		scrn.AddObject(s2);
		scrn.AddObject(new Sphere);
		(function draw()
		{
			++framecount;
			tdl.webgl.requestAnimationFrame(draw, canvas);
			s.Rotate(0,0,framecount/50);
			s2.Rotate(0,0,framecount/100);
			scrn.Draw();
		})();
	})();

	function resizeCanvas(e)
	{
		canvas.width=window.innerWidth;
		canvas.height=window.innerHeight;
		Screen.aspectRatio=canvas.width/canvas.height;
		tdl.fast.matrix4.ortho(Screen.sharedUniforms.P, -1, 1, -1.0/Screen.aspectRatio, 1.0/Screen.aspectRatio, 1, 5000);
		gl.viewport(0, 0, canvas.width, canvas.height);
	}
	window.onresize=resizeCanvas;
};
