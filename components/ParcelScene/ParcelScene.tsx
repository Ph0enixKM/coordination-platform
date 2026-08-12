"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import styles from "./ParcelScene.module.css";

const MODEL_URL = "/assets/parcel.glb";

/* --- conveyors ------------------------------------------------------------ */

/** The model ships a single roller per conveyor; the rest are instances of it. */
const ROLLERS_PER_CONVEYOR = 20;

/** Blender pitch between rollers, measured along the roller's own local +Z. */
const ROLLER_PITCH = 0.5;

const ROLLER_RADIUS = 0.25;

/** World units a second that a parcel travels down the line. */
const BELT_SPEED = 4.4;

/* --- parcels -------------------------------------------------------------- */

const PARCEL_POOL = 12;

/**
 * Wide enough that a parcel is always clear of the blade before the one behind
 * it books a swing — see SWITCH_LEAD and SWITCH_CLEAR.
 */
const SPAWN_GAP = 2.3;
const SPAWN_JITTER = 0.3;

/** The parcel box sits on its local y = -1 face. */
const PARCEL_FLOOR = 1;

/* --- diverter ------------------------------------------------------------- */

const SWITCH_ANGLE = THREE.MathUtils.degToRad(30);
const SWITCH_DURATION = 0.42;

/**
 * How far up the line a parcel books the blade — around twice the swing, so the
 * arm is visibly waiting by the time the parcel gets there.
 */
const SWITCH_LEAD = 4;

/** How far past the blade a parcel has to be before it stops owning it. */
const SWITCH_CLEAR = 4.5;

/** Where the blade starts pushing a parcel off the centre line. */
const DIVERT_X = 10.9;

/* --- fog ------------------------------------------------------------------ */

/**
 * Distance fog would thin out as the camera dives, so the fade runs off the
 * horizontal distance to this point instead: a fixed white cylinder around the
 * sorter that the belts run out of and back into, whatever the camera does.
 */
const FOG_FOCUS = new THREE.Vector2(4, 0);
const FOG_NEAR = 10.5;
const FOG_FAR = 15.5;

const FOG_PATCH = /* glsl */ `
#include <fog_vertex>
#ifdef USE_FOG
  vec4 parcelFogWorld = vec4( transformed, 1.0 );
  #ifdef USE_INSTANCING
    parcelFogWorld = instanceMatrix * parcelFogWorld;
  #endif
  parcelFogWorld = modelMatrix * parcelFogWorld;
  vFogDepth = length( parcelFogWorld.xz - uFogFocus );
#endif
`;

/* --- camera --------------------------------------------------------------- */

/** Scroll 0: the whole process read from above. */
const CAM_TOP = new THREE.Vector3(2.7, 16, 22.4);
const CAM_TOP_LOOK = new THREE.Vector3(FOG_FOCUS.x, 0, 2.5);

/** Scroll 1: down at belt height, watching parcels take the junction. */
const CAM_LOW = new THREE.Vector3(1.7, 6.7, 11.8);
const CAM_LOW_LOOK = new THREE.Vector3(12, 0.9, -0.5);

/** Bows the descent out over the belts instead of cutting through them. */
const CAM_BOW = new THREE.Vector3(0, 11, 17.5);

const BASE_FOV = 33;

/** The canvas shape the two camera positions were framed against. */
const FRAME_ASPECT = 2.2;

/**
 * A narrower canvas has to buy back the width it lost. Stepping back keeps the
 * angles the shots were built on, so it goes first; the lens only widens for
 * what is left over, and both stop before the view turns into a fisheye.
 */
const MAX_DOLLY = 1.9;
const MAX_LENS = 1.35;

const UNIT = new THREE.Vector3(1, 1, 1);

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

const smoothstep = (t: number) => t * t * (3 - 2 * t);

const easeInOut = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

type Route = {
  curve: THREE.CatmullRomCurve3;
  length: number;
  /** Arc length at which the blade takes hold of the parcel. */
  divertAt: number;
  /** Blade angle that sends a parcel down this branch. */
  armAngle: number;
};

