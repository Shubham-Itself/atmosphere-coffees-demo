"use client";
import dynamic from "next/dynamic";
import SceneFallback from "./SceneFallback";
const CoffeeScene = dynamic(() => import("./CoffeeScene"), { ssr: false, loading: () => <SceneFallback /> });
export default function HeroScene() { return <CoffeeScene />; }
