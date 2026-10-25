"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Billboard } from "@react-three/drei";
import * as THREE from "three";

import { moods } from "@/lib/moods";
import CoffeeImage from "@/components/CoffeeImage";

/* ----------------------------------------
   Coffee images
---------------------------------------- */

const MOOD_IMAGES: Record<string, string> = {
  focus: "/main-images/focus-final.webp",
  uplift: "/main-images/uplift-final.webp",
  calm: "/main-images/calm-final.webp",
  energize: "/main-images/energize-final.webp",
  indulge: "/main-images/indulge-final.webp",
};

/* ----------------------------------------
   Galaxy shader noise
---------------------------------------- */

const NOISE = /* glsl */ `
float h(vec3 p) {
  return fract(
    sin(dot(p, vec3(12.9898, 78.233, 37.719)))
    * 43758.5453
  );
}

float n(vec3 p) {
  vec3 i = floor(p);
  vec3 f = fract(p);

  f = f * f * (3. - 2. * f);

  return mix(
    mix(
      mix(h(i), h(i + vec3(1, 0, 0)), f.x),
      mix(
        h(i + vec3(0, 1, 0)),
        h(i + vec3(1, 1, 0)),
        f.x
      ),
      f.y
    ),
    mix(
      mix(
        h(i + vec3(0, 0, 1)),
        h(i + vec3(1, 0, 1)),
        f.x
      ),
      mix(
        h(i + vec3(0, 1, 1)),
        h(i + vec3(1, 1, 1)),
        f.x
      ),
      f.y
    ),
    f.z
  );
}
`;

/* ----------------------------------------
   Coffee planet
---------------------------------------- */

function Core({ reduced }: { reduced: boolean }) {
  const mat = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
    }),
    []
  );

  useFrame((_, dt) => {
    if (mat.current && !reduced) {
      mat.current.uniforms.uTime.value += dt;
    }
  });

  return (
    <>
      <mesh>
        <sphereGeometry args={[1, 64, 48]} />

        <shaderMaterial
          ref={mat}
          uniforms={uniforms}
          vertexShader={`
            varying vec3 vN;
            varying vec3 vP;

            void main() {
              vN = normalMatrix * normal;
              vP = position;

              gl_Position =
                projectionMatrix *
                modelViewMatrix *
                vec4(position, 1.);
            }
          `}
          fragmentShader={`
            uniform float uTime;
            varying vec3 vN;
            varying vec3 vP;

            ${NOISE}

            void main() {
              vec3 p = normalize(vP);

              float w = n(
                p * 3. + vec3(0., uTime * .05, 0.)
              );

              float b =
                sin((p.y + w * .6) * 14. + uTime * .2)
                * .5 + .5;

              vec3 c = mix(
                vec3(.13, .09, .07),
                vec3(.45, .30, .19),
                b * b
              );

              c = mix(
                c,
                vec3(.78, .70, .60),
                pow(w, 3.) * .5
              );

              float f = pow(
                1. - max(
                  dot(normalize(vN), vec3(0., 0., 1.)),
                  0.
                ),
                2.5
              );

              c += vec3(.91, .39, .10) * f * .85;

              gl_FragColor = vec4(c, 1.);
            }
          `}
        />
      </mesh>

      <mesh scale={1.28}>
        <sphereGeometry args={[1, 48, 32]} />

        <shaderMaterial
          transparent
          depthWrite={false}
          side={THREE.BackSide}
          vertexShader={`
            varying vec3 vN;

            void main() {
              vN = normalMatrix * normal;

              gl_Position =
                projectionMatrix *
                modelViewMatrix *
                vec4(position, 1.);
            }
          `}
          fragmentShader={`
            varying vec3 vN;

            void main() {
              float i = pow(
                max(
                  0.62 - dot(
                    normalize(vN),
                    vec3(0., 0., 1.)
                  ),
                  0.
                ),
                3.
              );

              gl_FragColor = vec4(
                vec3(.95, .55, .2),
                min(i * 1.4, .55)
              );
            }
          `}
        />
      </mesh>
    </>
  );
}

