#ifdef GL_ES
	precision highp float;
#endif

uniform sampler2D texsampler;
varying vec2 texCoord_out;
void main(void)
{
	vec4 tex=texture2D(texsampler, texCoord_out);
	gl_FragColor = vec4(tex.rgb, 1.0);
}
