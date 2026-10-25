"use client";

import {
  useEffect,
  useMemo,
  useRef,
  type MutableRefObject,
} from "react";

import {
  Canvas,
  useFrame,
  useThree,
} from "@react-three/fiber";

import {
  Environment,
  Lightformer,
  useTexture,
  Billboard,
} from "@react-three/drei";

import * as THREE from "three";

import { moods } from "@/lib/moods";

/**
 * Maps each mood to its existing transparent WebP image.
 * Images are served from the public directory.
 */
const MOOD_IMAGES: Record<string, string> = {
  focus: "/main-images/focus-final.webp",
  uplift: "/main-images/uplift-final.webp",
  calm: "/main-images/calm-final.webp",
  energize: "/main-images/energize-final.webp",
  indulge: "/main-images/indulge-final.webp",
};

/**
 * Preload the images before rendering the carousel.
 */
function CoffeeBags({
  target,
  reduced,
}: {
  target: MutableRefObject<number>;
  reduced: boolean;
}) {
  const cur = useRef(0);

  const groups = useRef<(THREE.Group | null)[]>([]);

  const light = useRef<THREE.PointLight>(null);

  const tmp = useMemo(() => new THREE.Color(), []);

  const yOff = useThree((s) =>
    s.size.width < 768 ? 0.8 : 0
  );

  /**
   * Load actual coffee package images in the same order
   * as the moods array.
   */
  const imagePaths = useMemo(
    () => moods.map((m) => MOOD_IMAGES[m.id]),
    []
  );

  const textures = useTexture(imagePaths);

  /**
   * Preserve image colors and improve texture quality.
   */
  useEffect(() => {
    textures.forEach((texture) => {
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.anisotropy = 8;
      texture.needsUpdate = true;
    });
  }, [textures]);

  /**
   * Dispose resources when the component unmounts.
   */
  useEffect(() => {
    return () => {
      textures.forEach((texture) => texture.dispose());
    };
  }, [textures]);

  /**
   * Preserve the existing carousel animation.
   */
  useFrame((state, dt) => {
    cur.current +=
      (target.current - cur.current) *
      (1 - Math.exp(-dt * 4));

    const time = state.clock.elapsedTime;

    groups.current.forEach((group, i) => {
      if (!group) return;

      const distance = i - cur.current;
      const absDistance = Math.abs(distance);

      const isFront =
        absDistance < 0.5 && !reduced;

      group.position.set(
        distance * 2.6,
        yOff +
          (reduced
            ? 0
            : Math.sin(time * 0.8 + i) *
              0.06 *
              (1 - Math.min(absDistance, 1))),
        -absDistance * 1.7
      );

      group.rotation.y +=
        (
          -distance * 0.5 +
          (isFront ? state.pointer.x * 0.4 : 0) -
          group.rotation.y
        ) * Math.min(1, dt * 6);

      group.rotation.x +=
        (
          (isFront ? -state.pointer.y * 0.1 : 0) -
          group.rotation.x
        ) * Math.min(1, dt * 6);

      group.scale.setScalar(
        1 - Math.min(absDistance, 2) * 0.12
      );
    });

    const activeMood = moods[
      Math.min(
        moods.length - 1,
        Math.max(0, Math.round(cur.current))
      )
    ];

    if (activeMood && light.current) {
      light.current.color.lerp(
        tmp.set(activeMood.accent),
        Math.min(1, dt * 3)
      );
    }
  });

  return (
    <>
      <pointLight
        ref={light}
        position={[0, 1.5, 3]}
        intensity={25}
        distance={12}
      />

      {moods.map((m, i) => (
        <group
          key={m.id}
          ref={(el) => {
            groups.current[i] = el;
          }}
        >
          {/*
            Billboard keeps the image facing the camera
            as the carousel moves around the scene.
          */}
          <Billboard follow>
            <mesh>
              <planeGeometry args={[1.3, 1.9]} />

              <meshBasicMaterial
                map={textures[i]}
                transparent
                alphaTest={0.01}
                side={THREE.DoubleSide}
                toneMapped={false}
              />
            </mesh>
          </Billboard>
        </group>
      ))}
    </>
  );
}

export default function ShowcaseScene({
  target,
  reduced,
  visible,
}: {
  target: MutableRefObject<number>;
  reduced: boolean;
  visible: boolean;
}) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{
        position: [0, 0, 6.8],
        fov: 35,
      }}
      frameloop={visible ? "always" : "never"}
      gl={{
        antialias: true,
        alpha: true,
      }}
    >
      <ambientLight intensity={0.55} />

      <directionalLight
        position={[-3, 4, 4]}
        intensity={2}
      />

      <Environment resolution={128}>
        <Lightformer
          form="rect"
          intensity={2}
          position={[0, 4, 3]}
          scale={[8, 2, 1]}
        />
      </Environment>

      <CoffeeBags
        target={target}
        reduced={reduced}
      />
    </Canvas>
  );
}

useTexture.preload([
  "/main-images/focus-final.webp",
  "/main-images/uplift-final.webp",
  "/main-images/calm-final.webp",
  "/main-images/energize-final.webp",
  "/main-images/indulge-final.webp",
]);