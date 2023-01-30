/* eslint-disable simple-import-sort/imports */
import fragment from './shaders/fragment.glsl';
import vertex from './shaders/vertex.glsl';
import { gsap } from 'gsap';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

console.log('/// threeJS ///');

export default class Sketch {
  constructor() {
    this.time = 0;
    this.container = document.getElementById('threeSection');

    this.gridSize = 1;
    this.size = 50;
    this.cellSize = this.gridSize / this.size;

    this.init();
    this.createControls();
    this.addObject();
    this.setupResize();
    this.resize();
    this.render();
  }

  init() {
    // Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('threeSection').appendChild(this.renderer.domElement);

    // Camera
    this.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 10);
    this.camera.position.z = 1;

    // Scene
    this.scene = new THREE.Scene();
  }

  createControls() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
  }

  addObject() {
    this.geometry = new THREE.PlaneGeometry(this.cellSize, this.cellSize);
    // this.material = new THREE.MeshNormalMaterial({ side: THREE.DoubleSide });
    this.material = new THREE.ShaderMaterial({
      side: THREE.DoubleSide,
      vertexShader: vertex,
      fragmentShader: fragment,
    });
    this.plane = new THREE.InstancedMesh(this.geometry, this.material, this.size ** 2);

    let dummy = new THREE.Object3D();
    let count = 0;

    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        dummy.position.set(i * this.cellSize, j * this.cellSize);
        dummy.updateMatrix();
        this.plane.setMatrixAt((count += 1), dummy.matrix);
      }
    }
    this.plane.instanceMatrix.needsUpdate = true;

    this.mesh = new THREE.Mesh(this.geometry, this.shaderMaterial);
    this.scene.add(this.plane);
  }

  setupResize() {
    window.addEventListener('resize', this.resize.bind(this));
  }

  resize() {
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.renderer.setSize(this.width, this.height);
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
  }

  render() {
    // this.time += 1;
    // this.mesh.rotation.x += 0.001;
    // this.mesh.rotation.y += 0.003;

    this.controls.update();

    this.renderer.render(this.scene, this.camera);
    window.requestAnimationFrame(this.render.bind(this));
  }
}

new Sketch();
