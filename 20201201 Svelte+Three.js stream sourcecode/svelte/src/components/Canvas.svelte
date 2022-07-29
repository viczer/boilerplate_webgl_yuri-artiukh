
<script>

    import {afterUpdate,onMount} from "svelte";

    import * as THREE from "three";
    import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
    import load from 'load-asset';
    import gsap from 'gsap'


    class Sketch {
      constructor(canvas,images,start) {
        this.scene = new THREE.Scene();

        this.width = window.innerWidth;
        this.height = window.innerHeight;
        console.log(canvas,'cav')
        this.renderer = new THREE.WebGLRenderer({
            canvas: canvas
        });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(this.width, this.height);
        this.renderer.setClearColor(0xeeeeee, 1); 
        this.renderer.physicallyCorrectLights = true;
        this.renderer.outputEncoding = THREE.sRGBEncoding;



        this.camera = new THREE.PerspectiveCamera(
          70,
          window.innerWidth / window.innerHeight,
          0.001,
          1000
        );

        var frustumSize = 1;
        var aspect = window.innerWidth / window.innerHeight;
        this.camera = new THREE.OrthographicCamera( frustumSize  / - 2, frustumSize  / 2, frustumSize / 2, frustumSize / - 2, -1000, 1000 );

        this.camera.position.set(0, 0, 2);
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.time = 0;

        this.isPlaying = true;

        load.all(images).then((assets)=>{
            this.addObjects();
            for(let key in assets){
                assets[key] = new THREE.Texture(assets[key])
            }

            this.material.uniforms.t1.value = assets[start] || assets["index"];
            this.material.uniforms.t1.value.needsUpdate = true
            this.assets = assets;
            
            this.resize();
            this.render();
            this.setupResize();

        })

        
      }

      changeBG(newpage){
        if(this.animating) {
          this.nextShow = newpage;
          return
        }
        this.animating = true;
        let nextTexture = this.assets[newpage] || this.assets["index"]
        this.material.uniforms.t2.value = nextTexture
        this.material.uniforms.t2.value.needsUpdate = true;

        gsap.to(this.material.uniforms.progress,{
            duration: 1,
            value: 1,
            onComplete:()=>{
                this.material.uniforms.progress.value = 0;
                this.material.uniforms.t1.value = nextTexture;
                this.animating = false;
                if(this.nextShow){
                  this.changeBG(this.nextShow)
                  this.nextShow = null
                  
                }
            }
        })
      }



      setupResize() {
        window.addEventListener("resize", this.resize.bind(this));
      }

      resize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.renderer.setSize(this.width, this.height);
        this.camera.aspect = this.width / this.height;


        // image cover
        this.imageAspect = 1266/1920 ;
        let a1; let a2;
        if(this.height/this.width>this.imageAspect) {
          a1 = (this.width/this.height) * this.imageAspect ;
          a2 = 1;
        } else{
          a1 = 1;
          a2 = (this.height/this.width) / this.imageAspect;
        }

        this.material.uniforms.resolution.value.x = this.width;
        this.material.uniforms.resolution.value.y = this.height;
        this.material.uniforms.resolution.value.z = a1;
        this.material.uniforms.resolution.value.w = a2;


        // optional - cover with quad
        // const dist  = this.camera.position.z;
        // const height = 1;
        // this.camera.fov = 2*(180/Math.PI)*Math.atan(height/(2*dist));

        // // if(w/h>1) {
        // if(this.width/this.height>1){
        //   this.plane.scale.x = this.camera.aspect;
        //   // this.plane.scale.y = this.camera.aspect;
        // } else{
        //   this.plane.scale.y = 1/this.camera.aspect;
        // }

        this.camera.updateProjectionMatrix();


      }

      addObjects() {
        let that = this;
        this.material = new THREE.ShaderMaterial({
          extensions: {
            derivatives: "#extension GL_OES_standard_derivatives : enable"
          },
          side: THREE.DoubleSide,
          uniforms: {
            time: { value: 0 },
            progress: { value: 0 },
            t1: { value: null },
            t2: { value: null },
            resolution: { value: new THREE.Vector4() },
          },
          // wireframe: true,
          // transparent: true,
          vertexShader: `uniform float time;
          varying vec2 vUv;
          varying vec3 vPosition;
          uniform vec2 pixels;
          float PI = 3.141592653589793238;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
          }`,
          fragmentShader: `uniform float time;
          uniform float progress;
          uniform sampler2D t1,t2;
          uniform vec4 resolution;
          varying vec2 vUv;
          varying vec3 vPosition;
          float PI = 3.141592653589793238;
          void main()	{
            vec2 newUV = (vUv - vec2(0.5))*resolution.zw + vec2(0.5);
            vec4 i1 = texture2D(t1,newUV);
            vec4 i2 = texture2D(t2,newUV);
            float dist = distance(i1,i2)/2.;

            //dist = newUV.x + 0.1*sin(newUV.y*10. + time);

            float pr = step(dist,progress);

            vec4 final = mix(
              i1,
              i2,
              pr
            );

            gl_FragColor = final;
          }`
        });

        this.geometry = new THREE.PlaneGeometry(1, 1, 1, 1);

        this.plane = new THREE.Mesh(this.geometry, this.material);
        this.scene.add(this.plane);
      }

      stop() {
        this.isPlaying = false;
      }

      play() {
        if(!this.isPlaying){
          this.render()
          this.isPlaying = true;
        }
      }

      render() {
        if (!this.isPlaying) return;
        this.time += 0.05;
        this.material.uniforms.time.value = this.time;
        requestAnimationFrame(this.render.bind(this));
        this.renderer.render(this.scene, this.camera);
      }
    }
    let sketch;






    export let page;
    let CanvasElement;

    afterUpdate(()=>{
        if(sketch.assets) sketch.changeBG(page)
        console.log(page,'hello from canvas route change')
    })

    onMount(()=>{
        console.log(CanvasElement)
        sketch = new Sketch(CanvasElement,{
            about: "/about.jpg",
            blog: "/blog.jpg",
            contacts: "/contacts.jpg",
            index: "/index.jpg",
        },page)
    })
</script>



<canvas bind:this={CanvasElement} />