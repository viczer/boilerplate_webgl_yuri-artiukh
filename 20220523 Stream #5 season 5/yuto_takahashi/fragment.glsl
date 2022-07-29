

uniform mat3 projectionMatrix;
uniform mat3 filterMatrix;

varying vec2 vTextureCoord;
varying vec2 vFilterCoord;

uniform vec4 inputSize;
uniform vec4 outputFrame;
uniform float uPower;
uniform float uDir;

uniform sampler2D udisplacement;
uniform sampler2D umap;


void main(void) {
 vec2 uv = vFilterCoord;
 vec4 disp = texture2D(udisplacement, uv);
 vec4 color = texture2D(umap, vec2(uv.x,uv.y - 0.1*disp.r*uDir*uPower));
 gl_FragColor = vec4(uv,0.,1.);
 gl_FragColor = color;
}