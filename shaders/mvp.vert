attribute vec2 position;

uniform mat4 MV;
uniform mat4 P;

attribute vec2 texCoord; // tdl uses this variablename for texture coordinates
varying vec2 texCoord_out;

void main(void)
{
	texCoord_out=texCoord;
	gl_Position = P * MV * vec4(position, 0.0, 1.0);
}
