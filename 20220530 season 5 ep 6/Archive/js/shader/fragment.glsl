uniform float time;
uniform float progress;
uniform float speed;
uniform float dir;
uniform sampler2D uTexture;
uniform sampler2D uDisp;
uniform vec4 resolution;
varying vec2 vUv;
varying vec3 vPosition;
// void e0MainUv(inout vec2 uv) {
//   float forc = pow( length( vUv.x ) + 0.5, e0Activ );
//   vec2 uvm = (gl_FragCoord.xy / resolution.xy) * cos(1.0 - forc );
//   float dy = sin( vUv.y - 0.5 ) * pow( e0Dir - vUv.x, 5.0 ) * e0Speed * 1.2;
//   uv = vec2( vUv.x + (uvm.x - vUv.x + ((1. - e0Format) * dy)), vUv.y - (uvm.y - vUv.y + (e0Format * dy)) );
// }
    
float PI = 3.141592653589793238;
void main()	{
	vec4 d = texture2D(
		uDisp,
		(vUv - vec2(0.5))*(1.  ) + vec2(0.5)
	);
	float forc = pow( 0.5 - length( vUv.x - 0.5 ) + 0.5, 1. );
	// forc = pow((0.5 - length( vUv.x - 0.5 )),2.)*0.2;
  vec2 uvm = vUv*vec2(1.,cos((1. - forc ))*0.9);
  float dy = sin( vUv.y - 0.5 ) * pow( speed/4. + 0.5 - vUv.x, 5.0 ) * abs(speed) * 1.2;
  vec2 newuv = vec2( 
	   uvm.x , 
  	   uvm.y 
		 //+dy /10. - 0.05
  );
	
	gl_FragColor = (0.1 + 2.*speed)*texture2D(uTexture,newuv + d.xy*0.02 + vec2(0.,-0.03));
	gl_FragColor = (0.3 + min(0.35,speed/10.) )*texture2D(uTexture,newuv + d.xy*0.01 + vec2(-0.00,-0.001));

	


}