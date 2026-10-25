'use client';

import { Suspense, useLayoutEffect, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import {
  Environment,
  Html,
  OrbitControls,
  useGLTF,
} from '@react-three/drei';
import * as THREE from 'three';

function Sachet() {
  const { scene } = useGLTF(
    '/models/atmosphere-coffees-energize.glb'
  );

  const model = useMemo(() => {
    const clone = scene.clone(true);

    // Determine the model's original dimensions.
    clone.updateMatrixWorld(true);

    const box = new THREE.Box3().setFromObject(clone);
    const size = box.getSize(new THREE.Vector3());

    // The longest dimension should become vertical (Y).
    let rotation: [number, number, number] = [0, 0, 0];

    if (size.z > size.y && size.z >= size.x) {
      // Height runs along Z: rotate it onto Y.
      rotation = [-Math.PI / 2, 0, 0];
    } else if (size.x > size.y && size.x >= size.z) {
      // Height runs along X: rotate it onto Y.
      rotation = [0, 0, Math.PI / 2];
    }

    const wrapper = new THREE.Group();
    wrapper.rotation.set(...rotation);
    wrapper.add(clone);

    // Center the rotated model around the origin.
    wrapper.updateMatrixWorld(true);

    const rotatedBox = new THREE.Box3().setFromObject(wrapper);
    const center = rotatedBox.getCenter(new THREE.Vector3());

    wrapper.position.sub(center);

    return wrapper;
  }, [scene]);

  useLayoutEffect(() => {
    model.traverse((object) => {
      if (!(object instanceof THREE.Mesh)) return;

      object.castShadow = true;
      object.receiveShadow = true;

      const materials = Array.isArray(object.material)
        ? object.material
        : [object.material];

      materials.forEach((material) => {
        material.side = THREE.DoubleSide;
        material.needsUpdate = true;
      });
    });
  }, [model]);

  return (
    <primitive object={model} />
  );
}

function Loader() {
  return (
    <Html center>
      <div className="whitespace-nowrap text-sm text-neutral-700">
        Loading coffee model...
      </div>
    </Html>
  );
}

export default function CoffeeModel() {
  return (
    <div className="h-[650px] w-full">
      <Canvas
        camera={{
          position: [0, 0, 5],
          fov: 35,
          near: 0.1,
          far: 100,
        }}
        dpr={[1, 1.75]}
        gl={{
          alpha: true,
          antialias: true,
          powerPreference: 'high-performance',
        }}
      >
        <ambientLight intensity={1.4} />

        <directionalLight
          position={[3, 5, 5]}
          intensity={2.2}
        />

        <directionalLight
          position={[-4, 2, 3]}
          intensity={1.2}
        />

        <Suspense fallback={<Loader />}>
          <Sachet />
          <Environment preset="studio" />
        </Suspense>

        <OrbitControls
          makeDefault
          enableZoom={false}
          enablePan={false}
          enableDamping
          dampingFactor={0.08}
          autoRotate={false}
          target={[0, 0, 0]}
        />
      </Canvas>
    </div>
  );
}

useGLTF.preload(
  '/models/atmosphere-coffees-energize.glb'
);