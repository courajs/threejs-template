import * as THREE from "/js/three/build/three.module.js";
Object.entries(THREE).forEach(([k,v]) => {
  if (k !== 'Math') {
    window[k] = v
  }
});

const canvas = document.getElementById('canvas');
let height = canvas.height = canvas.clientHeight;
let width = canvas.width = canvas.clientWidth;
let aspect = width / height;

const renderer = new WebGLRenderer({canvas, alpha: true});

let camera;
{
  const fov = 60;
  const near = 0.1;
  const far = 1000;
  camera = new PerspectiveCamera(fov, aspect, near, far);
  camera.position.z = 3;
}

let scene = new Scene();
{
  const color = 0xFFFFFF;
  const intensity = 1;
  const light = new DirectionalLight(color, intensity);
  light.position.set(-1, 2, 4);
  scene.add(light);
}

const geometry = new BoxGeometry(1, 1, 1);
const edges = new EdgesGeometry(geometry);
const line_mat = new LineBasicMaterial({color: 'black'});

function makeInstance(geo, color, x) {
  const material = new MeshLambertMaterial({color});
  const cube = new Mesh(geometry, material);
  const frame = new LineSegments(edges, line_mat);
  scene.add(cube);
  scene.add(frame);
  cube.position.x = x;
  frame.position.x = x;
  return [cube, frame];
}

const cubes = [
  makeInstance(geometry, 0x44aa88,  0),
  makeInstance(geometry, 0x8844aa, -2),
  makeInstance(geometry, 0xaa8844,  2),
];

const points = [];
points.push(new Vector3(-.5,0,.2));
points.push(new Vector3(0,1,.2));
points.push(new Vector3(.5,0,.2));
let geo = new BufferGeometry().setFromPoints(points);
let mat = new LineBasicMaterial({color: 0x0000FF});
let line = new Line(geo, mat);
scene.add(line);

function resizeRendererToDisplaySize(renderer) {
  const canvas = renderer.domElement;
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  const needResize = canvas.width !== width || canvas.height !== height;
  if (needResize) {
    renderer.setSize(width, height, false);
  }
  return needResize;
}

let paused = false;
let button = document.querySelector('#pause');
function togglePaused() {
  if (paused) {
    paused = false;
    button.textContent = "Pause";
    prevTime = performance.now();
    requestAnimationFrame(render);
  } else {
    paused = true;
    button.textContent = "Resume";
  }
}
button.addEventListener('click', togglePaused);

let clock = 0;
let prevTime = 0;
function render(time) {
  if (paused) return;

  clock += (time - prevTime) / 1000;
  prevTime = time;

  if (resizeRendererToDisplaySize(renderer)) {
    const canvas = renderer.domElement;
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
  }

  cubes.forEach(([cube, frame], ndx) => {
    let speed = .5 + ndx * .5;
    let rot = clock * speed;
    cube.rotation.x = rot;
    cube.rotation.z = rot;
    frame.rotation.x = rot;
    frame.rotation.z = rot;
  });

  renderer.render(scene, camera);

  requestAnimationFrame(render);
}

requestAnimationFrame(render);
