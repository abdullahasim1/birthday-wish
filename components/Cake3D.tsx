"use client";

import React, { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  PerspectiveCamera,
  Sparkles,
  Float,
  ContactShadows,
} from "@react-three/drei";
import * as THREE from "three";
import { gsap } from "gsap";

// --- CONSTANTS ---
const CAKE_COLOR = "#5D4037"; // Chocolate
const ICING_COLOR = "#F8BBD0"; // Pink
const FILLING_COLOR = "#D7CCC8"; // Cream inside
const FLAME_COLOR = "#FFD700"; // Gold Fire

// --- INDIVIDUAL COMPONENTS ---

// 1. Candle Component with Flickering Flame
const Candle = ({ position }: { position: [number, number, number] }) => {
  const flameRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (flameRef.current) {
      // Flame flickering effect using Sine wave
      flameRef.current.scale.y =
        1 + Math.sin(clock.getElapsedTime() * 10) * 0.1;
      flameRef.current.rotation.z = Math.sin(clock.getElapsedTime() * 5) * 0.1;
    }
  });

  return (
    <group position={position}>
      {/* Candle Stick */}
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 1, 16]} />
        <meshStandardMaterial color="white" />
      </mesh>
      {/* Flame */}
      <mesh ref={flameRef} position={[0, 1.1, 0]}>
        <coneGeometry args={[0.08, 0.3, 16]} />
        <meshStandardMaterial
          color={FLAME_COLOR}
          emissive={FLAME_COLOR}
          emissiveIntensity={2}
        />
      </mesh>
      {/* Point Light for glow */}
      <pointLight
        position={[0, 1.2, 0]}
        intensity={1}
        distance={3}
        color="#FFA500"
      />
    </group>
  );
};