type Parcel = {
  object: THREE.Object3D;
  route: Route;
  distance: number;
  yaw: number;
  active: boolean;
  booked: boolean;
};

/**
 * GLTFLoader strips the dots out of Blender's `Conveyor.001` names, so lookups
 * compare a form with the punctuation taken off both sides.
 */
const findNode = (root: THREE.Object3D, name: string) => {
  const plain = (value: string) => value.replace(/[^a-z0-9]/gi, "").toLowerCase();
  const wanted = plain(name);
  let found: THREE.Object3D | undefined;

  root.traverse((object) => {
    if (!found && plain(object.name) === wanted) found = object;
  });

  return found;
};

/**
 * Reads a branch conveyor off the model: where its belt starts and which way it
 * runs, so the parcel routes follow the model rather than a copy of its numbers.
 */
const readBranch = (node: THREE.Object3D) => {
  node.updateWorldMatrix(true, false);

  const origin = new THREE.Vector3().setFromMatrixPosition(node.matrixWorld);
  const direction = new THREE.Vector3(1, 0, 0)
    .transformDirection(node.matrixWorld)
    .setY(0)
    .normalize();

  return { origin, direction };
};

/**
 * The path a parcel takes: in from the fog along the centre line, across the
 * transfer plate, then out along one of the branches until the fog takes it.
 */
const buildRoute = (
  branch: { origin: THREE.Vector3; direction: THREE.Vector3 },
  mainY: number,
): Route => {
  const branchY = branch.origin.y + ROLLER_RADIUS;
  const side = Math.sign(branch.direction.z) || 1;

  const onBranch = (metres: number) =>
    new THREE.Vector3(
      branch.origin.x + branch.direction.x * metres,
      branchY,
      branch.origin.z + branch.direction.z * metres,
    );

  const curve = new THREE.CatmullRomCurve3(
    [
      new THREE.Vector3(-13, mainY, 0),
      new THREE.Vector3(-7, mainY, 0),
      new THREE.Vector3(-1, mainY, 0),
      new THREE.Vector3(6, mainY, 0),
      new THREE.Vector3(DIVERT_X, mainY, 0.1 * side),
      new THREE.Vector3(11.85, (mainY + branchY) / 2, 0.78 * side),
      onBranch(1.3),
      onBranch(2.6),
      onBranch(5.4),
      onBranch(9.5),
      onBranch(14),
    ],
    false,
    "centripetal",
  );

  const length = curve.getLength();

  // The blade sits on the +z side of the parcel it pushes to -z, and the other
  // way round — so the branch is served by the angle pointing away from it.
  return {
    curve,
    length,
    divertAt: length * findDivertFraction(curve),
    armAngle: -side * SWITCH_ANGLE,
  };
};

/** Walks the curve to find where it reaches the blade. */
const findDivertFraction = (curve: THREE.CatmullRomCurve3) => {
  const probe = new THREE.Vector3();

  for (let step = 0; step <= 200; step += 1) {
    const u = step / 200;

    curve.getPointAt(u, probe);

    if (probe.x >= DIVERT_X) return u;
  }

  return 0.75;
};

