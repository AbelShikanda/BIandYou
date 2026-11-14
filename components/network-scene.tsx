"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Html, AdaptiveDpr, AdaptiveEvents } from "@react-three/drei";
import * as THREE from "three";
import { useEffect, useMemo, useRef, useState } from "react";

export interface NetworkNode {
  id: string;
  label: string;
  kind: "Member" | "Project" | "Event";
}

interface SceneProps {
  nodes: NetworkNode[];
  reducedMotion: boolean;
}

const KIND_COLOR: Record<NetworkNode["kind"], string> = {
  Member: "#00E5FF",
  Project: "#7C3AED",
  Event: "#A3FF12",
};

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function useNetworkGraph(count: number) {
  return useMemo(() => {
    const rand = seededRandom(1337);
    const positions: THREE.Vector3[] = [];
    for (let i = 0; i < count; i++) {
      // fibonacci-ish sphere distribution with jitter
      const t = (i + 0.5) / count;
      const phi = Math.acos(1 - 2 * t);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      const r = 2.1 + rand() * 1.1;
      positions.push(
        new THREE.Vector3(
          r * Math.sin(phi) * Math.cos(theta) + (rand() - 0.5) * 0.6,
          r * Math.cos(phi) * 0.75 + (rand() - 0.5) * 0.6,
          r * Math.sin(phi) * Math.sin(theta) + (rand() - 0.5) * 0.6
        )
      );
    }
    // connect each node to its 2 nearest neighbors
    const edges: [number, number][] = [];
    const seen = new Set<string>();
    for (let i = 0; i < count; i++) {
      const dists = positions
        .map((p, j) => ({ j, d: p.distanceTo(positions[i]) }))
        .filter((x) => x.j !== i)
        .sort((a, b) => a.d - b.d);
      for (const { j } of dists.slice(0, 2)) {
        const key = i < j ? `${i}-${j}` : `${j}-${i}`;
        if (!seen.has(key)) {
          seen.add(key);
          edges.push([i, j]);
        }
      }
    }
    return { positions, edges };
  }, [count]);
}

function Graph({ nodes, reducedMotion }: SceneProps) {
  const group = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const { positions, edges } = useNetworkGraph(nodes.length);
  const [hovered, setHovered] = useState<number | null>(null);

  const linePositions = useMemo(() => {
    const arr = new Float32Array(edges.length * 6);
    edges.forEach(([a, b], i) => {
      arr.set([positions[a].x, positions[a].y, positions[a].z, positions[b].x, positions[b].y, positions[b].z], i * 6);
    });
    return arr;
  }, [edges, positions]);

  const pulseRefs = useRef<(THREE.Mesh | null)[]>([]);
  const pulseEdges = useMemo(() => edges.slice(0, Math.min(10, edges.length)), [edges]);

  const pointer = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useFrame((state, delta) => {
    if (!group.current) return;
    if (reducedMotion) return;
    // idle auto-rotate + subtle parallax from pointer
    group.current.rotation.y += delta * 0.06;
    const targetX = pointer.current.y * 0.18;
    const targetTilt = pointer.current.x * 0.12;
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, targetX, 0.05);
    group.current.rotation.z = THREE.MathUtils.lerp(group.current.rotation.z, targetTilt * 0.4, 0.05);
    if (coreRef.current) {
      const s = 1 + Math.sin(state.clock.elapsedTime * 1.4) * 0.06;
      coreRef.current.scale.setScalar(s);
    }
    // pulses traveling along edges
    pulseEdges.forEach(([a, b], i) => {
      const mesh = pulseRefs.current[i];
      if (!mesh) return;
      const t = (state.clock.elapsedTime * 0.22 + i * 0.13) % 1;
      mesh.position.lerpVectors(positions[a], positions[b], t);
      const m = mesh.material as THREE.MeshBasicMaterial;
      m.opacity = Math.sin(t * Math.PI) * 0.9;
    });
  });

  return (
    <group ref={group}>
      {/* core hub */}
      <mesh ref={coreRef}>
        <icosahedronGeometry args={[0.62, 1]} />
        <meshStandardMaterial color="#0a0a0a" emissive="#00E5FF" emissiveIntensity={0.9} roughness={0.35} metalness={0.6} flatShading />
      </mesh>

      {/* connection lines */}
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[linePositions, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color="#00E5FF" transparent opacity={0.16} />
      </lineSegments>

      {/* traveling light pulses */}
      {!reducedMotion &&
        pulseEdges.map((_, i) => (
          <mesh key={i} ref={(m) => { pulseRefs.current[i] = m; }}>
            <sphereGeometry args={[0.045, 6, 6]} />
            <meshBasicMaterial color="#A3FF12" transparent opacity={0} />
          </mesh>
        ))}

      {/* member / project / event nodes */}
      {nodes.map((node, i) => {
        const p = positions[i];
        const active = hovered === i;
        const dimOthers = hovered !== null && !active;
        return (
          <group key={node.id} position={p}>
            <mesh
              onPointerOver={(e) => {
                e.stopPropagation();
                setHovered(i);
                document.body.style.cursor = "pointer";
              }}
              onPointerOut={() => {
                setHovered(null);
                document.body.style.cursor = "";
              }}
              scale={active ? 1.9 : 1}
            >
              <icosahedronGeometry args={[0.13, 0]} />
              <meshStandardMaterial
                color={KIND_COLOR[node.kind]}
                emissive={KIND_COLOR[node.kind]}
                emissiveIntensity={active ? 2.2 : dimOthers ? 0.25 : 1.1}
                roughness={0.3}
                flatShading
                transparent
                opacity={dimOthers ? 0.45 : 1}
              />
            </mesh>
            {active && (
              <Html center distanceFactor={7} zIndexRange={[20, 0]} style={{ pointerEvents: "none" }}>
                <div className="whitespace-nowrap rounded-lg border border-cyan/40 bg-black/90 px-2.5 py-1.5 text-left shadow-glow-cyan">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-cyan">{node.kind}</p>
                  <p className="text-xs font-medium text-white">{node.label}</p>
                </div>
              </Html>
            )}
          </group>
        );
      })}
    </group>
  );
}

export default function NetworkScene({ nodes, reducedMotion }: SceneProps) {
  return (
    <Canvas
      camera={{ position: [0, 0.6, 6.2], fov: 42 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      frameloop={reducedMotion ? "never" : "always"}
      aria-label="Interactive 3D network of community members, projects and events"
    >
      <ambientLight intensity={0.35} />
      <pointLight position={[4, 4, 4]} intensity={30} color="#00E5FF" />
      <pointLight position={[-5, -2, -3]} intensity={26} color="#7C3AED" />
      <pointLight position={[0, -4, 2]} intensity={12} color="#A3FF12" />
      <AdaptiveDpr pixelated />
      <AdaptiveEvents />
      <Graph nodes={nodes} reducedMotion={reducedMotion} />
    </Canvas>
  );
}
