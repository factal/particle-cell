import * as THREE from 'three'

import { ExtendedObject3D } from 'enable3d'

import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial'
import { Wireframe } from 'three/examples/jsm/lines/Wireframe'
import { WireframeGeometry2 } from 'three/examples/jsm/lines/WireframeGeometry2'


export const interactionMat: number[][] = []

for (let i=0; i<5; i++) {
  const temp: number[] = []
  for (let j=0; j<5; j++) {
    temp.push(2 * (Math.random() - 0.5))
  }
  interactionMat.push(temp)
}

console.log(interactionMat)

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
    const dist = direction.length() / 50
    let force
    direction.normalize()

    force = calcForce(dist, interactionMat[this.kind][particle.kind])
    direction.multiplyScalar(force)
    this.body.applyForce(direction.x, direction.y, direction.z)
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

export function calcForce(r: number, a: number) {
  const beta = 0.3
  const max = 1
  if (r < beta) {
    return r / beta - 1
  } else if (beta < r && r < max) {
    return a * (1 - Math.abs(2 * r - 1 - beta) / (1 - beta))
  } {
    return 0
  }
}