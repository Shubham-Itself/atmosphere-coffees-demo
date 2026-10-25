"use client";
import { useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import Galaxy from "./Galaxy";
import SceneFallback from "./SceneFallback";
import { useReducedMotion } from "@/hooks/useReducedMotion";

function hasWebGL() {
  try { const c = document.createElement("canvas"); return !!(c.getContext("webgl2") || c.getContext("webgl")); } catch { return false; }
}

export default function CoffeeScene() {
  const reduced = useReducedMotion();
  const host = useRef<HTMLDivElement>(null);
  const [ok, setOk] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => { setOk(hasWebGL()); }, []);
  useEffect(() => {
    const el = host.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting));
    io.observe(el); return () => io.disconnect();
  }, []);

  return (
    <div ref={host} className="absolute inset-0">
      <SceneFallback />
      {ok && (
        <Canvas dpr={[1, 1.5]} camera={{ position: [0, 4.6, 11.5], fov: 45 }} gl={{ antialias: true, alpha: true }}
          frameloop={visible ? "always" : "never"}
          onCreated={({ gl }) => gl.domElement.addEventListener("webglcontextlost", (e) => { e.preventDefault(); setOk(false); })}>
          <Galaxy reduced={reduced} />
        </Canvas>
      )}
    </div>
  );
}
