import ParticleBase from './particle-base'

export class Particle1 extends ParticleBase {
  constructor() {
    super(1, 0.1, 0x5203fc)
  }

  reaction(particle: ParticleBase) {
    const direction = this._v.subVectors(particle.position, this.position)
    const dist = direction.length() / 2
    direction.normalize()

    let force

    switch (particle.kind) {
      case 0:
        force = (10 * dist * Math.log(1.35) - 100 * Math.log(1.35) - 10) / (1.35 ** (dist - 5))
        direction.multiplyScalar( force )
        this.body.applyForce(direction.x, direction.y, direction.z)
        break
      case 1:
        force = (3 * dist * Math.log(1.35) - 9 * Math.log(1.35) - 3) / (1.35 ** (dist - 3))
        if (force < 0) force /= 3
        direction.multiplyScalar( force )
        this.body.applyForce(direction.x, direction.y, direction.z)
        break
      case 2:
        break
      default:
        // pass
        break
    }
  }
}

export class Particle2 extends ParticleBase {
  constructor() {
    super(2, 0.1, 0x09dea2)
  }

  reaction(particle: ParticleBase) {
    const direction = this._v.subVectors(particle.position, this.position)
    const dist = direction.length() / 2
    direction.normalize()

    let force

    switch (particle.kind) {
      case 0:
        force = (3 * dist * Math.log(1.35) - 30 * Math.log(1.35) - 3) / (1.35 ** (dist - 10))
        if (force < 0) force /= 5
        direction.multiplyScalar( force )
        this.body.applyForce(direction.x, direction.y, direction.z)
        break
      case 1:
        break
      case 2:
        direction.multiplyScalar((4 / dist)**2)
        direction.multiplyScalar(-1)
        this.body.applyForce(direction.x, direction.y, direction.z)
        break
      default:
        // pass
        break
    }
  }
}