/* ----------------------------------------
   Spiral galaxy stars
---------------------------------------- */

function Stars({
  count,
  reduced,
}: {
  count: number;
  reduced: boolean;
}) {
  const mat = useRef<THREE.ShaderMaterial>(null);

  const data = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const size = new Float32Array(count);

    const cream = new THREE.Color("#B8956A");
    const c = new THREE.Color();

    for (let i = 0; i < count; i++) {
      const arm = i % 5;
      const r = 1.8 + Math.pow(Math.random(), 1.5) * 9;

      const a =
        (arm / 5) * Math.PI * 2 +
        r * 0.55 +
        (Math.random() - 0.5) * (0.25 + r * 0.05);

      pos.set(
        [
          Math.cos(a) * r,
          (Math.random() - 0.5) * 0.35 * (1 + r * 0.1),
          Math.sin(a) * r,
        ],
        i * 3
      );

      c.set(moods[arm].accent).lerp(
        cream,
        Math.random() * 0.5
      );

      col.set([c.r, c.g, c.b], i * 3);

      size[i] = 0.5 + Math.random() * 1.4;
    }

    return { pos, col, size };
  }, [count]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPx: {
        value: Math.min(
          typeof window === "undefined"
            ? 1
            : window.devicePixelRatio,
          1.5
        ),
      },
    }),
    []
  );

  useFrame((_, dt) => {
    if (mat.current && !reduced) {
      mat.current.uniforms.uTime.value += dt;
    }
  });

  return (
    <points frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[data.pos, 3]}
        />

        <bufferAttribute
          attach="attributes-aColor"
          args={[data.col, 3]}
        />

        <bufferAttribute
          attach="attributes-aSize"
          args={[data.size, 1]}
        />
      </bufferGeometry>

      <shaderMaterial
        ref={mat}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        vertexShader={`
          attribute vec3 aColor;
          attribute float aSize;

          uniform float uTime;
          uniform float uPx;

          varying vec3 vC;

          void main() {
            vC = aColor;

            float r = length(position.xz);
            float a = uTime * .07 / (1. + r * .35);

            float c = cos(a);
            float s = sin(a);

            vec3 p = vec3(
              position.x * c - position.z * s,
              position.y,
              position.x * s + position.z * c
            );

            vec4 mv = modelViewMatrix * vec4(p, 1.);

            gl_PointSize = aSize * uPx * (12. / -mv.z);
            gl_Position = projectionMatrix * mv;
          }
        `}
        fragmentShader={`
          varying vec3 vC;

          void main() {
            float d = length(gl_PointCoord - .5);

            gl_FragColor = vec4(
              vC,
              smoothstep(.5, 0., d) * .75
            );
          }
        `}
      />
    </points>
  );
}

/* ----------------------------------------
   Coffee orbit rings
---------------------------------------- */

function Orbits({ reduced }: { reduced: boolean }) {
  const spin = useRef<(THREE.Group | null)[]>([]);

  // Hooks must be called outside the moods.map() callback.
  const size = useThree((state) => state.size);
  const isMobile = size.width <= 767;

  useFrame((_, dt) => {
    if (reduced) return;

    spin.current.forEach((group, i) => {
      if (group) {
        group.rotation.y += dt * 0.14 / (1 + i * 0.35);
      }
    });
  });

  return (
    <>
      {moods.map((m, i) => {
        const r = 2.5 + i * 0.85;

        return (
          <group
            key={m.id}
            rotation={[
              (i - 2) * 0.13,
              0,
              (i % 2 ? 1 : -1) * 0.07,
            ]}
          >
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[r, 0.004, 6, 160]} />

              <meshBasicMaterial
                color={m.accent}
                transparent
                opacity={0.35}
              />
            </mesh>

            <group
              ref={(el) => {
                spin.current[i] = el;
              }}
              rotation={[0, i * 1.3, 0]}
            >
              <group position={[r, 0, 0]}>
                <Billboard>
                  <CoffeeImage
                    image={MOOD_IMAGES[m.id]}
                    name={isMobile ? "" : m.name}
                    index={isMobile ? "" : m.index}
                    width={0.42}
                    height={0.62}
                  />
                </Billboard>
              </group>
            </group>
          </group>
        );
      })}
    </>
  );
}

