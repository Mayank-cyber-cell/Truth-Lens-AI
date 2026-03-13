import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

function GlobeMesh() {
  const meshRef = useRef<THREE.Mesh>(null);
  const ringRef1 = useRef<THREE.Mesh>(null);
  const ringRef2 = useRef<THREE.Mesh>(null);
  const ringRef3 = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (meshRef.current) meshRef.current.rotation.y += delta * 0.15;
    if (ringRef1.current) ringRef1.current.rotation.z += delta * 0.3;
    if (ringRef2.current) ringRef2.current.rotation.x += delta * 0.2;
    if (ringRef3.current) ringRef3.current.rotation.y -= delta * 0.25;
  });

  return (
    <group>
      {/* Wireframe globe */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[2, 32, 32]} />
        <meshBasicMaterial color="#00d4ff" wireframe transparent opacity={0.15} />
      </mesh>
      {/* Inner glow sphere */}
      <mesh>
        <sphereGeometry args={[1.95, 32, 32]} />
        <meshBasicMaterial color="#7c3aed" transparent opacity={0.05} />
      </mesh>
      {/* Scanning rings */}
      <mesh ref={ringRef1} rotation={[Math.PI / 4, 0, 0]}>
        <torusGeometry args={[2.5, 0.01, 16, 100]} />
        <meshBasicMaterial color="#00d4ff" transparent opacity={0.6} />
      </mesh>
      <mesh ref={ringRef2} rotation={[0, Math.PI / 3, Math.PI / 6]}>
        <torusGeometry args={[2.8, 0.008, 16, 100]} />
        <meshBasicMaterial color="#7c3aed" transparent opacity={0.4} />
      </mesh>
      <mesh ref={ringRef3} rotation={[Math.PI / 2, Math.PI / 4, 0]}>
        <torusGeometry args={[3.1, 0.006, 16, 100]} />
        <meshBasicMaterial color="#3b82f6" transparent opacity={0.3} />
      </mesh>
    </group>
  );
}

function Particles() {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const pos = new Float32Array(2000 * 3);
    for (let i = 0; i < 2000; i++) {
      const r = 4 + Math.random() * 6;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
    }
    return pos;
  }, []);

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.02;
  });

  return (
    <Points ref={ref} positions={positions} stride={3}>
      <PointMaterial transparent color="#00d4ff" size={0.02} sizeAttenuation depthWrite={false} opacity={0.6} />
    </Points>
  );
}

export default function GlobeScene() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas camera={{ position: [0, 0, 7], fov: 50 }} dpr={[1, 2]}>
        <ambientLight intensity={0.5} />
        <GlobeMesh />
        <Particles />
      </Canvas>
    </div>
  );
}
