"use strict";

function Screen(canvas, zoomoutlevel)
{
	this.objects={};
	this.canvas=canvas;
	this.zoomoutlevel=zoomoutlevel;
	this.ResizeCanvas();
	return this;
}
Screen.sharedUniforms={
	P: new Float32Array(16)
}
Screen.prototype={
	Draw: function()
	{
		for(var i=0;i<EntityManager.entities.length;++i)
		{
			var ent=EntityManager.entities[i];
			ent.SyncDrawWithPhysics();
		}
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
	},
	ResizeCanvas: function()
	{
		this.canvas.width=window.innerWidth;
		this.canvas.height=window.innerHeight;
		Screen.aspectRatio=this.canvas.width/this.canvas.height;
		this.UpdateProjection();
		gl.viewport(0, 0, this.canvas.width, this.canvas.height);
	},
	UpdateProjection: function()
	{
		tdl.fast.matrix4.ortho(Screen.sharedUniforms.P, -1*this.zoomoutlevel, this.zoomoutlevel, -1*this.zoomoutlevel/Screen.aspectRatio, this.zoomoutlevel/Screen.aspectRatio, 1, 5000);
	}
};
