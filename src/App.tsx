import { Physics, PublicApi, useBox } from '@react-three/cannon'
import './App.css'

import { ThreeElements, Canvas } from '@react-three/fiber'
import { Stats, OrbitControls } from '@react-three/drei'
import { useEffect } from 'react'

import * as THREE from 'three'

const part1: PublicApi[] = []
const part2: PublicApi[] = []


function Part1(props: ThreeElements['mesh']) {
  const pos = [Math.random() * 10, Math.random() * 10, Math.random() * 10]
  const [ref, api] = useBox(() => ({
    mass: 1,
    // @ts-expect-error: ts's type engine sucks
    position: pos,
    // velocity: [Math.random() * 10, Math.random(), Math.random()],
     ...props
  }))
  part1.push(api)

  useEffect(() => {
    // set binded to the api.position
    const unsubscribe = api.position.subscribe(pos => {
      if (pos[0] > 50) {
        api.position.set(0, pos[1], pos[2])
      } else if (pos[1] < 0) {
        api.position.set(pos[0], 50, pos[2])
      }
      if (pos[1] > 50) {
        api.position.set(pos[0], 0, pos[2])
      } else if (pos[1] < 0) {
        api.position.set(pos[0], 50, pos[2])
      }
      if (pos[2] > 50) {
        api.position.set(pos[0], pos[1], 0)
      } else if (pos[2] < 0) {
        api.position.set(pos[0], pos[1], 50)
      }

      for (const other of part1) {
        if (other === api) continue
        const otherPos = new THREE.Vector3()
        other.position.subscribe(otherPosTri =>{
          otherPos.set(...pos)
          const direc = otherPos.sub(new THREE.Vector3(...pos)).normalize()
          const dist = direc.length()
          const force = direc.multiplyScalar(1 / dist)

          other.applyForce(force.toArray(), pos)
        }
        
        )

        
      }
    })


    return unsubscribe
  }, [api])

  return (
    
    <mesh
      // @ts-expect-error: but it works!
      ref={ref}
    >
      <boxGeometry />
      <meshStandardMaterial />
    </mesh>
  )
}

function Part2(props: ThreeElements['mesh']) {
  const pos = [Math.random() * 50, Math.random() * 50, Math.random() * 50]
  const [ref, api] = useBox(() => ({
    mass: 1,
    // @ts-expect-error: ts's type engine sucks
    position: pos,
    velocity: [Math.random() * 10, Math.random(), Math.random()],
     ...props
  }))
  part2.push(api)

  useEffect(() => {
    // set binded to the api.position
    const unsubscribe = api.position.subscribe((pos) => {
      if (pos[0] > 50) {
        api.position.set(0, pos[1], pos[2])
      } else if (pos[1] < 0) {
        api.position.set(pos[0], 50, pos[2])
      }
      if (pos[1] > 50) {
        api.position.set(pos[0], 0, pos[2])
      } else if (pos[1] < 0) {
        api.position.set(pos[0], 50, pos[2])
      }
      if (pos[2] > 50) {
        api.position.set(pos[0], pos[1], 0)
      } else if (pos[2] < 0) {
        api.position.set(pos[0], pos[1], 50)
      }
    })
    return unsubscribe
  }, [api])

  return (
    
    <mesh
      // @ts-expect-error: but it works!
      ref={ref}
    >
      <boxGeometry />
      <meshStandardMaterial />
    </mesh>
  )
}

function App() {

  const part1base = Array.from({ length: 2 }, i => i)
  const part2base = Array.from({ length: 0 }, i => i)


  return (
    <Canvas>
      <ambientLight intensity={Math.PI / 2} />
    <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} />
    <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
    <Physics
      gravity={[0, 0, 0]}
    >
      {/* <Plane /> */}
      {part1base.map((_, i) => <Part1 key={i} />)}
      {part2base.map((_, i) => <Part2 key={i} />)}
    </Physics>
    <OrbitControls />
    <Stats />
  </Canvas>
  )
}

export default App
