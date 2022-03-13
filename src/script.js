import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import { DoubleSide } from 'three'

import './style.css'

// Textures
const textureLoader = new THREE.TextureLoader()

const doorColorTexture = textureLoader.load('/textures/door/color.jpg')
const doorAlphaTexture = textureLoader.load('/textures/door/alpha.jpg')
const doorAmbientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg')
const doorHeightTexture = textureLoader.load('/textures/door/height.jpg')
const doorNormalTexture = textureLoader.load('/textures/door/normal.jpg')
const doorMetalnessTexture = textureLoader.load('/textures/door/metalness.jpg')
const doorRoughnessTexture = textureLoader.load('/textures/door/roughness.jpg')

const GLOBAL_PARAMS = {
  width: window.innerWidth,
  height: window.innerHeight,
  doorHeight: 1,
  doorWidth: 1,
  color: 0xffffff
}

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
scene.add(ambientLight)

const pointLight = new THREE.PointLight( 0xffffff, 0.5, 10 );
pointLight.position.set( 2, 2, 4 );

scene.add( pointLight );

// Camera
const camera = new THREE.PerspectiveCamera(75, GLOBAL_PARAMS.width / GLOBAL_PARAMS.height, 0.1, 100)
camera.position.x = 0
camera.position.y = 0
camera.position.z = 2
scene.add(camera)

// Debug init
const gui = new dat.GUI()


// Mesh
const material = new THREE.MeshStandardMaterial({
  metalness: 0,
  metalnessMap: doorMetalnessTexture,

  roughness: 1,
  roughnessMap: doorRoughnessTexture.addEventListener,

  map: doorColorTexture,
  aoMap: doorAmbientOcclusionTexture,
  aoMapIntensity: 1,

  displacementMap: doorHeightTexture,
  displacementScale: 0.05,
  
  normalMap: doorNormalTexture,
  alphaMap: doorAlphaTexture,
  transparent: true,
  side: DoubleSide,
  color: GLOBAL_PARAMS.color
})

material.normalScale.set(0.5, 0.5)

const doorGeometry = new THREE.PlaneBufferGeometry(1, 1, 100, 100)

const plane = new THREE.Mesh(
  doorGeometry,
  material
)

plane.geometry.setAttribute('uv2', new THREE.BufferAttribute(plane.geometry.attributes.uv.array, 2))
scene.add(plane)

// Debug options
gui.add(material, 'metalness').min(0).max(1).step(0.0001)
gui.add(material, 'roughness').min(0).max(1).step(0.0001)
gui.add(material, 'displacementScale').min(0).max(1).step(0.0001)
gui.add(material, 'aoMapIntensity').min(0).max(10).step(0.001)
gui.add(material, 'wireframe')

gui.addColor(GLOBAL_PARAMS, 'color').onChange(() => {
  material.color.set(GLOBAL_PARAMS.color)
})

gui.add(plane.geometry.parameters, 'width').min(1).max(3).step(0.01).name('plane width').onChange((newWidth) => {
  GLOBAL_PARAMS.doorWidth = newWidth
  plane.geometry.dispose()
  plane.geometry = new THREE.PlaneBufferGeometry(GLOBAL_PARAMS.doorWidth, GLOBAL_PARAMS.doorHeight, 100, 100)
  plane.geometry.setAttribute('uv2', new THREE.BufferAttribute(plane.geometry.attributes.uv.array, 2))
})

gui.add(plane.geometry.parameters, 'height').min(1).max(3).step(0.01).name('plane height').onChange((newHeight) => {
  GLOBAL_PARAMS.doorHeight = newHeight
  plane.geometry.dispose()
  plane.geometry = new THREE.PlaneBufferGeometry(GLOBAL_PARAMS.doorWidth, GLOBAL_PARAMS.doorHeight, 100, 100)
  plane.geometry.setAttribute('uv2', new THREE.BufferAttribute(plane.geometry.attributes.uv.array, 2))
})

// Window sizes
window.addEventListener('resize', () =>
{
    // Update sizes
    GLOBAL_PARAMS.width = window.innerWidth
    GLOBAL_PARAMS.height = window.innerHeight

    // Update camera
    camera.aspect = GLOBAL_PARAMS.width / GLOBAL_PARAMS.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(GLOBAL_PARAMS.width, GLOBAL_PARAMS.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(GLOBAL_PARAMS.width, GLOBAL_PARAMS.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// Animate 
const tick = () => {
  controls.update()
  // Render
  renderer.render(scene, camera)
  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()