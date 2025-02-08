"use client"; // This is a Client Component because it uses context

import React from "react";
import { useMouse } from "../../context/MouseContext";

const NeonCursor: React.FC = () => {
  const mouse = useMouse();

  if (!mouse) {return null} // Prevents issues during SSR

  return (
    <div
      style={{
        position: "fixed",
        left: mouse.x,
        top: mouse.y,
        width: "20px",
        height: "20px",
        borderRadius: "50%",
        background: "rgba(0, 255, 255, 0.8)", // Neon cyan color
        boxShadow: "0 0 10px rgba(0, 255, 255, 0.8), 0 0 20px rgba(0, 255, 255, 0.6)",
        pointerEvents: "none",
        transform: "translate(-50%, -50%)",
        transition: "transform 0.1s ease-out",
        zIndex: 9999,
      }}
    />
  );
};

export default NeonCursor;
