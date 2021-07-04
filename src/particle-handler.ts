import * as THREE from 'three'

import { Scene3D } from 'enable3d'
import ParticleBase from './particle-base'

export default class ParticleHandler {
  scene3d: Scene3D

  particles: Array<ParticleBase>

  constructor(scene3d: Scene3D) {
    this.scene3d = scene3d

    this.particles = []
  }

  addParticle(particle: ParticleBase) {
    this.scene3d.scene.add(particle)
    this.scene3d.physics.add.existing(particle)

    this.particles.push(particle)
  }

  updateForce() {
    for (let start of this.particles) {
      for (let end of this.particles) {
        if (start == end) {
          continue
        }

        start.reaction(end)
      }
    }
  }

  updateFriction() {
    for (let particle of this.particles) {
      particle.update()
    }
  }
}