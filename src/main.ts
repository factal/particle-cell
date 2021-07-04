import * as THREE from 'three'

import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass'
import { FilmPass } from 'three/examples/jsm/postprocessing/FilmPass'
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader'

import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial'
import { Wireframe } from 'three/examples/jsm/lines/Wireframe'
import { WireframeGeometry2 } from 'three/examples/jsm/lines/WireframeGeometry2'

import { EffectComposer, ExtendedGroup, ExtendedMesh, ExtendedObject3D, PhysicsLoader, Project, RenderPass, Scene3D, ShaderPass } from 'enable3d'

import { Particle1, Particle2 } from './particle'
import ParticleBase from './particle-base'
import ParticleHandler from './particle-handler'

class MainScene extends Scene3D {
  particleHandler: ParticleHandler

  constructor() {
    super()

    this.particleHandler = new ParticleHandler(this)
  }

  async init() {
    // this.physics.debug?.enable()

    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.setSize(window.innerWidth, window.innerHeight)

    this.renderer.toneMapping = THREE.ACESFilmicToneMapping
    this.renderer.toneMappingExposure = 0.7

    const renderPass = new RenderPass(this.scene, this.camera)
    const bloomPass = new UnrealBloomPass(new THREE.Vector2( window.innerWidth, window.innerHeight ), 1.5, 0.4, 0.1 )
    const fxaaPass = new ShaderPass(FXAAShader)
    const filmPass = new FilmPass(0.5, 0.3, 1448, 0)

    this.composer = new EffectComposer(this.renderer)
    this.composer.addPass(renderPass)
    this.composer.addPass(fxaaPass)
    this.composer.addPass(bloomPass)
    this.composer.addPass(filmPass)

    this.physics.setGravity(0, 0, 0)
  }

  async create() {
    await this.warpSpeed('-ground', '-sky')

    
    const createBoundaryBoxes = (range: number) => {
      const boundaryBoxes = new ExtendedObject3D()
    
      const boundaryBoxGeometry = new WireframeGeometry2(new THREE.BoxGeometry(range, range, range))
      const boundaryBoxMaterial = new LineMaterial({linewidth: 1.0, dashed: false})
      boundaryBoxMaterial.resolution.set(window.innerWidth, window.innerHeight)
    
      for (let i=0; i<27; i++) {
        let x=0, y=0, z=0
        switch (i % 3) {
          case 0:
            x = -range
            break
          case 1:
            x = 0
            break
          case 2:
            x = range
            break
        }
        switch (Math.floor(i / 3) % 3) {
          case 0:
            y = -range
            break
          case 1:
            y = 0
            break
          case 2:
            y = range
            break
        }
        switch (Math.floor(i / 9) % 3) {
          case 0:
            z = -range
            break
          case 1:
            z = 0
            break
          case 2:
            z = range
            break
        }
        console.log(i, x, y, z)
        if (x == 0 && y == 0 && z == 0) continue
        
        const box = new Wireframe(boundaryBoxGeometry, boundaryBoxMaterial)
        box.computeLineDistances()
        box.position.set(x, y, z)

        boundaryBoxes.add(box)
      }
      return boundaryBoxes
    }

    const boundary = createBoundaryBoxes(500)
    this.add.existing(boundary)
    this.physics.add.existing(boundary, {collisionFlags: 1, mass: 10000, shape: 'hacd'})

    for (let i=0; i< 200; i++) {
      const particle = new ParticleBase()
      particle.position.set((Math.random() - 1/2) * 200, (Math.random() - 1/2) * 200, (Math.random() - 1/2) * 200)

      this.particleHandler.addParticle(particle)
    }

    for (let i=0; i< 50; i++) {
      const particle = new Particle1()
      particle.position.set((Math.random() - 1/2) * 300 , (Math.random() - 1/2) * 300, (Math.random() - 1/2) * 300)

      this.particleHandler.addParticle(particle)
    }

    for (let i=0; i< 50; i++) {
      const particle = new Particle2()
      particle.position.set((Math.random() - 1/2) * 300 , (Math.random() - 1/2) * 300, (Math.random() - 1/2) * 300)

      this.particleHandler.addParticle(particle)
    }

    // on resize
    const resize = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      this.renderer.setSize(width, height)
      // @ts-ignore
      this.camera.aspect = width / height
      this.camera.updateProjectionMatrix()
    }

    window.onresize = resize
  }

  update() {
    this.particleHandler.updateForce()
    this.particleHandler.updateFriction()
  }
}

const sceneConfig = {
  // alpha: true,
  antialias: true,
  scenes: [MainScene]
}

PhysicsLoader('./ammo', () => new Project(sceneConfig))

