"use client";
import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Html, RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { moods } from "@/lib/moods";
import CoffeeImage from "@/components/CoffeeImage";

const NOISE = /* glsl */ `
float h(vec3 p){return fract(sin(dot(p,vec3(12.9898,78.233,37.719)))*43758.5453);}
float n(vec3 p){vec3 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
return mix(mix(mix(h(i),h(i+vec3(1,0,0)),f.x),mix(h(i+vec3(0,1,0)),h(i+vec3(1,1,0)),f.x),f.y),
mix(mix(h(i+vec3(0,0,1)),h(i+vec3(1,0,1)),f.x),mix(h(i+vec3(0,1,1)),h(i+vec3(1,1,1)),f.x),f.y),f.z);}`;

/** Coffee planet: swirling crema bands with an amber limb. */
function Core({ reduced }: { reduced: boolean }) {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(() => ({ uTime: { value: 0 } }), []);
  
  useFrame((_, dt) => { if (mat.current && !reduced) mat.current.uniforms.uTime.value += dt; });
  return (<>
    <mesh>
      <sphereGeometry args={[1, 64, 48]} />
      <shaderMaterial ref={mat} uniforms={uniforms}
        vertexShader={`varying vec3 vN; varying vec3 vP; void main(){ vN=normalMatrix*normal; vP=position; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }`}
        fragmentShader={`uniform float uTime; varying vec3 vN; varying vec3 vP; ${NOISE}
void main(){ vec3 p=normalize(vP); float w=n(p*3.+vec3(0.,uTime*.05,0.)); float b=sin((p.y+w*.6)*14.+uTime*.2)*.5+.5;
vec3 c=mix(vec3(.13,.09,.07),vec3(.45,.30,.19),b*b); c=mix(c,vec3(.78,.70,.60),pow(w,3.)*.5);
float f=pow(1.-max(dot(normalize(vN),vec3(0.,0.,1.)),0.),2.5); c+=vec3(.91,.39,.10)*f*.85; gl_FragColor=vec4(c,1.); }`} />
    </mesh>
    <mesh scale={1.28}>
      <sphereGeometry args={[1, 48, 32]} />
      <shaderMaterial transparent depthWrite={false} side={THREE.BackSide}
        vertexShader={`varying vec3 vN; void main(){ vN=normalMatrix*normal; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }`}
        fragmentShader={`varying vec3 vN; void main(){ float i=pow(max(0.62-dot(normalize(vN),vec3(0.,0.,1.)),0.),3.); gl_FragColor=vec4(vec3(.95,.55,.2),min(i*1.4,.55)); }`} />
    </mesh>
  </>);
}

/** Spiral galaxy: five arms, one per mood, animated entirely on the GPU. */
function Stars({ count, reduced }: { count: number; reduced: boolean }) {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const data = useMemo(() => {
    const pos = new Float32Array(count * 3), col = new Float32Array(count * 3), size = new Float32Array(count);
    const cream = new THREE.Color("#B8956A"), c = new THREE.Color();
    for (let i = 0; i < count; i++) {
      const arm = i % 5, r = 1.8 + Math.pow(Math.random(), 1.5) * 9;
      const a = (arm / 5) * Math.PI * 2 + r * 0.55 + (Math.random() - 0.5) * (0.25 + r * 0.05);
      pos.set([Math.cos(a) * r, (Math.random() - 0.5) * 0.35 * (1 + r * 0.1), Math.sin(a) * r], i * 3);
      c.set(moods[arm].accent).lerp(cream, Math.random() * 0.5); col.set([c.r, c.g, c.b], i * 3);
      size[i] = 0.5 + Math.random() * 1.4;
    }
    return { pos, col, size };
  }, [count]);
  const uniforms = useMemo(() => ({ uTime: { value: 0 }, uPx: { value: Math.min(typeof window === "undefined" ? 1 : window.devicePixelRatio, 1.5) } }), []);
  useFrame((_, dt) => { if (mat.current && !reduced) mat.current.uniforms.uTime.value += dt; });
  return (
    <points frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[data.pos, 3]} />
        <bufferAttribute attach="attributes-aColor" args={[data.col, 3]} />
        <bufferAttribute attach="attributes-aSize" args={[data.size, 1]} />
      </bufferGeometry>
      <shaderMaterial ref={mat} uniforms={uniforms} transparent depthWrite={false}
        vertexShader={`attribute vec3 aColor; attribute float aSize; uniform float uTime; uniform float uPx; varying vec3 vC;
void main(){ vC=aColor; float r=length(position.xz); float a=uTime*.07/(1.+r*.35); float c=cos(a), s=sin(a);
vec3 p=vec3(position.x*c-position.z*s, position.y, position.x*s+position.z*c); vec4 mv=modelViewMatrix*vec4(p,1.);
gl_PointSize=aSize*uPx*(12./-mv.z); gl_Position=projectionMatrix*mv; }`}
        fragmentShader={`varying vec3 vC; void main(){ float d=length(gl_PointCoord-.5); gl_FragColor=vec4(vC, smoothstep(.5,0.,d)*.75); }`} />
    </points>
  );
}

