import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";

function Box() {
  const mesh = useRef();
  useFrame(() => (mesh.current.rotation.x += 0.01));

  return (
    <mesh ref={mesh}>
      <boxBufferGeometry />
      <meshLambertMaterial attach="material" color="#2096f2" />
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
