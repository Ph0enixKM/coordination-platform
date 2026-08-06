"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import styles from "./page.module.css";

const WHITE = new THREE.Color("#ffffff");

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [modelFailed, setModelFailed] = useState(false);

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

    const resize = () => {
      const { width, height } = canvas.getBoundingClientRect();
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(Math.max(width, 1), Math.max(height, 1), false);
      if (activeCamera instanceof THREE.PerspectiveCamera) {
        activeCamera.aspect = Math.max(width, 1) / Math.max(height, 1);
        activeCamera.updateProjectionMatrix();
      }
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    resize();

    const render = () => {
      if (disposed) return;

      const elapsed = clock.getElapsedTime();

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

        if (gltf.cameras[0]) {
          activeCamera = gltf.cameras[0];
          resize();
        }

        loadedScene.traverse((object) => {
          if (object instanceof THREE.PointLight) {
            object.intensity = 400
          }

          if (object instanceof THREE.Mesh) {
            const materials = Array.isArray(object.material)
              ? object.material
              : [object.material];

            object.material = materials.map((source) => {
              const material = source.clone();

              if (material instanceof THREE.MeshStandardMaterial) {
                material.color.copy(WHITE);
                material.metalness = 1;
                material.roughness = 0.24;
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
      resizeObserver.disconnect();

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
    <main className={styles.page}>
      <section className={styles.intro} aria-labelledby="coordination-title">
        <div className={styles.brandLine}>
          <div className={styles.logoWrap} aria-hidden="true">
            <canvas
              ref={canvasRef}
              className={`${styles.logoCanvas} ${modelFailed ? styles.isHidden : ""}`}
            />
            {modelFailed && (
              <img className={styles.logoFallback} src="/assets/logo.svg" alt="" />
            )}
          </div>

          <div className={styles.titleClip}>
            <h1 id="coordination-title" className={styles.title}>
              Coordination
            </h1>
          </div>
        </div>
      </section>
    </main>
  );
}
