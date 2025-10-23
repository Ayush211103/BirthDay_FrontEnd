// src/components/LoadingDance.jsx
import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";

const BACKEND_URL = "http://localhost:5000/api/users/auth";
const BIRTHDAY_FALLBACK = "/birthday";
const WISHERS_FALLBACK = "/wishers";

const INITIAL_DANCE_MS = 3000;
const POST_SUBMIT_DANCE_MS = 2000;

export default function LoadingDance() {
  const mountRef = useRef(null);
  const clockRef = useRef(new THREE.Clock());
  const [showNameInput, setShowNameInput] = useState(false);
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const mount = mountRef.current;
    const scene = new THREE.Scene();

    // transparent background
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setClearColor(0x000000, 0); // transparent
    mount.appendChild(renderer.domElement);

    // camera
    const camera = new THREE.PerspectiveCamera(
      45,
      mount.clientWidth / mount.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 10;

    // light
    const light = new THREE.PointLight(0xffffff, 1);
    light.position.set(10, 10, 10);
    scene.add(light);
    scene.add(new THREE.AmbientLight(0xffffff, 0.6));

    // --- Create dancing girl from shapes ---
    const material = new THREE.MeshStandardMaterial({ color: 0xff69b4, roughness: 0.4 });
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), material);
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.5, 2, 32), material);
    const leftArm = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 1.5, 32), material);
    const rightArm = leftArm.clone();
    const leftLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 2, 32), material);
    const rightLeg = leftLeg.clone();

    // position body parts
    body.position.y = 0;
    head.position.y = 1.5;
    leftArm.position.set(-0.6, 0.6, 0);
    rightArm.position.set(0.6, 0.6, 0);
    leftLeg.position.set(-0.3, -1.5, 0);
    rightLeg.position.set(0.3, -1.5, 0);

    const dancer = new THREE.Group();
    dancer.add(head, body, leftArm, rightArm, leftLeg, rightLeg);
    scene.add(dancer);

    // --- Dance animation ---
    const animate = () => {
      requestAnimationFrame(animate);
      const t = clockRef.current.getElapsedTime();

      // make it "dance"
      dancer.rotation.y = Math.sin(t * 1.5) * 0.5;
      dancer.position.y = Math.sin(t * 4) * 0.2;

      leftArm.rotation.z = Math.sin(t * 3) * 1.2;
      rightArm.rotation.z = -Math.sin(t * 3) * 1.2;
      leftLeg.rotation.z = Math.sin(t * 2) * 0.8;
      rightLeg.rotation.z = -Math.sin(t * 2) * 0.8;

      renderer.render(scene, camera);
    };
    animate();

    // resize
    const onResize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    // initial delay
    const t = setTimeout(() => setShowNameInput(true), INITIAL_DANCE_MS);

    // cleanup
    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setMessage("Please enter a name.");
      return;
    }
    setMessage("");
    setIsSubmitting(true);
    setShowNameInput(false);

    const delay = (ms) => new Promise((res) => setTimeout(res, ms));
    const postPromise = fetch(BACKEND_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.trim() }),
    })
      .then(async (res) => {
        if (!res.ok) throw new Error(await res.text());
        return res.json();
      })
      .catch((err) => ({ error: true, message: err.message }));

    const [resp] = await Promise.all([postPromise, delay(POST_SUBMIT_DANCE_MS)]);

    setIsSubmitting(false);

    if (resp.error) {
      setMessage("Server error: " + resp.message);
      setTimeout(() => setShowNameInput(true), 800);
      return;
    }

    const matched = resp.match || resp.isBirthday || resp.matched;
    window.location.href = matched ? BIRTHDAY_FALLBACK : WISHERS_FALLBACK;
  };

  return (
    <div className="relative w-screen h-screen flex items-center justify-center bg-transparent text-white">
      {/* Three.js Canvas */}
      <div ref={mountRef} className="absolute inset-0" />

      {/* Overlay Form */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10 p-4">
        <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-6 shadow-xl w-full max-w-md text-center">
          <h1 className="text-3xl font-bold mb-2">🎉 Welcome!</h1>
          <p className="text-gray-200 mb-4">Enter your name to continue</p>

          {showNameInput && !isSubmitting && (
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="px-4 py-3 rounded-lg bg-white/30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-400"
                placeholder="Type your name..."
              />
              <button
                type="submit"
                className="px-6 py-3 rounded-lg bg-gradient-to-r from-pink-500 to-purple-600 hover:from-purple-500 hover:to-pink-600 text-white font-semibold transition-all"
              >
                Continue
              </button>
            </form>
          )}

          {!showNameInput && isSubmitting && (
            <div className="mt-4 text-gray-200 animate-pulse">Checking name... 💃</div>
          )}

          {message && (
            <div className="mt-3 text-sm text-red-300 bg-white/10 p-2 rounded-md">{message}</div>
          )}
        </div>
      </div>
    </div>
  );
}
