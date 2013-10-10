tdl.require('tdl.buffers');
tdl.require('tdl.fast');
tdl.require('tdl.math');
tdl.require('tdl.models');
tdl.require('tdl.primitives');
tdl.require('tdl.programs');
tdl.require('tdl.webgl');

window.onload=initialize;

function initialize()
{
    canvas = document.getElementById("canvas");
    gl = tdl.webgl.setupWebGL(canvas);
    if(!gl)
        return;

    var program = tdl.programs.loadProgramFromScriptTags("shader/mvp", "shader/plain-white");
    var arrays = tdl.primitives.createSphere(0.2, 10, 100);
    model = new tdl.models.Model(program, arrays);

    sharedUniforms = {
        P: new Float32Array(16)
    };
    perObjectUniforms = {
        MV: new Float32Array(16)
    };

    view = new Float32Array(16);
    modelmatrix = new Float32Array(16);

    //tdl.fast.matrix4.perspective(sharedUniforms.P, tdl.math.degToRad(60), canvas.clientWidth / canvas.clientHeight, 1, 5000);
    var aspectratio = canvas.clientWidth / canvas.clientHeight;
    tdl.fast.matrix4.ortho(sharedUniforms.P, -1, 1, -1.0/aspectratio, 1.0/aspectratio, 1, 5000);

    framecount=0;
    draw();
}

function draw()
{
    ++framecount;
    tdl.webgl.requestAnimationFrame(draw, canvas);
    var rotationmatrix=new Float32Array(16);
    tdl.fast.matrix4.rotationZ(rotationmatrix, framecount/100);

    gl.colorMask(true, true, true, true);
    gl.clear(gl.COLOR_BUFFER_BIT);

    model.drawPrep(sharedUniforms);

    for(var i = 0; i < 3; ++i)
    {
        tdl.fast.matrix4.translation(modelmatrix, [i/2, 0, 0]);
        tdl.fast.matrix4.mul(perObjectUniforms.MV, modelmatrix, rotationmatrix);
        model.draw(perObjectUniforms);
    }
}
