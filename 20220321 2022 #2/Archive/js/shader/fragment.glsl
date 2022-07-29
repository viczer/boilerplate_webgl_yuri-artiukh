uniform float time;
uniform float progress;
uniform sampler2D texture1;
uniform vec4 resolution;
varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;
varying float vNoise;
float PI = 3.141592653589793238;
void main()	{

	// vec2 newUV = (vUv - vec2(0.5))*resolution.zw + vec2(0.5);
	gl_FragColor = vec4(vNormal,1.);
	// gl_FragColor = vec4(vNoise,0.,0.,1.);
}