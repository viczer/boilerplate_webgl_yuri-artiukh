import * as PIXI from 'pixi.js'
import noise from './noise.jpg'
class Sketch{
    constructor(){
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.app = new PIXI.Application({
            backgroundColor: 0x1099bb, 
            // resolution: window.devicePixelRatio || 1,
            resolution: 1,
            resizeTo: window
        });

        document.body.appendChild(this.app.view);
        this.app.view.style.width = this.width + 'px'
        this.app.view.style.height = this.height + 'px'
        
        this.container = new PIXI.Container();
        
        this.app.stage.addChild(this.container);

        
        this.addShader() // shader
        this.add() // graphics
        this.resize()
        this.setupResize()
        this.render()
    }

    add(){
        let block = new PIXI.Sprite(PIXI.Texture.WHITE);
        block.tint = 0xff0000;
        block.width = 100;
        block.height = 100;

        this.container.addChild(block)
    }

    addShader(){
        // Build geometry.
        const geometry = new PIXI.Geometry()
        .addAttribute('aVertexPosition', // the attribute name
            [-100, -100, // x, y
                100, -100, // x, y
                100, 100,
                -100, 100], // x, y
            2) // the size of the attribute
        .addAttribute('aUvs', // the attribute name
            [0, 0, // u, v
                1, 0, // u, v
                1, 1,
                0, 1], // u, v
            2) // the size of the attribute
        .addIndex([0, 1, 2, 0, 2, 3]);

        const vertexSrc = `

        precision mediump float;

        attribute vec2 aVertexPosition;
        attribute vec2 aUvs;

        uniform mat3 translationMatrix;
        uniform mat3 projectionMatrix;

        varying vec2 vUvs;

        void main() {
            vUvs = aUvs;
            gl_Position = vec4((projectionMatrix * translationMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);
        }`;
        const fragmentSrc = `
        precision mediump float;

        varying vec2 vUvs;

        uniform sampler2D noise;
        uniform float time;
        void main()
        {
            vec2 uv = vec2(vUvs.x,1.-vUvs.y);
            vec4 tt = texture2D(noise,vUvs);

            
            gl_FragColor = vec4(vUvs,0., 1.);
            gl_FragColor = tt;
        }`;

        const uniforms = {
            noise: PIXI.Texture.from(noise),
            time: 0,
        };
        // Make sure repeat wrap is used and no mipmapping.
        uniforms.noise.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;
        uniforms.noise.baseTexture.mipmap = false;

        // Build the shader and the quad.
        const shader = PIXI.Shader.from(vertexSrc, fragmentSrc, uniforms);
        this.quad = new PIXI.Mesh(geometry, shader);
        this.quad.position.set(this.width/2, this.height/2);
        this.quad.scale.set(2,4);
        this.quad.scale.set(4,2);

        this.app.stage.addChild(this.quad);
    }

    setupResize() {
      window.addEventListener("resize", this.resize.bind(this));
    }

    resize(){
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.quad.scale.set(this.width/200,this.height/200)
        this.quad.position.set(this.width/2, this.height/2);
        this.app.view.style.width = this.width + 'px'
        this.app.view.style.height = this.height + 'px'
    }

    
    render(){
        this.app.ticker.add((delta) => {
            // rotate the container!
            // use delta to create frame-independent transform
            // container.rotation -= 0.01 * delta;
            // console.log(delta);
        });
        
    }
}


new Sketch();