/* ----------------------------------------
   Floating coffee beans
---------------------------------------- */

function Beans({
  count,
  reduced,
}: {
  count: number;
  reduced: boolean;
}) {
  const mesh = useRef<THREE.InstancedMesh>(null);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  const beans = useMemo(
    () =>
      Array.from({ length: count }, () => ({
        r: 2 + Math.random() * 6.5,
        ph: Math.random() * 6.28,
        sp:
          (0.05 + Math.random() * 0.12) *
          (Math.random() > 0.5 ? 1 : -1),
        y: (Math.random() - 0.5) * 1.2,
        rot: Math.random() * 6.28,
        tilt: Math.random() * 6.28,
      })),
    [count]
  );

  // Shared positioning logic.
  const place = (t: number) => {
    const instance = mesh.current;

    if (!instance) return;

    beans.forEach((bean, i) => {
      const a = bean.ph + t * bean.sp;

      dummy.position.set(
        Math.cos(a) * bean.r,
        bean.y,
        Math.sin(a) * bean.r * 0.9
      );

      dummy.rotation.set(
        bean.tilt + t * 0.4,
        bean.rot + t * 0.6,
        0
      );

      dummy.scale.set(0.12, 0.078, 0.06);

      dummy.updateMatrix();

      instance.setMatrixAt(i, dummy.matrix);
    });

    instance.instanceMatrix.needsUpdate = true;
  };

  // Initialize positions when the mesh is mounted.
  useEffect(() => {
    place(0);
  }, [beans, dummy]);

  useFrame((state) => {
    if (!reduced) {
      place(state.clock.elapsedTime);
    }
  });

  return (
    <instancedMesh
      ref={mesh}
      args={[undefined, undefined, count]}
      frustumCulled={false}
    >
      <sphereGeometry args={[1, 12, 8]} />

      <meshStandardMaterial
        color="#4a2c1b"
        roughness={0.45}
      />
    </instancedMesh>
  );
}

/* ----------------------------------------
   Main Galaxy component
---------------------------------------- */

export default function Galaxy({
  reduced,
}: {
  reduced: boolean;
}) {
  const group = useRef<THREE.Group>(null);

  const size = useThree((state) => state.size);

  const small = size.width < 768;

  useFrame((state, dt) => {
    const k = Math.min(1, dt * 2.5);

    const scrollProgress =
      typeof window !== "undefined" &&
      window.innerHeight > 0
        ? Math.min(
            window.scrollY / window.innerHeight,
            1.2
          )
        : 0;

    const camera = state.camera;

    camera.position.x +=
      (
        (reduced ? 0 : state.pointer.x * 0.5) -
        camera.position.x
      ) * k;

    camera.position.y +=
      (
        (4.6 - scrollProgress * 2) -
        camera.position.y
      ) * k;

    camera.position.z +=
      (
        ((small ? 15 : 11.5) - scrollProgress * 2.5) -
        camera.position.z
      ) * k;

    camera.lookAt(0, 0, 0);

    if (group.current) {
      group.current.position.x +=
        (
          (small ? 0 : 2.4) -
          group.current.position.x
        ) * k;

      group.current.position.y +=
        (
          (small ? 1.6 : 0) -
          group.current.position.y
        ) * k;
    }
  });

  return (
    <group ref={group}>
      <ambientLight intensity={0.8} />

      <pointLight
        intensity={45}
        color="#F2A65A"
        distance={20}
      />

      <Core reduced={reduced} />

      <Stars
        count={small ? 700 : 1500}
        reduced={reduced}
      />

      <Orbits reduced={reduced} />

      <Beans
        count={small ? 18 : 36}
        reduced={reduced}
      />
    </group>
  );
}