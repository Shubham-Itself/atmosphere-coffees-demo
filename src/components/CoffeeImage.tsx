'use client';
import { Billboard, Html, useTexture } from '@react-three/drei';
import * as THREE from 'three';
interface CoffeeImageProps {
  image: string;
  name: string;
  index: string;
  width?: number;
  height?: number;
}
export default function CoffeeImage({
  image,
  name,
  index,
  width = 0.34,
  height = 0.5,
}: CoffeeImageProps) {
  const texture = useTexture(image);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  return (
    <group>
      <Billboard follow>
        <mesh>
          <planeGeometry args={[width, height]} />
          <meshBasicMaterial
            map={texture}
            transparent
            alphaTest={0.01}
            side={THREE.DoubleSide}
            toneMapped={false}
          />
        </mesh>
      </Billboard>
      <Html
        center
        position={[0, height / 2 + 0.08, 0]}
        style={{
          pointerEvents: 'none',
          userSelect: 'none',
        }}
        zIndexRange={[5, 0]}
      >
        <span className="label whitespace-nowrap text-espresso/70">
          {index} {name}
        </span>
      </Html>
    </group>
  );
}