// 2. The Cake Logic
const CakeModel = ({ onCut, isCut }: { onCut: () => void; isCut: boolean }) => {
  const sliceRef = useRef<THREE.Group>(null);
  const knifeRef = useRef<THREE.Group>(null);

  // Animation Logic
  useFrame((state, delta) => {
    if (isCut && sliceRef.current) {
      // Move the slice OUTWARDS diagonally
      const speed = 2 * delta;
      if (sliceRef.current.position.x < 1.5) {
        sliceRef.current.position.x += speed;
        sliceRef.current.position.z += speed * 0.5;
        sliceRef.current.rotation.y += speed * 0.2; // Slight rotation
      }
    }
  });

  // Knife Animation Trigger
  const handleInteraction = () => {
    if (isCut) return; // Already cut

    // Knife Animation using GSAP
    if (knifeRef.current) {
      const tl = gsap.timeline({ onComplete: onCut });

      // 1. Knife appears
      tl.to(knifeRef.current.position, {
        y: 2,
        duration: 0.5,
        ease: "power2.out",
      })
        .to(knifeRef.current.rotation, { x: Math.PI / 4, duration: 0.3 }) // Angle for cutting
        // 2. Cut down
        .to(knifeRef.current.position, {
          y: 0.5,
          duration: 0.3,
          ease: "power2.in",
        })
        // 3. Move up and hide
        .to(knifeRef.current.position, { y: 5, duration: 0.5, delay: 0.2 });
    }
  };

  return (
    <group onClick={handleInteraction}>
      {/* --- KNIFE (Hidden initially) --- */}
      <group ref={knifeRef} position={[0, 5, 0]} rotation={[0, Math.PI / 4, 0]}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.1, 3, 0.5]} />
          <meshStandardMaterial
            color="#C0C0C0"
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
        <mesh position={[0, 1.5, 0]}>
          <cylinderGeometry args={[0.1, 0.1, 1, 16]} />
          <meshStandardMaterial color="#333" />
        </mesh>
      </group>

      {/* --- MAIN CAKE BODY (300 degrees) --- */}
      <group rotation={[0, 0, 0]}>
        {/* Chocolate Base */}
        <mesh position={[0, 0.5, 0]}>
          {/* thetaLength controls the circle segment size */}
          <cylinderGeometry args={[2, 2, 1, 32, 1, false, 1, 5.28]} />
          <meshStandardMaterial color={CAKE_COLOR} roughness={0.8} />
        </mesh>
        {/* Pink Icing Top */}
        <mesh position={[0, 1.01, 0]}>
          <cylinderGeometry args={[2, 2, 0.1, 32, 1, false, 1, 5.28]} />
          <meshStandardMaterial color={ICING_COLOR} />
        </mesh>
        {/* Filling (Inside look) */}
        <mesh position={[0, 0.5, 0]}>
          <cylinderGeometry args={[1.95, 1.95, 0.98, 32, 1, false, 1, 5.28]} />
          <meshStandardMaterial color={CAKE_COLOR} />
        </mesh>
      </group>

      {/* --- THE SLICE (The missing piece) --- */}
      <group ref={sliceRef} rotation={[0, 0, 0]}>
        {/* Slice Base */}
        <mesh position={[0, 0.5, 0]}>
          <cylinderGeometry args={[2, 2, 1, 32, 1, false, 0, 1]} />
          <meshStandardMaterial color={CAKE_COLOR} />
        </mesh>
        {/* Slice Icing */}
        <mesh position={[0, 1.01, 0]}>
          <cylinderGeometry args={[2, 2, 0.1, 32, 1, false, 0, 1]} />
          <meshStandardMaterial color={ICING_COLOR} />
        </mesh>
        {/* Inner Cream Details (Texture on sides of slice) */}
        <mesh
          position={[0.5, 0.5, 0.2]}
          rotation={[0, 0.5, 0]}
          scale={[0.1, 0.8, 1.8]}
        >
          <planeGeometry />
          <meshStandardMaterial color={FILLING_COLOR} side={THREE.DoubleSide} />
        </mesh>

        {/* Candle on the Slice */}
        <Candle position={[1.2, 1, 0.5]} />
      </group>

      {/* Candles on Main Cake */}
      <Candle position={[-1, 1, -1]} />
      <Candle position={[0, 1, -1.5]} />
      <Candle position={[1, 1, -1]} />

      {/* Plate */}
      <mesh position={[0, -0.1, 0]} receiveShadow>
        <cylinderGeometry args={[3.5, 3.5, 0.2, 64]} />
        <meshStandardMaterial color="white" roughness={0.2} metalness={0.1} />
      </mesh>
      <mesh position={[0, -0.2, 0]} receiveShadow>
        <cylinderGeometry args={[3.6, 3.6, 0.1, 64]} />
        <meshStandardMaterial color="#FFD700" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  );
};

// --- MAIN EXPORT ---
export default function BirthdayCake({
  onCutCompleted,
}: {
  onCutCompleted: () => void;
}) {
  const [isCut, setIsCut] = useState(false);

  const handleCut = () => {
    setIsCut(true);
    // Wait for animation to finish before changing page state
    setTimeout(() => {
      onCutCompleted();
    }, 3000);
  };

  return (
    <div className="w-full h-[60vh] md:h-[70vh] cursor-pointer relative">
      {!isCut && (
        <div className="absolute top-10 left-1/2 -translate-x-1/2 z-10 bg-black/50 text-white px-4 py-2 rounded-full pointer-events-none animate-bounce">
          Tap Cake to Cut 🔪
        </div>
      )}
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[4, 4, 6]} />
        <OrbitControls enableZoom={false} maxPolarAngle={Math.PI / 2.5} />

        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <spotLight
          position={[10, 10, 10]}
          angle={0.15}
          penumbra={1}
          intensity={2}
          castShadow
        />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />

        {/* Environment */}
        <Sparkles
          count={50}
          scale={6}
          size={4}
          speed={0.4}
          opacity={0.5}
          color="#FFF"
        />
        <ContactShadows
          resolution={512}
          scale={20}
          blur={2}
          opacity={0.5}
          far={10}
          color="#000"
        />

        {/* The Cake */}
        <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
          <CakeModel onCut={handleCut} isCut={isCut} />
        </Float>
      </Canvas>
    </div>
  );
}
