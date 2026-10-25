"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";

import Galaxy from "./Galaxy";
import SceneFallback from "./SceneFallback";
import { useReducedMotion } from "@/hooks/useReducedMotion";

function hasWebGL() {
  try {
    const canvas = document.createElement("canvas");

    return !!(
      canvas.getContext("webgl2") ||
      canvas.getContext("webgl")
    );
  } catch {
    return false;
  }
}

export default function CoffeeScene() {
  const reduced = useReducedMotion();

  const host = useRef<HTMLDivElement>(null);

  const [ok, setOk] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    setOk(hasWebGL());
  }, []);

  useEffect(() => {
    const element = host.current;

    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      setVisible(entry.isIntersecting);
    });

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={host}
      className="pointer-events-none absolute inset-0"
      aria-hidden="true"
    >
      <SceneFallback />

      {ok && (
        <Canvas
          dpr={[1, 1.5]}
          camera={{
            position: [0, 4.6, 11.5],
            fov: 45,
          }}
          gl={{
            antialias: true,
            alpha: true,
          }}
          frameloop={visible ? "always" : "never"}
          onCreated={({ gl }) => {
            gl.domElement.addEventListener(
              "webglcontextlost",
              (event) => {
                event.preventDefault();
                setOk(false);
              }
            );
          }}
        >
          <Galaxy reduced={reduced} />
        </Canvas>
      )}
    </div>
  );
}