/** One orbit ring per mood, each carrying a concept coffee pack. */
function Orbits({ reduced }: { reduced: boolean }) {
  const spin = useRef<(THREE.Group | null)[]>([]);
  useFrame((_, dt) => {
    if (reduced) return;
    spin.current.forEach((g, i) => { if (g) g.rotation.y += dt * 0.14 / (1 + i * 0.35); });
  });
  return (<>
    {moods.map((m, i) => {
      const r = 2.5 + i * 0.85;
      const isMobile = useThree((state) => state.size.width <= 767);
      return (
        <group key={m.id} rotation={[(i - 2) * 0.13, 0, (i % 2 ? 1 : -1) * 0.07]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[r, 0.004, 6, 160]} /><meshBasicMaterial color={m.accent} transparent opacity={0.35} /></mesh>
          <group ref={(el) => { spin.current[i] = el; }} rotation={[0, i * 1.3, 0]}>
           <group position={[r, 0, 0]}>

  <CoffeeImage

    image={m.image}

    name={isMobile ? "" : ""}

    index={isMobile? '': ""}

    width={0.42}

    height={0.62}

  />

</group>
          </group>
        </group>);
    })}
  </>);
}

/** Beans on independent elliptical orbits, updated through a single InstancedMesh. */
function Beans({ count, reduced }: { count: number; reduced: boolean }) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const beans = useMemo(() => Array.from({ length: count }, () => ({
    r: 2 + Math.random() * 6.5, ph: Math.random() * 6.28, sp: (0.05 + Math.random() * 0.12) * (Math.random() > 0.5 ? 1 : -1),
    y: (Math.random() - 0.5) * 1.2, rot: Math.random() * 6.28, tilt: Math.random() * 6.28,
  })), [count]);
  const place = (t: number) => {
    const m = mesh.current; if (!m) return;
    beans.forEach((b, i) => {
      const a = b.ph + t * b.sp;
      dummy.position.set(Math.cos(a) * b.r, b.y, Math.sin(a) * b.r * 0.9);
      dummy.rotation.set(b.tilt + t * 0.4, b.rot + t * 0.6, 0);
      dummy.scale.set(0.12, 0.078, 0.06); dummy.updateMatrix(); m.setMatrixAt(i, dummy.matrix);
    });
    m.instanceMatrix.needsUpdate = true;
  };
  useEffect(() => { place(0); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, []);
  useFrame((s) => { if (!reduced) place(s.clock.elapsedTime); });
  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]} frustumCulled={false}>
      <sphereGeometry args={[1, 12, 8]} /><meshStandardMaterial color="#4a2c1b" roughness={0.45} />
    </instancedMesh>
  );
}

export default function Galaxy({ reduced }: { reduced: boolean }) {
  const group = useRef<THREE.Group>(null);
  const size = useThree((s) => s.size);
  const small = size.width < 768;
  useFrame((s, dt) => {
    const k = Math.min(1, dt * 2.5);
    const p = Math.min(window.scrollY / window.innerHeight, 1.2);
    const cam = s.camera;
    cam.position.x += ((reduced ? 0 : s.pointer.x * 0.5) - cam.position.x) * k;
    cam.position.y += ((4.6 - p * 2) - cam.position.y) * k;
    cam.position.z += (((small ? 15 : 11.5) - p * 2.5) - cam.position.z) * k;
    cam.lookAt(0, 0, 0);
    if (group.current) {
      group.current.position.x += ((small ? 0 : 2.4) - group.current.position.x) * k;
      group.current.position.y += ((small ? 1.6 : 0) - group.current.position.y) * k;
    }
  });
  return (
    <group ref={group}>
      <ambientLight intensity={0.8} />
      <pointLight intensity={45} color="#F2A65A" distance={20} />
      <Core reduced={reduced} />
      <Stars count={small ? 700 : 1500} reduced={reduced} />
      <Orbits reduced={reduced} />
      <Beans count={small ? 18 : 36} reduced={reduced} />
    </group>
  );
}