export default function ParcelScene() {
  const stageRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stage = stageRef.current;

    if (!stage) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Owned by the effect rather than by React: teardown hands the GL context
    // back by losing it, and a canvas that has been through that can never get
    // another one — so each run has to start from a canvas of its own.
    const canvas = document.createElement("canvas");

    canvas.className = styles.canvas;
    stage.prepend(canvas);

    // A browser that is out of WebGL contexts hands back one that is already
    // lost, which throws while three reads its capabilities. The hero has to
    // survive that: it just stays the plain paper background.
    let renderer: THREE.WebGLRenderer;

    try {
      // No powerPreference on purpose. Asking for "high-performance" makes a Mac
      // with switchable graphics move to the discrete GPU, and that switch loses
      // every context already on the page — here, the logo's.
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    } catch {
      canvas.remove();
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.3;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf5f6f8);
    scene.fog = new THREE.Fog(0xf5f6f8, FOG_NEAR, FOG_FAR);

    let environment: THREE.WebGLRenderTarget | null = null;

    /**
     * The studio reflections the metal reads against. Both the generator and the
     * room it renders are one-shot — the map is all that outlives them — and it
     * has to be rebuilt after a context loss, because unlike a loaded texture it
     * has no CPU-side copy for three to re-upload.
     */
    const buildEnvironment = () => {
      const pmrem = new THREE.PMREMGenerator(renderer);
      const room = new RoomEnvironment();

      environment?.dispose();
      environment = pmrem.fromScene(room, 0.04);
      scene.environment = environment.texture;

      pmrem.dispose();
      room.dispose();
    };

    buildEnvironment();

    // Kept low (~30°) so parcels throw their shadow along the belt rather than
    // straight down into the gap between rollers, where it would not read.
    const key = new THREE.DirectionalLight(0xf5f6f8, 20);
    key.position.set(14, 8, 9);
    key.castShadow = true;
    key.shadow.mapSize.set(2048, 2048);
    key.shadow.camera.near = 1;
    key.shadow.camera.far = 60;
    // Wide enough to hold the whole line; past the fog nothing is visible anyway.
    key.shadow.camera.left = -24;
    key.shadow.camera.right = 24;
    key.shadow.camera.top = 22;
    key.shadow.camera.bottom = -22;
    // DirectionalLightShadow never rebuilds this itself, so without it the
    // frustum stays at its default ±5 and almost nothing casts.
    key.shadow.camera.updateProjectionMatrix();
    // Rollers are round and tightly packed, which is exactly where acne shows.
    key.shadow.normalBias = 0.06;
    key.shadow.bias = -0.0004;
    key.target.position.set(FOG_FOCUS.x, 0, FOG_FOCUS.y);
    scene.add(key);
    scene.add(key.target);

    // Fill is kept low on purpose: a shadow is only ever as dark as the light
    // that reaches into it, so the ambient rig is what sets shadow depth here.
    const rim = new THREE.DirectionalLight(0xf5f6f8, 0.3);
    rim.position.set(-8, 6, -9);
    scene.add(rim);

    scene.add(new THREE.HemisphereLight(0xf5f6f8, 0xb4c2d2, 0.45));

    const camera = new THREE.PerspectiveCamera(BASE_FOV, 1, 0.5, 200);
    camera.position.copy(CAM_TOP);

    const camPath = new THREE.QuadraticBezierCurve3(CAM_TOP, CAM_BOW, CAM_LOW);
    const camLook = new THREE.Vector3().copy(CAM_TOP_LOOK);

    /* --- scroll ---------------------------------------------------------- */

    const driver = stage.closest<HTMLElement>("[data-scroll-stage]");
    let scrollTarget = 0;
    let scrollShown = 0;

    const readScroll = () => {
      if (!driver) {
        scrollTarget = 0;
        return;
      }

      const rect = driver.getBoundingClientRect();
      const travel = rect.height - window.innerHeight;

      scrollTarget = travel > 1 ? clamp01(-rect.top / travel) : 0;
    };

    readScroll();
    scrollShown = scrollTarget;

    window.addEventListener("scroll", readScroll, { passive: true });

    /* --- sizing ---------------------------------------------------------- */

    /** How far back the shots have to stand on this canvas shape. */
    let dolly = 1;

    const resize = () => {
      const width = stage.clientWidth;
      const height = stage.clientHeight;

      if (!width || !height) return;

      const aspect = width / height;
      const missing = Math.max(1, FRAME_ASPECT / aspect);

      dolly = Math.min(missing, MAX_DOLLY);

      const lens = Math.min(missing / dolly, MAX_LENS);

      renderer.setSize(width, height, false);
      camera.aspect = aspect;
      camera.fov = THREE.MathUtils.radToDeg(
        2 * Math.atan(Math.tan(THREE.MathUtils.degToRad(BASE_FOV) / 2) * lens),
      );
      camera.updateProjectionMatrix();
    };

    resize();

    const observer = new ResizeObserver(() => {
      resize();
      readScroll();
    });
    observer.observe(stage);

    /* --- model ----------------------------------------------------------- */

    const fogFocus = { value: FOG_FOCUS.clone() };
    const rollers: THREE.InstancedMesh[] = [];
    const parcels: Parcel[] = [];
    const routes: Route[] = [];

    let model: THREE.Object3D | null = null;
    let switcher: THREE.Object3D | null = null;
    let disposed = false;

    const dressMaterial = (material: THREE.Material) => {
      if (material instanceof THREE.MeshStandardMaterial) {
        material.envMapIntensity = 0.45;
      }

      material.onBeforeCompile = (shader) => {
        shader.uniforms.uFogFocus = fogFocus;
        shader.vertexShader =
          "uniform vec2 uFogFocus;\n" +
          shader.vertexShader.replace("#include <fog_vertex>", FOG_PATCH);
      };
      material.customProgramCacheKey = () => "parcel-world-fog";
    };

    /** Stamps one roller into a row of instances running down its conveyor. */
    const instanceRollers = (source: THREE.Mesh) => {
      const parent = source.parent;

      if (!parent) return;

      const row = new THREE.InstancedMesh(
        source.geometry,
        source.material,
        ROLLERS_PER_CONVEYOR,
      );

      row.name = `${source.name}:row`;
      row.position.copy(source.position);
      row.quaternion.copy(source.quaternion);
      row.scale.copy(source.scale);
      row.castShadow = true;
      row.receiveShadow = true;
      // The row reaches far past the single roller's bounds.
      row.frustumCulled = false;

      parent.add(row);
      source.removeFromParent();
      rollers.push(row);
    };

    /** Lays each row out down its conveyor. The matrices never change after. */
    const placeRollers = () => {
      const turn = new THREE.Quaternion();
      const offset = new THREE.Vector3();
      const matrix = new THREE.Matrix4();

      rollers.forEach((row) => {
        for (let index = 0; index < ROLLERS_PER_CONVEYOR; index += 1) {
          // Blender's local +Z on the roller lands on +Y here, and points down
          // the conveyor once the node's own rotation is applied.
          offset.set(0, ROLLER_PITCH * index, 0);
          matrix.compose(offset, turn, UNIT);
          row.setMatrixAt(index, matrix);
        }

        row.instanceMatrix.needsUpdate = true;
      });
    };

    /* --- diverter -------------------------------------------------------- */

    let armAngle = 0;
    let armFrom = 0;
    let armTo = 0;
    let armTime = 1;

    /** The parcel the blade is currently set for; nothing else may move it. */
    let armOwner: Parcel | null = null;

    const bookArm = (angle: number) => {
      if (Math.abs(angle - armTo) < 1e-3) return;

      armFrom = armAngle;
      armTo = angle;
      armTime = 0;
    };

    const driveArm = (delta: number) => {
      if (!switcher || armTime >= 1) return;

      armTime = Math.min(1, armTime + delta / SWITCH_DURATION);

      if (armTime >= 1) {
        armAngle = armTo;
      } else {
        const span = armTo - armFrom;
        // A short damped wobble at the end reads as a stop being hit.
        const settle =
          Math.sin(armTime * Math.PI * 3) * (1 - armTime) * (1 - armTime) * 0.1;

        armAngle = armFrom + span * (easeInOut(armTime) + settle);
      }

      switcher.rotation.y = armAngle;
    };

    /* --- parcels --------------------------------------------------------- */

    let sinceSpawn = 0;
    let nextGap = SPAWN_GAP;
    let lastRoute = 0;
    let sameRun = 0;

    /** Sides are picked at random, but never three the same way in a row. */
    const pickRoute = () => {
      let index = Math.random() < 0.5 ? 0 : 1;

      if (index === lastRoute) {
        sameRun += 1;

        if (sameRun >= 2) {
          index = 1 - lastRoute;
          sameRun = 0;
        }
      } else {
        sameRun = 0;
      }

      lastRoute = index;

      return routes[index];
    };

    const launch = (parcel: Parcel, distance: number) => {
      parcel.route = pickRoute();
      parcel.distance = distance;
      parcel.yaw = (Math.random() - 0.5) * 0.9;
      parcel.active = true;
      parcel.booked = false;
      parcel.object.visible = true;

      const size = 0.82 + Math.random() * 0.3;

      parcel.object.scale.set(
        size * (0.94 + Math.random() * 0.12),
        size * (0.9 + Math.random() * 0.2),
        size * (0.94 + Math.random() * 0.12),
      );
    };

    const point = new THREE.Vector3();
    const tangent = new THREE.Vector3();

    const driveParcels = (delta: number) => {
      parcels.forEach((parcel) => {
        if (!parcel.active) return;

        parcel.distance += BELT_SPEED * delta;

        if (parcel.distance >= parcel.route.length) {
          parcel.active = false;
          parcel.object.visible = false;
          return;
        }

        const u = parcel.distance / parcel.route.length;

        parcel.route.curve.getPointAt(u, point);
        parcel.route.curve.getTangentAt(u, tangent);

        parcel.object.position.set(
          point.x,
          point.y + PARCEL_FLOOR * parcel.object.scale.y,
          point.z,
        );
        parcel.object.rotation.y = Math.atan2(-tangent.z, tangent.x) + parcel.yaw;
      });

      bookBlade();
    };

    /**
     * Hands the blade to the parcel closest to it, and holds it there until that
     * parcel is through. Without the hold, a parcel further up the line could
     * swing the blade out from under the one being sorted.
     */
    const bookBlade = () => {
      if (
        armOwner &&
        (!armOwner.active ||
          armOwner.distance > armOwner.route.divertAt + SWITCH_CLEAR)
      ) {
        armOwner = null;
      }

      if (armOwner) return;

      let next: Parcel | null = null;

      parcels.forEach((parcel) => {
        if (!parcel.active || parcel.booked) return;
        if (parcel.distance < parcel.route.divertAt - SWITCH_LEAD) return;
        if (!next || parcel.distance > next.distance) next = parcel;
      });

      if (!next) return;

      const claimed = next as Parcel;

      claimed.booked = true;
      armOwner = claimed;
      bookArm(claimed.route.armAngle);
    };

    const spawn = (delta: number) => {
      sinceSpawn += delta;

      if (sinceSpawn < nextGap) return;

      const free = parcels.find((parcel) => !parcel.active);

      if (!free) return;

      sinceSpawn = 0;
      nextGap = SPAWN_GAP + (Math.random() - 0.5) * 2 * SPAWN_JITTER;
      launch(free, 0);
    };

    /* --- frame ----------------------------------------------------------- */

    // Connected to the document so a backgrounded tab does not come back with
    // one huge delta and teleport every parcel down the line.
    const timer = new THREE.Timer();
    timer.connect(document);

    let frame = 0;
    let contextLost = false;

    // three's own listener already cancels the event, which is what asks the
    // browser for a new context; all this has to do is idle until it arrives
    // and put back the one thing three cannot restore on its own.
    const onContextLost = () => {
      contextLost = true;
      // The map's GPU objects died with the context, so drop the handle rather
      // than let the rebuild try to delete them against a different one.
      environment = null;
    };

    const onContextRestored = () => {
      if (disposed || !contextLost) return;

      contextLost = false;
      buildEnvironment();
      timer.reset();
      render();
    };

    canvas.addEventListener("webglcontextlost", onContextLost);
    canvas.addEventListener("webglcontextrestored", onContextRestored);

    const render = () => {
      if (disposed || contextLost) return;

      timer.update();

      const delta = Math.min(timer.getDelta(), 0.1);
      const step = reduceMotion ? 0 : delta;

      scrollShown += (scrollTarget - scrollShown) * Math.min(1, delta * 5);

      const eased = smoothstep(scrollShown);

      camPath.getPoint(eased, camera.position);
      camLook.lerpVectors(CAM_TOP_LOOK, CAM_LOW_LOOK, eased);

      // Backing off along the shot's own sight line keeps its angle intact.
      if (dolly !== 1) {
        camera.position.sub(camLook).multiplyScalar(dolly).add(camLook);
      }

      camera.lookAt(camLook);

      spawn(step);
      driveParcels(step);
      driveArm(step);

      renderer.render(scene, camera);
      frame = window.requestAnimationFrame(render);
    };

    /* --- load ------------------------------------------------------------ */

    new GLTFLoader().load(MODEL_URL, (gltf) => {
      if (disposed) return;

      const root = gltf.scene;

      model = root;

      // The model's own lights are authored in Blender's photometric units; the
      // rig above is built for the flat white studio this sits in.
      root
        .getObjectsByProperty("isLight", true)
        .forEach((light) => light.removeFromParent());

      const cylinders: THREE.Mesh[] = [];

      root.traverse((object) => {
        if (!(object instanceof THREE.Mesh)) return;

        const materials = Array.isArray(object.material)
          ? object.material
          : [object.material];

        materials.forEach(dressMaterial);

        // Set before the parcel pool is cloned, so the clones inherit it.
        object.castShadow = true;
        object.receiveShadow = true;

        if (object.name.startsWith("Cylinder")) cylinders.push(object);
      });

      cylinders.forEach(instanceRollers);
      placeRollers();

      switcher = findNode(root, "Switcher") ?? null;

      const mainConveyor = findNode(root, "Conveyor");
      const mainY = (mainConveyor?.position.y ?? 0) + ROLLER_RADIUS;

      ["Conveyor.001", "Conveyor.002"].forEach((name) => {
        const branch = findNode(root, name);

        if (branch) routes.push(buildRoute(readBranch(branch), mainY));
      });

      const template = findNode(root, "Parcel");

      if (template && routes.length === 2) {
        template.removeFromParent();

        for (let index = 0; index < PARCEL_POOL; index += 1) {
          const object = template.clone(true);

          object.visible = false;
          root.add(object);

          parcels.push({
            object,
            route: routes[0],
            distance: 0,
            yaw: 0,
            active: false,
            booked: false,
          });
        }

        // Open on a line that is already running rather than an empty belt. The
        // youngest is a whole gap up the belt, so the spawner picks up in step.
        for (let index = 0; index < 5; index += 1) {
          launch(parcels[index], index * BELT_SPEED * SPAWN_GAP);
        }

        // Parcels that open at or past the blade were sorted before the scene
        // started, so they must not re-book it. The blade is parked for the
        // nearest of them — the one whose turn it still is.
        const settled = parcels
          .filter(
            (parcel) =>
              parcel.active &&
              parcel.distance > parcel.route.divertAt - SWITCH_LEAD,
          )
          .sort((a, b) => a.distance - b.distance);

        settled.forEach((parcel) => {
          parcel.booked = true;
        });

        const crossing = settled[0];

        if (crossing) {
          armAngle = crossing.route.armAngle;
          armFrom = armAngle;
          armTo = armAngle;

          if (crossing.distance < crossing.route.divertAt + SWITCH_CLEAR) {
            armOwner = crossing;
          }
        }

        if (switcher) switcher.rotation.y = armAngle;

        driveParcels(0);
      }

      scene.add(root);
      setReady(true);
    });

    render();

    return () => {
      disposed = true;
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", readScroll);
      canvas.removeEventListener("webglcontextlost", onContextLost);
      canvas.removeEventListener("webglcontextrestored", onContextRestored);
      observer.disconnect();
      timer.disconnect();

      model?.traverse((object) => {
        if (!(object instanceof THREE.Mesh)) return;

        object.geometry.dispose();

        const materials = Array.isArray(object.material)
          ? object.material
          : [object.material];

        materials.forEach((material) => material.dispose());
      });

      environment?.dispose();
      renderer.dispose();
      // dispose() leaves the GL context alive; without this every remount
      // strands one and the browser eventually refuses to hand out more.
      renderer.forceContextLoss();
      canvas.remove();
    };
  }, []);

  return (
    <div className={styles.stage} ref={stageRef} data-ready={ready} aria-hidden="true">
      {/* the canvas is prepended here by the effect */}
      <div className={styles.veil} />
    </div>
  );
}
