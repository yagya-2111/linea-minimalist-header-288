import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { findSanjivaniProduct } from "./sanjivaniCatalog";
import vitalityLabel from "@/assets/labels/daily-vitality.jpg";
import gutLabel from "@/assets/labels/gut-glow.jpg";
import greensLabel from "@/assets/labels/daily-greens.jpg";
import cacaoLabel from "@/assets/labels/calm-cacao.jpg";

const color = (name: string) => {
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return `hsl(${value.replace(/\s+/g, ", ")})`;
};

const bottleArtwork: Record<string, { label: string; glass: string }> = {
  "daily-vitality": { label: vitalityLabel, glass: "--serum-vitality-glass" },
  "daily-greens": { label: greensLabel, glass: "--serum-greens-glass" },
  "gut-glow": { label: gutLabel, glass: "--serum-gut-glass" },
  "calm-cacao": { label: cacaoLabel, glass: "--serum-cacao-glass" },
};

function Bottle({ slug, angle, interactive }: { slug: string; angle: React.MutableRefObject<number>; interactive: React.MutableRefObject<boolean> }) {
  const group = useRef<THREE.Group>(null);
  const artwork = bottleArtwork[slug] ?? bottleArtwork["daily-vitality"];
  const texture = useTexture(artwork.label);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  texture.wrapS = THREE.ClampToEdgeWrapping;
  const glass = color(artwork.glass);
  const cap = color("--serum-cap");

  useFrame((_, rawDelta) => {
    if (!group.current) return;
    const dt = Math.min(rawDelta, 0.05);
    if (!interactive.current) angle.current += dt * 0.19;
    group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, angle.current, 8, dt);
  });

  return (
    <group ref={group} position={[0, -0.1, 0]}>
      <mesh position={[0, 0.04, 0]} castShadow>
        <cylinderGeometry args={[0.72, 0.72, 2.38, 64]} />
        <meshPhysicalMaterial color={glass} metalness={0.05} roughness={0.14} transmission={0.03} thickness={0.4} clearcoat={1} clearcoatRoughness={0.08} />
      </mesh>
      <mesh position={[0, -1.18, 0]} castShadow><cylinderGeometry args={[0.7, 0.64, 0.18, 64]} /><meshPhysicalMaterial color={glass} roughness={0.18} clearcoat={1} /></mesh>
      <mesh position={[0, 1.24, 0]} castShadow><sphereGeometry args={[0.72, 64, 32, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshPhysicalMaterial color={glass} roughness={0.13} clearcoat={1} /></mesh>
      <mesh position={[0, 1.46, 0]} castShadow><cylinderGeometry args={[0.34, 0.34, 0.42, 48]} /><meshPhysicalMaterial color={glass} roughness={0.15} clearcoat={1} /></mesh>
      <mesh position={[0, 1.7, 0]} castShadow><cylinderGeometry args={[0.52, 0.52, 0.46, 64]} /><meshStandardMaterial color={cap} roughness={0.68} /></mesh>
      {Array.from({ length: 16 }, (_, index) => <mesh key={index} position={[Math.sin((index / 16) * Math.PI * 2) * 0.525, 1.7, Math.cos((index / 16) * Math.PI * 2) * 0.525]} rotation-y={(index / 16) * Math.PI * 2}><boxGeometry args={[0.025, 0.38, 0.03]} /><meshStandardMaterial color={cap} roughness={0.76} /></mesh>)}
      <mesh position={[0, 2.15, 0]} castShadow scale={[1, 1.38, 1]}><sphereGeometry args={[0.36, 40, 28]} /><meshStandardMaterial color={cap} roughness={0.62} /></mesh>
      <mesh position={[0, 0.01, 0]} rotation-y={Math.PI}>
        <cylinderGeometry args={[0.728, 0.728, 1.48, 64, 1, true]} />
        <meshStandardMaterial map={texture} roughness={0.82} polygonOffset polygonOffsetFactor={-1} />
      </mesh>
      <mesh position={[0, 0.45, 0]}><cylinderGeometry args={[0.035, 0.035, 2.55, 16]} /><meshPhysicalMaterial color={color("--serum-dropper")} transparent opacity={0.55} roughness={0.2} /></mesh>
    </group>
  );
}

export default function Serum3DViewer({ slug, className = "" }: { slug: string; className?: string }) {
  const product = findSanjivaniProduct(slug);
  const [visible, setVisible] = useState(false);
  const [supported, setSupported] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const container = useRef<HTMLDivElement>(null);
  const angle = useRef(0);
  const interactive = useRef(false);
  const pointerX = useRef<number | null>(null);

  useEffect(() => {
    const el = container.current;
    if (!el) return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(media.matches);
    const change = () => setReducedMotion(media.matches);
    media.addEventListener("change", change);
    const canvas = document.createElement("canvas");
    setSupported(Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl")));
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { rootMargin: "80px" });
    observer.observe(el);
    return () => { observer.disconnect(); media.removeEventListener("change", change); };
  }, []);

  useEffect(() => { angle.current = 0; interactive.current = reducedMotion; }, [slug, reducedMotion]);

  return (
    <div ref={container} className={`relative overflow-hidden bg-secondary ${className}`} aria-label={`Interactive 3D view of Sanjivani ${product?.name ?? "serum"}`}>
      {visible && supported ? (
        <div className="absolute inset-0 touch-pan-y cursor-grab active:cursor-grabbing" onPointerDown={(event) => { event.currentTarget.setPointerCapture(event.pointerId); pointerX.current = event.clientX; interactive.current = true; }} onPointerMove={(event) => { if (pointerX.current !== null) { angle.current += (event.clientX - pointerX.current) * 0.012; pointerX.current = event.clientX; } }} onPointerUp={() => { pointerX.current = null; }} onPointerCancel={() => { pointerX.current = null; }}>
          <Canvas dpr={[1, 1.5]} shadows camera={{ position: [0, 0.9, 8.8], fov: 35 }} gl={{ antialias: true, powerPreference: "low-power" }}>
            <ambientLight intensity={1.25} />
            <directionalLight position={[3, 6, 5]} intensity={2.1} castShadow shadow-mapSize-width={1024} shadow-mapSize-height={1024} shadow-camera-left={-5} shadow-camera-right={5} shadow-camera-top={6} shadow-camera-bottom={-5} />
            <Environment><Lightformer intensity={2} position={[0, 5, 5]} scale={[5, 9, 1]} /><Lightformer intensity={1} position={[-5, 2, -2]} scale={[3, 8, 1]} /></Environment>
            <mesh position={[0, -1.37, 0]} rotation-x={-Math.PI / 2} receiveShadow><circleGeometry args={[1.65, 64]} /><meshStandardMaterial color={color("--muted")} roughness={0.95} /></mesh>
            <Suspense fallback={null}><Bottle slug={slug} angle={angle} interactive={interactive} /></Suspense>
          </Canvas>
        </div>
      ) : <img src={product?.image} alt={`Sanjivani ${product?.name ?? "serum"} bottle`} className="absolute inset-0 h-full w-full object-cover" />}
      <div className="pointer-events-none absolute left-4 top-4 bg-background/90 px-3 py-2 text-xs font-bold uppercase text-foreground">Original artwork · 360°</div>
      <Button type="button" size="icon" variant="secondary" className="absolute bottom-4 right-4 h-10 w-10 rounded-sm" title="Reset bottle view" aria-label="Reset bottle view" onClick={() => { angle.current = 0; interactive.current = reducedMotion; }}><RotateCcw className="h-4 w-4" /></Button>
    </div>
  );
}