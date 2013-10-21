"use strict";

function Screen(canvas, zoomoutlevel)
{
	this.canvas=canvas;
	this.zoomoutlevel=zoomoutlevel;
	this.ResizeCanvas();
	return this;
}
Screen.sharedUniforms={
	P: new Float32Array(16)
}
Screen.perObjectUniforms={
	MV: new Float32Array(16)
}
Screen.prototype={
	Draw: function()
	{
		gl.colorMask(true, true, true, true);
		gl.clear(gl.COLOR_BUFFER_BIT);
		for(var i=0;i<EntityManager.entities.length;++i)
		{
			var ent=EntityManager.entities[i];
			if(ent.model)
			{
				ent.model.tdlmodel.drawPrep(Screen.sharedUniforms); // todo, draw by model
				ent.Draw(Screen.perObjectUniforms); // perobjectuniforms is just used as a buffer into which entity places the correct stuff
			}
		}
	},
	AddObject: function(o)
	{
		var ostr=o.constructor.name;
		if(o.texture) ostr+=o.texture.id;
		if(!this.objects[ostr])
			this.objects[ostr]=[o];
		else this.objects[ostr].push(o);
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
