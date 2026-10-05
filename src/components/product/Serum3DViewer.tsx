import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import * as THREE from "three";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { findSanjivaniProduct } from "./sanjivaniCatalog";

const color = (name: string) => {
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return `hsl(${value.replace(/\s+/g, ", ")})`;
};

const blendColors: Record<string, string> = {
  "daily-vitality": "--serum-vitality",
  "daily-greens": "--serum-greens",
  "gut-glow": "--serum-gut",
  "calm-cacao": "--serum-cacao",
};

function makeLabel(name: string, ingredients: string, accent: string) {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 768;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  ctx.clearRect(0, 0, 1024, 768);
  ctx.fillStyle = color("--serum-label");
  ctx.fillRect(294, 54, 436, 660);
  ctx.strokeStyle = accent;
  ctx.lineWidth = 3;
  ctx.strokeRect(314, 74, 396, 620);
  ctx.textAlign = "center";
  ctx.fillStyle = color("--foreground");
  ctx.font = "bold 52px Georgia, serif";
  ctx.fillText("SANJIVANI", 512, 210);
  ctx.fillStyle = accent;
  ctx.fillRect(425, 252, 174, 4);
  ctx.font = "bold 31px Arial, sans-serif";
  ctx.fillText(name.toUpperCase(), 512, 350);
  ctx.font = "22px Arial, sans-serif";
  ctx.fillStyle = color("--foreground");
  ctx.fillText("BOTANICAL SERUM", 512, 397);
  ctx.strokeStyle = accent;
  ctx.lineWidth = 5;
  for (let i = -2; i <= 2; i++) {
    const x = 512 + i * 29;
    ctx.beginPath();
    ctx.ellipse(x, 520 - Math.abs(i) * 18, 13, 30, i * 0.3, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.font = "19px Arial, sans-serif";
  ctx.fillText(ingredients.toUpperCase(), 512, 635);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

function Bottle({ slug, angle, interactive }: { slug: string; angle: React.MutableRefObject<number>; interactive: React.MutableRefObject<boolean> }) {
  const product = findSanjivaniProduct(slug);
  const group = useRef<THREE.Group>(null);
  const accent = color(blendColors[slug] ?? "--serum-vitality");
  const glass = color("--serum-glass");
  const cap = color("--serum-cap");
  const texture = useMemo(() => makeLabel(product?.name ?? "Sanjivani", product?.ingredients ?? "Botanical blend", accent), [product?.name, product?.ingredients, accent]);

  useEffect(() => () => texture?.dispose(), [texture]);

  useFrame((_, rawDelta) => {
    if (!group.current) return;
    const dt = Math.min(rawDelta, 0.05);
    if (!interactive.current) angle.current += dt * 0.19;
    group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, angle.current, 8, dt);
  });

  return (
    <group ref={group} position={[0, -0.05, 0]}>
      <mesh position={[0, 0.15, 0]} castShadow>
        <cylinderGeometry args={[0.68, 0.68, 2.5, 48]} />
        <meshPhysicalMaterial color={glass} metalness={0.12} roughness={0.21} clearcoat={1} clearcoatRoughness={0.12} />
      </mesh>
      <mesh position={[0, -1.1, 0]} castShadow><cylinderGeometry args={[0.68, 0.62, 0.2, 48]} /><meshPhysicalMaterial color={glass} roughness={0.25} clearcoat={1} /></mesh>
      <mesh position={[0, 1.53, 0]} castShadow><cylinderGeometry args={[0.33, 0.68, 0.32, 48]} /><meshPhysicalMaterial color={glass} roughness={0.18} clearcoat={1} /></mesh>
      <mesh position={[0, 1.79, 0]} castShadow><cylinderGeometry args={[0.32, 0.32, 0.3, 48]} /><meshPhysicalMaterial color={glass} roughness={0.2} clearcoat={1} /></mesh>
      <mesh position={[0, 2.02, 0]} castShadow><cylinderGeometry args={[0.48, 0.48, 0.36, 48]} /><meshStandardMaterial color={cap} roughness={0.74} /></mesh>
      <mesh position={[0, 2.38, 0]} castShadow><sphereGeometry args={[0.35, 32, 24, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshStandardMaterial color={cap} roughness={0.68} /></mesh>
      <mesh position={[0, 2.19, 0]} castShadow><cylinderGeometry args={[0.35, 0.35, 0.28, 32]} /><meshStandardMaterial color={cap} roughness={0.68} /></mesh>
      {texture && <mesh position={[0, 0.06, 0]} rotation-y={Math.PI}>
        <cylinderGeometry args={[0.688, 0.688, 1.45, 64, 1, true]} />
        <meshStandardMaterial map={texture} transparent roughness={0.85} depthWrite={false} />
      </mesh>}
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
            <Bottle slug={slug} angle={angle} interactive={interactive} />
          </Canvas>
        </div>
      ) : <img src={product?.image} alt={`Sanjivani ${product?.name ?? "serum"} bottle`} className="absolute inset-0 h-full w-full object-cover" />}
      <div className="pointer-events-none absolute left-4 top-4 bg-background/90 px-3 py-2 text-xs font-bold uppercase text-foreground">360° bottle view</div>
      <Button type="button" size="icon" variant="secondary" className="absolute bottom-4 right-4 h-10 w-10 rounded-sm" title="Rotate bottle" aria-label="Rotate bottle" onClick={() => { angle.current += Math.PI / 2; interactive.current = true; }}><RotateCcw className="h-4 w-4" /></Button>
    </div>
  );
}