import * as THREE from 'three'

import { ExtendedObject3D } from 'enable3d'

import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial'
import { Wireframe } from 'three/examples/jsm/lines/Wireframe'
import { WireframeGeometry2 } from 'three/examples/jsm/lines/WireframeGeometry2'

export default class ParticleBase extends ExtendedObject3D {
  kind: number
  friction: number
  protected _frictionForce: THREE.Vector3

  protected _v: THREE.Vector3

  worldRange: number

  constructor(kind: number=0, friction: number=0.1, color: number=0xFFFFFF, worldRange: number=100) {
    super()

    this.kind = kind
    this.friction = friction
    this._frictionForce = new THREE.Vector3()

    this.worldRange = worldRange

    this._v = new THREE.Vector3()

    const geometry = new THREE.SphereGeometry(0.5, 2, 2)

    const lineGeometry = new WireframeGeometry2(geometry)
    const lineMaterial = new LineMaterial({color: color, linewidth: 1.5, dashed: false})
    lineMaterial.resolution.set(window.innerWidth, window.innerHeight)

    const wireframe = new Wireframe(lineGeometry, lineMaterial)
    wireframe.computeLineDistances()
    wireframe.scale.set(1, 1, 1)

    //const mesh = new THREE.Mesh(geometry, material)
    this.add(wireframe)
    //this.add(mesh)
  }

  reaction(particle: ParticleBase) {
    const direction = this._v.subVectors(particle.position, this.position)
    const dist = direction.length()
    let force
    direction.normalize()

    switch (particle.kind) {
      case 0:
        force = (3 * dist * Math.log(1.35) - 15 * Math.log(1.35) - 3) / (1.35 ** (dist - 5))
        if (force < 0) force /= 3
        direction.multiplyScalar( force )
        this.body.applyForce(direction.x, direction.y, direction.z)
        break
      case 1:
        force = (10 * dist * Math.log(1.35) - 100 * Math.log(1.35) - 10) / (1.35 ** (dist - 5))
        direction.multiplyScalar( force )
        this.body.applyForce(direction.x, direction.y, direction.z)
        break
      case 2:
        force = (3 * dist * Math.log(1.35) - 30 * Math.log(1.35) - 3) / (1.35 ** (dist - 10))
        if (force < 0) force /= 5
        direction.multiplyScalar( force )
        this.body.applyForce(direction.x, direction.y, direction.z)
        break
      default:
        // pass
        break
    }
  }


  update() {
    // friction
    this._frictionForce.set(this.body.velocity.x, this.body.velocity.y, this.body.velocity.z)
    this._frictionForce.multiplyScalar(-1 * this.friction)
    this.body.applyForce(this._frictionForce.x, this._frictionForce.y, this._frictionForce.z)

    this._frictionForce.set(this.body.angularVelocity.x, this.body.angularVelocity.y, this.body.angularVelocity.z)
    this._frictionForce.multiplyScalar(-1 * this.friction)
    this.body.applyTorque(this._frictionForce.x, this._frictionForce.y, this._frictionForce.z)
  }
}