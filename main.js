import * as THREE from 'three';

const canvas = document.getElementById('canvas');

// Create the scene
const scene = new THREE.Scene();

// Create the camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

// Create the renderer and set its size to the window size
const renderer = new THREE.WebGLRenderer({canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);


// Define a variable to store the previous mouse position
let prevMousePos = new THREE.Vector2();

// Add a mousemove event listener to the renderer's DOM element
renderer.domElement.addEventListener('mousemove', (event) => {
  // Calculate the current mouse position relative to the renderer's DOM element
  const currentMousePos = new THREE.Vector2(
    (event.clientX / window.innerWidth) * 2 - 1,
    -(event.clientY / window.innerHeight) * 2 + 1
  );

  // Calculate the difference between the current and previous mouse positions
  const mouseDelta = new THREE.Vector2().subVectors(currentMousePos, prevMousePos);

  // Move the camera slightly in the mouse's direction
  const cameraMoveSpeed = 0.5;
  camera.position.add(new THREE.Vector3(mouseDelta.x, mouseDelta.y, 0).multiplyScalar(cameraMoveSpeed));

  

  // Store the current mouse position as the previous mouse position for the next frame
  prevMousePos = currentMousePos;
});

// Listen for the mousewheel event
window.addEventListener('wheel', onMouseWheel);


// Define the onMouseWheel function
function onMouseWheel(event) {

  camera.lookAt(0,0,0);
  // Adjust the camera's position based on the scroll delta
  camera.position.z += event.deltaY * 0.1;

  // Limit the camera's position to prevent zooming too far in or out
  camera.position.z = Math.max(15, Math.min(300, camera.position.z));
}



// Append the renderer to the DOM
document.body.appendChild(renderer.domElement);


// Create the stars
const numStars = 5000;
const radius = 500;
const starColors = [0xffffff];
let starPositions = [];

for (let i = 0; i < numStars; i++) {
  const u = Math.random();
  const v = Math.random();
  const theta = 2 * Math.PI * u;
  const phi = Math.acos(2 * v - 1);
  const x = radius * Math.sin(phi) * Math.cos(theta);
  const y = radius * Math.sin(phi) * Math.sin(theta);
  const z = radius * Math.cos(phi);
  const starGeometry = new THREE.SphereGeometry(0.5, 8, 8);
  const starMaterial = new THREE.MeshBasicMaterial({
    color: starColors[Math.floor(Math.random() * starColors.length)]
  });
  const star = new THREE.Mesh(starGeometry, starMaterial);
  star.position.set(x, y, z);
  starPositions.push(star.position);
  scene.add(star);
}

// Create some stars inside the sphere
const numInnerStars = 5000;
for (let i = 0; i < numInnerStars; i++) {
  const x = (Math.random() - 0.5) * radius;
  const y = (Math.random() - 0.5) * radius;
  const z = (Math.random() - 0.5) * radius;
  const starGeometry = new THREE.SphereGeometry(0.5, 8, 8);
  const distanceFromCenter = new THREE.Vector3(x, y, z).distanceTo(new THREE.Vector3(0, 0, 0));
  const starSize = distanceFromCenter < 250 ? 0.5 : 0; // Set larger size for stars in the middle
  const starMaterial = new THREE.MeshBasicMaterial({
    color: starColors[Math.floor(Math.random() * starColors.length)]
  });
  const star = new THREE.Mesh(starGeometry, starMaterial);
  star.scale.set(starSize, starSize, starSize);
  star.position.set(x, y, z);
  scene.add(star);
}

// Position the camera in the middle of the stars
const cameraPosition = starPositions.reduce((acc, curr) => acc.add(curr), new THREE.Vector3()).divideScalar(numStars);
camera.position.copy(cameraPosition);
camera.lookAt(0, 0, 0);

// Animate the scene
function animate() {


  requestAnimationFrame(animate);


  // Render the scene
  renderer.render(scene, camera);
}
animate();

//h1 animation

const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

let interval = null;

document.querySelector("h1").onmouseover = event => {  
  let iteration = 0;
  
  clearInterval(interval);
  
  interval = setInterval(() => {
    event.target.innerText = event.target.innerText
      .split("")
      .map((letter, index) => {
        if(index < iteration) {
          return event.target.dataset.value[index];
        }
      
        return letters[Math.floor(Math.random() * 26)]
      })
      .join("");
    
    if(iteration >= event.target.dataset.value.length){ 
      clearInterval(interval);
    }
    
    iteration += 1 / 3;
  }, 30);
}

/////////////////////////////////////////////////////////////////////////