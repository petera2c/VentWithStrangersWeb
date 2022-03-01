import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";

function Box() {
  const mesh = useRef();
  useFrame(() => (mesh.current.rotation.x += 0.01));

  return (
    <mesh position={[0, 0, 0]} ref={mesh} rotation={[0, 0.75, 0]}>
      <boxBufferGeometry />
      <meshLambertMaterial attach="material" color="#2096f2" />
    </mesh>
  );
}

function Plane() {
  return (
    <mesh position={[0, -1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeBufferGeometry args={[5, 5, 1]} />
      <meshLambertMaterial attach="material" color="#171a1c" />
    </mesh>
  );
}

function App() {
  return (
    <div
      className="flex column x-fill br2"
      style={{
        backgroundColor: "#171a1c",
      }}
    >
      <Canvas>
        <OrbitControls />
        <Stars />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 15, 10]} angle={0.3} />
        <Box position={[10, 10, 10]} />
        <Plane />
      </Canvas>
      <a
        href="https://forms.gle/fQ5xyZL52HZTEp2C7"
        rel="noreferrer"
        target="_blank"
      >
        <h1 className="white tac">
          If you have any ideas on what this game should do, please let us know{" "}
          <span className="blue">here</span>
        </h1>
      </a>
    </div>
  );
}

export default App;
