/* eslint-disable require-jsdoc */
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/orbitcontrols';
import { createNoise2D } from 'simplex-noise';
import front from '@assets/imgs/front.png';
import back from '@assets/imgs/back.png';
import { degToRad } from 'three/src/math/mathutils';

let camera;
let renderer;
let scene;
let controls;

const loader = new THREE.TextureLoader();

const nosie2d = createNoise2D();

const renderSize = {
  width: window.innerWidth,
  height: window.innerHeight
};

const init = (renderSize) => {
  const container = document.getElementById('app');
  // 渲染
  renderer = new THREE.WebGLRenderer({
    antialias: true
  });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(renderSize.width, renderSize.height);
  container.appendChild(renderer.domElement);
  // 场景
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(
    45,
    renderSize.width / renderSize.height,
    1,
    1000
  );
  camera.position.set(71, -81, 312);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.15;
  controls.target.set(0, 0, 0);
  renderer.render(scene, camera);
};

const lights = () => {
  const ambientLight = new THREE.AmbientLight(0xffffff);
  scene.add(ambientLight);
};

const onWindowReSize = () => {
  const width = window.innerWidth;
  const height = window.innerHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
};

const eventsList = {
  resize: () => {
    window.addEventListener('resize', onWindowReSize);
  }
};

const helper = {
  axeHelper: () => {
    const axehelper = new THREE.AxesHelper(100);
    axehelper.material.transparent = false;
    scene.add(axehelper);
  },
  gridHelper: () => {
    const gridHelper = new THREE.GridHelper(100, 100);
    gridHelper.material.opacity = 0.3;
    gridHelper.material.transparent = true;
    scene.add(gridHelper);
  }
};

class Money {
  constructor(frontMap, backMap, name = 'money') {
    const curveRatio = Math.random() * 2 + 2;
    // const curveDirection = Math.random() > 0.5 ? 'up' : 'down';
    this.group = new THREE.Group();
    const geometry = new THREE.PlaneGeometry(15.6, 7.6, 30, 1);
    const frontMaterial = new THREE.MeshLambertMaterial({
      color: 0xffffff,
      side: THREE.FrontSide,
      wireframe: false,
      map: frontMap
    });
    let mesh = new THREE.Mesh(geometry, frontMaterial);
    this.makeCurve(mesh, curveRatio);
    mesh.receiveShadow = true;
    this.group.add(mesh);
    const backMaterial = new THREE.MeshLambertMaterial({
      color: 0xffffff,
      side: THREE.BackSide,
      wireframe: false,
      map: backMap
    });
    mesh = new THREE.Mesh(geometry, backMaterial);
    this.makeCurve(mesh, curveRatio);
    mesh.receiveShadow = true;
    this.group.add(mesh);
    this.group.rotation.x = -degToRad(Math.random() * 90 + 45);
    this.group.rotation.y = degToRad(Math.random() * 40);
    this.group.fallSpeed = {
      x: Math.random() * 2 + 0.5,
      y: Math.random() * 2 + 0.5,
      z: Math.random() * 2 + 0.5
    };
    this.group.rotationSpeed = {
      x: Math.random() * degToRad(10) + degToRad(-5),
      y: Math.random() * degToRad(10) + degToRad(-5),
      z: Math.random() * degToRad(10) + degToRad(-5)
    };
    this.group.name = name;
  }

  makeCurve(mesh, curveRatio) {
    const { geometry } = mesh;
    const positionAttribute = geometry.getAttribute('position');
    const maxiumX = Math.max.apply(
      null,
      positionAttribute.array.filter((_, index) => index % 3 === 0)
    );
    for (let i = 0, l = positionAttribute.count; i < l; i++) {
      const x = positionAttribute.getX(i);
      // This should be z rather than x beacuse plane geometery perdicular to plane xOz as default.
      const z = -Math.sqrt(maxiumX ** 2 - x ** 2) / (maxiumX / curveRatio) ** 2;
      positionAttribute.setZ(i, z);
    }
    positionAttribute.needsUpdate = true;
  }
}

const makeFlow = (geometeryGroup) => {
  geometeryGroup.traverse((object) => {
    const x = object.position.x;
    const y = object.position.y;
    const z = object.position.z;
    const noise = nosie2d(y, z);
    object.position.x = noise * object.position.x;
    object.position.z = noise * object.position.z;
    object.position.y = noise * object.position.y;
  });
};

const addScene = () => {
  const frontMap = loader.load(front);
  const backMap = loader.load(back);
  const rmbGroup = new THREE.Group();
  rmbGroup.name = 'rmbGroup';
  for (let i = 0; i < 1000; i++) {
    const a = new Money(frontMap, backMap, 'rmb');
    a.group.position.set(
      Math.random() * 500 - 250,
      Math.random() * 100 - 50,
      Math.random() * 500 - 250
    );
    rmbGroup.add(a.group);
  }
  makeFlow(rmbGroup);
  rmbGroup.position.y = 100;
  scene.add(rmbGroup);
};

init(renderSize);
lights();
addScene();
// helper.axeHelper();
// helper.gridHelper();
eventsList.resize();

const animate = () => {
  requestAnimationFrame(animate);
  const rmbGroup = scene.getObjectByName('rmbGroup');
  // rmbGroup.rotation.z = rmbGroup.rotation.z + degToRad(0.08);
  rmbGroup.traverse((object) => {
    if (object.name == 'rmb') {
      if (object.position.y + rmbGroup.position.y <= -100) {
        object.fallSpeed.y = 0;
        object.rotationSpeed.x = 0;
      }
      object.position.y -= object.fallSpeed.y;
      object.rotation.x += object.rotationSpeed.x;
    }
  });
  renderer.render(scene, camera);
};

animate();
