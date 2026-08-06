"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import styles from "./LogoMark.module.css";

export type LogoTone = "light" | "dark";

/** Metal tint and key-light strength per tone, eased between on a tone change. */
const TONES: Record<LogoTone, { color: THREE.Color; intensity: number }> = {
  light: { color: new THREE.Color("#ffffff"), intensity: 400 },
  dark: { color: new THREE.Color("#16222e"), intensity: 2000 },
};

/**
 * The mark is CSS-scaled between the intro splash and its compact resting size,
 * so the drawing buffer is fixed at the largest size it is ever painted at.
 */
const BUFFER_CSS_SIZE = 340;

export default function LogoMark({ tone = "light" }: { tone?: LogoTone }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [modelFailed, setModelFailed] = useState(false);
  const toneRef = useRef<LogoTone>(tone);

  useEffect(() => {
    toneRef.current = tone;
  }, [tone]);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const scene = new THREE.Scene();
    const fallbackCamera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
    fallbackCamera.position.set(0, 5.2, 0);
    fallbackCamera.up.set(0, 0, -1);
    fallbackCamera.lookAt(0, 0, 0);
    let activeCamera: THREE.Camera = fallbackCamera;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(BUFFER_CSS_SIZE, BUFFER_CSS_SIZE, false);

    let cone: THREE.Object3D | null = null;
    let plane: THREE.Object3D | null = null;
    let loadedRoot: THREE.Object3D | null = null;
    let coneStartQuaternion: THREE.Quaternion | null = null;
    let coneStartY = 0;
    const planeStartScale = new THREE.Vector3(1, 1, 1);
    let frame = 0;
    let disposed = false;
    const clock = new THREE.Clock();
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Tone is eased rather than swapped, so it can ride along with the settle.
    const litMaterials: THREE.MeshStandardMaterial[] = [];
    const keyLights: THREE.PointLight[] = [];
    const shownColor = TONES[toneRef.current].color.clone();
    let shownIntensity = TONES[toneRef.current].intensity;
    let lastElapsed = 0;

    const applyTone = (delta: number) => {
      const target = TONES[toneRef.current];
      const step = Math.min(1, delta * 4);

      shownColor.lerp(target.color, step);
      shownIntensity += (target.intensity - shownIntensity) * step;

      litMaterials.forEach((material) => material.color.copy(shownColor));
      keyLights.forEach((light) => {
        light.intensity = shownIntensity;
      });
    };

    const render = () => {
      if (disposed) return;

      const elapsed = clock.getElapsedTime();
      const delta = Math.min(elapsed - lastElapsed, 0.1);
      lastElapsed = elapsed;

      applyTone(delta);

      if (!reduceMotion && cone && coneStartQuaternion) {
        const turn = new THREE.Quaternion().setFromAxisAngle(
          new THREE.Vector3(0, 1, 0),
          (elapsed / 7) * Math.PI * 2,
        );
        cone.quaternion.copy(coneStartQuaternion).multiply(turn);
        cone.position.y = coneStartY + Math.sin((elapsed / 10) * Math.PI * 2) * 0.05;
      }

      if (!reduceMotion && plane) {
        const scale = 1 + Math.sin((elapsed / 12) * Math.PI * 2) * 0.05;
        plane.scale.copy(planeStartScale).multiplyScalar(scale);
      }

      renderer.render(scene, activeCamera);
      frame = window.requestAnimationFrame(render);
    };

    new GLTFLoader().load(
      "/assets/logo.glb",
      (gltf) => {
        if (disposed) return;

        const loadedScene = gltf.scene;
        loadedRoot = loadedScene;

        const gltfCamera = gltf.cameras[0];

        if (gltfCamera) {
          activeCamera = gltfCamera;

          if (gltfCamera instanceof THREE.PerspectiveCamera) {
            gltfCamera.aspect = 1;
            gltfCamera.updateProjectionMatrix();
          }
        }

        loadedScene.traverse((object) => {
          if (object instanceof THREE.PointLight) {
            object.intensity = shownIntensity;
            keyLights.push(object);
          }

          if (object instanceof THREE.Mesh) {
            const materials = Array.isArray(object.material)
              ? object.material
              : [object.material];

            object.material = materials.map((source) => {
              const material = source.clone();

              if (material instanceof THREE.MeshStandardMaterial) {
                material.color.copy(shownColor);
                material.metalness = 1;
                material.roughness = 0.24;
                litMaterials.push(material);
              }

              return material;
            });

            if (object.material.length === 1) {
              object.material = object.material[0];
            }
          }
        });

        cone = loadedScene.getObjectByName("Cone") ?? null;
        plane = loadedScene.getObjectByName("Plane") ?? null;

        if (cone) {
          coneStartQuaternion = cone.quaternion.clone();
          coneStartY = cone.position.y;
        }

        if (plane) {
          planeStartScale.copy(plane.scale);
        }

        scene.add(loadedScene);
      },
      undefined,
      () => {
        if (!disposed) setModelFailed(true);
      },
    );

    render();

    return () => {
      disposed = true;
      window.cancelAnimationFrame(frame);

      loadedRoot?.traverse((object) => {
        if (!(object instanceof THREE.Mesh)) return;

        object.geometry.dispose();
        const materials = Array.isArray(object.material)
          ? object.material
          : [object.material];
        materials.forEach((material) => material.dispose());
      });

      renderer.dispose();
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        className={`${styles.canvas} ${modelFailed ? styles.isHidden : ""}`}
        aria-hidden="true"
      />
      {modelFailed && (
        <img
          className={`${styles.fallback} ${tone === "dark" ? styles.isDark : ""}`}
          src="/assets/logo.svg"
          alt=""
        />
      )}
    </>
  );
}
