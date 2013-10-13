"use strict";

tdl.require('tdl.buffers');
tdl.require('tdl.fast');
tdl.require('tdl.math');
tdl.require('tdl.models');
tdl.require('tdl.primitives');
tdl.require('tdl.programs');
tdl.require('tdl.webgl');

function createCircle(radius, numvertices) // todo : move to some utils.js
{
    var accum = 0.0;
    var incr = Math.PI * 2 / numvertices;
    var positions = new tdl.primitives.AttribBuffer(2, numvertices+1);
    var indices = new tdl.primitives.AttribBuffer(3, numvertices+1, 'Uint16Array');
    positions.push([0,0]);
    for (var i = 1; i <= numvertices; ++i)
    {
        var x = Math.cos(accum);
        var y = Math.sin(accum);
        positions.push([radius * x, radius * y]);
        accum += incr;
        if(i > 1)
        {
            indices.push([0, i-1, i]);
        }
    }
    indices.push([0, i-1, 1]);
    return {
    position: positions,
    indices: indices};
}

function PhysicsWorld(gravity, sleep)
{
    this.world = new Box2D.b2World(gravity, sleep);
    this.gravity = gravity;
}

PhysicsWorld.prototype={
    constructor: PhysicsWorld,
    createDynamicBody: function()
    {
        var bodydef = new Box2D.b2BodyDef();
        bodydef.set_type(Box2D.b2_dynamicBody);
        var body = this.world.CreateBody(bodydef);
        return {body: body,
            bodydef: bodydef};
    },
    createStaticBody: function()
    {
        var bodydef = new Box2D.b2BodyDef();
        var body = this.world.CreateBody(bodydef);
        return {body: body,
            bodydef: bodydef};
    },
    createCircularDynamicBody: function(radius)
    {
        var bodydef = new Box2D.b2BodyDef();
        bodydef.set_type(Box2D.b2_dynamicBody);
        var body = this.world.CreateBody(bodydef);
        var shape = new Box2D.b2CircleShape();
        shape.set_m_p(0, 0);
        shape.set_m_radius(radius);
        body.CreateFixture(shape, 0.0); // todo : what is the second parameter?
        return {body: body,
            bodydef: bodydef,
            shape: shape};
    }
}


function Entity(drawableobject, physicsobject)
{
    this.drawableObject = drawableobject;
    this.physicsObject = physicsobject;
}

Entity.prototype={
    constructor: Entity,
    SyncDrawWithPhysics: function()
    {
        if(!this.physicsObject || !this.drawableObject) return;
        this.drawableObject.Translate(this.physicsObject.body.GetPosition().get_x(), this.physicsObject.body.GetPosition().get_y(), 0); // relies on Translate & Rotate overwriting previous data
        this.drawableObject.Rotate(0,0,this.physicsObject.body.GetAngle());
    }
}

window.onload=function()
{
    var world=new PhysicsWorld(new Box2D.b2Vec2(0.0, -10.0), true);
	var canvas=document.createElement("canvas");
	canvas.width=document.body.offsetWidth;
	canvas.height=document.body.offsetHeight;
	document.body.appendChild(canvas);
	var gl = tdl.webgl.setupWebGL(canvas);
	var framecount=0;

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

	function DrawableObject(vshader, fshader) {
		this.uniforms={
			MV: new Float32Array(16)
		};
		this.shape=null;
		this.modelMatrix = new Float32Array(16);
		this.rotationMatrix = new Float32Array(16);
		this.program = ProgramManager.LoadProgram(vshader, fshader);
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
        ResetMatrix: function()
        {
            tdl.fast.matrix4.identity(this.modelMatrix);
        },
		Translate: function(x,y,z)
		{
			tdl.fast.matrix4.translation(this.modelMatrix, [x,y,z]);
		},
		Rotate: function(x,y,z)
		{
            // todo : fix so rotations don't get overwritten
//			tdl.fast.matrix4.rotationX(this.rotationMatrix, x);
//			tdl.fast.matrix4.rotationY(this.rotationMatrix, y);
			tdl.fast.matrix4.rotationZ(this.rotationMatrix, z);
		}
	};

	function Sphere()
	{
		Sphere.prototype.constructor=Sphere;
		DrawableObject.apply(this, ["vshader/mvp", "fshader/plain-white"]);
        this.shape = createCircle(1, 20);
		this.model=ModelManager.GetModel(this);
		return this;
	}
	Sphere.prototype=DrawableObject.prototype;

	function Screen()
	{
		this.objects={};
		this.aspectRatio = canvas.clientWidth / canvas.clientHeight;
		tdl.fast.matrix4.ortho(Screen.sharedUniforms.P, -10, 10, -10.0/Screen.aspectRatio, 10.0/Screen.aspectRatio, 1, 5000);
		return this;
	}
	Screen.sharedUniforms={
		P: new Float32Array(16)
	}
	Screen.aspectRatio=canvas.width/canvas.height;
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
		}
	};

	(function initialize()
	{
		if(!gl) return;

        // initialize world
        var physworld = new PhysicsWorld(new Box2D.b2Vec2(0.0, -10.0));
        var world = physworld.world;

        // create ground entity (invisible for now)
        var groundphysobject = physworld.createStaticBody();
        groundphysobject.shape = new Box2D.b2EdgeShape();
        groundphysobject.shape.Set(new Box2D.b2Vec2(-40.0, -6.0), new Box2D.b2Vec2(40.0, -6.0));
        groundphysobject.body.CreateFixture(groundphysobject.shape, 0.0);
        EntityManager.AddEntity(null, groundphysobject);

        // create sphere entity
        var spherephysobject = physworld.createDynamicBody();
        spherephysobject.shape = new Box2D.b2CircleShape();
        spherephysobject.shape.set_m_p(new Box2D.b2Vec2(0.0, 0.0));
        spherephysobject.shape.set_m_radius(1);
        spherephysobject.bodydef.set_position(new Box2D.b2Vec2(0.0, 10.0));
        spherephysobject.body.CreateFixture(spherephysobject.shape, 0.0);

        var spheredrawableobject = new Sphere();
        EntityManager.AddEntity(spheredrawableobject, spherephysobject);

		var scrn=new Screen();
        for(var i=0;i<EntityManager.entities.length;++i)
        {
            var ent=EntityManager.entities[i];
            if(ent.drawableObject)
                scrn.AddObject(ent.drawableObject);
        }

		(function draw()
		{
			++framecount;
			tdl.webgl.requestAnimationFrame(draw, canvas);
			scrn.Draw();
            world.Step(0.01, 1, 1); // todo : correct timestep
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
