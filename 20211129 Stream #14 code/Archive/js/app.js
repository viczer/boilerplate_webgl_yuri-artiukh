import * as THREE from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import fragment from "./shader/fragment.glsl";
import vertex from "./shader/vertex.glsl";
import * as dat from "dat.gui";
import gsap from "gsap";

import front from '../front.png'
import back from '../back.png'


export default class Sketch {
  constructor(options) {
    this.scene = new THREE.Scene();

    this.container = options.dom;
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.renderer.setSize(this.width, this.height);
    this.renderer.setClearColor(0xeeeeee, 1); 
    this.renderer.physicallyCorrectLights = true;
    this.renderer.outputEncoding = THREE.sRGBEncoding;

    this.container.appendChild(this.renderer.domElement);

    this.camera = new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      0.001,
      1000
    );

    this.camera.position.set(0, 0, 2);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.time = 0;

    this.isPlaying = true;
    
    this.addObjects();
    this.resize();
    this.render();
    this.setupResize();
    this.addLights()
    // this.settings();
  }


  addLights(){

    this.scene.add(new THREE.AmbientLight(0xffffff,0.86))

    let dirLight = new THREE.DirectionalLight(0xffffff,5)
    dirLight.position.set(0,-10,-10)
    this.scene.add(dirLight)
  }

  settings() {
    let that = this;
    this.settings = {
      progress: 0,
    };
    this.gui = new dat.GUI();
    this.gui.add(this.settings, "progress", 0, 1, 0.01);
  }

  setupResize() {
    window.addEventListener("resize", this.resize.bind(this));
  }

  resize() {
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.renderer.setSize(this.width, this.height);
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
  }

  addObjects() {

    let frontTexture = new THREE.TextureLoader().load(front);
    let backTexture = new THREE.TextureLoader().load(back);

    [frontTexture,backTexture].forEach(t=>{
      t.wrapS = 1000;
      t.wrapT = 1000;
      t.repeat.set(1,1);
      t.offset.setX(0.5)
      t.flipY = false
    })

    backTexture.repeat.set(-1,1)
    // frontTexture.flipY = false


    let frontMaterial = new THREE.MeshStandardMaterial({
      map: frontTexture,
      side: THREE.BackSide,
      roughness: 0.65,
      metalness: 0.25,
      alphaTest: true,
      flatShading: true
    })

    let backMaterial = new THREE.MeshStandardMaterial({
      map: backTexture,
      side: THREE.FrontSide,
      roughness: 0.65,
      metalness: 0.25,
      alphaTest: true,
      flatShading: true
    })


    




    this.geometry = new THREE.SphereBufferGeometry(1, 30,30);
    this.plane = new THREE.Mesh(this.geometry, new THREE.MeshBasicMaterial({color: 0x00ff00,wireframe: true}));
    this.scene.add(this.plane);



    let num = 7;
    let curvePoints = []
    for (let i = 0; i < num; i++) {
      let theta = i/num * Math.PI*2;
        curvePoints.push(
          new THREE.Vector3().setFromSphericalCoords(
            1, Math.PI/2 + 0.9*(Math.random() - 0.5),theta
          )
        )
    }

    const curve = new THREE.CatmullRomCurve3( curvePoints );
    curve.tension = 0.7;
    curve.closed = true;

    const points = curve.getPoints( 50 );
    const geometry = new THREE.BufferGeometry().setFromPoints( points );

    const material = new THREE.LineBasicMaterial( { color : 0xff0000 } );

    // Create the final object to add to the scene
    const curveObject = new THREE.Line( geometry, material );


    this.scene.add(curveObject);

    let number = 1000;

    let frenetFrames = curve.computeFrenetFrames(number, true)
    let spacedPoints = curve.getSpacedPoints(number)
    let tempPlane = new THREE.PlaneBufferGeometry(1,1,number,1)
    let dimensions = [-.1,0.1]

    this.materials = [frontMaterial,backMaterial]

    tempPlane.addGroup(0,6000,0)
    tempPlane.addGroup(0,6000,1)


    console.log(frenetFrames,spacedPoints)
    let point = new THREE.Vector3();
    let binormalShift = new THREE.Vector3();
    let temp2 = new THREE.Vector3();

    let finalPoints = []



    dimensions.forEach(d=>{
      for (let i = 0; i <= number; i++) {
        point = spacedPoints[i];
        binormalShift.add(frenetFrames.binormals[i]).multiplyScalar(d);

        finalPoints.push(
          new THREE.Vector3().copy(point).add(binormalShift)
          )
        
      }
    })

    // finalPoints[number + 1].copy()
    console.log(finalPoints[number + 1],'/number')

    finalPoints[0].copy(finalPoints[number])
    finalPoints[number+1].copy(finalPoints[2*number+1])

    // finalPoints.push(new THREE.Vector3(Math.random(),Math.random(),Math.random()))

    // finalPoints.copy

    tempPlane.setFromPoints(finalPoints)
    console.log(tempPlane,finalPoints)

    // console.log(finalPoints)

    // DO SOMETHING IN HERE



    let finalMesh = new THREE.Mesh(
      tempPlane,
      this.materials 
    )

    this.scene.add(finalMesh);



  }

  render() {
    if (!this.isPlaying) return;
    this.time += 0.001;
    requestAnimationFrame(this.render.bind(this));
    this.renderer.render(this.scene, this.camera);

    this.materials.forEach((m,i)=>{
      m.map.offset.setX(this.time)
      if(i>0){
        m.map.offset.setX(-this.time)
      }
    })
  }
}

new Sketch({
  dom: document.getElementById("container")
});
