import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Cpu, Layers, Pause, Play, RotateCcw } from 'lucide-react';

export type CubeCoreFinish = 'amber' | 'cyan' | 'titanium';

const CUBE_FINISH_OPTIONS: { id: CubeCoreFinish; label: string; swatch: string }[] = [
  { id: 'amber', label: 'Amber', swatch: '#F59E0B' },
  { id: 'cyan', label: 'Cyan', swatch: '#38BDF8' },
  { id: 'titanium', label: 'Titanium', swatch: '#CBD5E1' },
];

interface TelemetryCube3DProps {
  syncStatus: 'baked' | 'syncing' | 'live' | 'cached';
  repoCount: number;
  packageCount: number;
}

function createAnodizedBrushedTexture(maxAnisotropy: number): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#7e838c';
    ctx.fillRect(0, 0, 256, 256);
    for (let y = 0; y < 256; y++) {
      const lum = 92 + ((y * 47) % 52) + Math.round(Math.sin(y * 0.6) * 14);
      ctx.fillStyle = `rgb(${lum},${lum},${lum})`;
      ctx.fillRect(0, y, 256, 1);
    }
    for (let i = 0; i < 460; i++) {
      const x = (i * 83) % 256;
      const y = (i * 131) % 256;
      const w = 16 + (i % 56);
      ctx.fillStyle = i % 2 === 0 ? 'rgba(255,255,255,0.14)' : 'rgba(12,16,24,0.18)';
      ctx.fillRect(x, y, w, 1);
    }
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(2, 2);
  tex.anisotropy = maxAnisotropy;
  return tex;
}

function createChamferedSquareShape(half: number, chamfer: number): THREE.Shape {
  const s = new THREE.Shape();
  s.moveTo(-half + chamfer, -half);
  s.lineTo(half - chamfer, -half);
  s.lineTo(half, -half + chamfer);
  s.lineTo(half, half - chamfer);
  s.lineTo(half - chamfer, half);
  s.lineTo(-half + chamfer, half);
  s.lineTo(-half, half - chamfer);
  s.lineTo(-half, -half + chamfer);
  s.closePath();
  return s;
}

function createWindowedFrameGeometry(
  outerHalf: number,
  innerHalf: number,
  depth: number,
  chamfer = 0.14,
): THREE.ExtrudeGeometry {
  const shape = createChamferedSquareShape(outerHalf, chamfer);
  const hole = new THREE.Path();
  const c = chamfer * 0.7;
  hole.moveTo(-innerHalf + c, -innerHalf);
  hole.lineTo(-innerHalf, -innerHalf + c);
  hole.lineTo(-innerHalf, innerHalf - c);
  hole.lineTo(-innerHalf + c, innerHalf);
  hole.lineTo(innerHalf - c, innerHalf);
  hole.lineTo(innerHalf, innerHalf - c);
  hole.lineTo(innerHalf, -innerHalf + c);
  hole.lineTo(innerHalf - c, -innerHalf);
  hole.closePath();
  shape.holes.push(hole);

  const geo = new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: true,
    bevelThickness: 0.025,
    bevelSize: 0.022,
    bevelSegments: 2,
  });
  geo.center();
  return geo;
}

function createBeveledPlateGeometry(
  halfW: number,
  halfH: number,
  depth: number,
  chamfer = 0.08,
): THREE.ExtrudeGeometry {
  const s = new THREE.Shape();
  s.moveTo(-halfW + chamfer, -halfH);
  s.lineTo(halfW - chamfer, -halfH);
  s.lineTo(halfW, -halfH + chamfer);
  s.lineTo(halfW, halfH - chamfer);
  s.lineTo(halfW - chamfer, halfH);
  s.lineTo(-halfW + chamfer, halfH);
  s.lineTo(-halfW, halfH - chamfer);
  s.lineTo(-halfW, -halfH + chamfer);
  s.closePath();

  const geo = new THREE.ExtrudeGeometry(s, {
    depth,
    bevelEnabled: true,
    bevelThickness: 0.02,
    bevelSize: 0.018,
    bevelSegments: 2,
  });
  geo.center();
  return geo;
}

const DEFAULT_CAM_POS = new THREE.Vector3(4.35, 3.55, 4.45);
const DEFAULT_TARGET = new THREE.Vector3(0, -0.16, 0);

export default function TelemetryCube3D({
  syncStatus,
  repoCount,
  packageCount,
}: TelemetryCube3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasMountRef = useRef<HTMLDivElement>(null);

  const [exploded, setExploded] = useState(false);
  const [paused, setPaused] = useState(false);
  const [coreFinish, setCoreFinish] = useState<CubeCoreFinish>('amber');
  const [contextLost, setContextLost] = useState(false);

  const resetCamRef = useRef<(() => void) | null>(null);
  const applyFinishRef = useRef<((mode: CubeCoreFinish) => void) | null>(null);
  const stateRef = useRef({
    exploded,
    paused,
    coreFinish,
    syncStatus,
    isVisible: true,
    reducedMotion: false,
    resettingCamera: false,
  });

  useEffect(() => {
    stateRef.current.exploded = exploded;
  }, [exploded]);

  useEffect(() => {
    stateRef.current.paused = paused;
  }, [paused]);

  useEffect(() => {
    stateRef.current.coreFinish = coreFinish;
    applyFinishRef.current?.(coreFinish);
  }, [coreFinish]);

  useEffect(() => {
    stateRef.current.syncStatus = syncStatus;
  }, [syncStatus]);

  useEffect(() => {
    const mount = canvasMountRef.current;
    const outer = containerRef.current;
    if (!mount || !outer) return;

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    stateRef.current.reducedMotion = motionQuery.matches;
    const onMotionChange = (e: MediaQueryListEvent) => {
      stateRef.current.reducedMotion = e.matches;
    };
    motionQuery.addEventListener('change', onMotionChange);

    const isSoftwareGl = (() => {
      const probe = document.createElement('canvas');
      const gl = probe.getContext('webgl2') || probe.getContext('webgl');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    const width = Math.max(mount.clientWidth, 260);
    const height = Math.max(mount.clientHeight, 300);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
      alpha: false,
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.22;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 1.75));
    renderer.setSize(width, height, false);
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';
    renderer.shadowMap.enabled = false;

    const onContextLost = (e: Event) => {
      e.preventDefault();
      setContextLost(true);
    };
    const onContextRestored = () => {
      setContextLost(false);
    };
    renderer.domElement.addEventListener('webglcontextlost', onContextLost);
    renderer.domElement.addEventListener('webglcontextrestored', onContextRestored);

    mount.innerHTML = '';
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const bgHex = 0x07090f;
    scene.background = new THREE.Color(bgHex);
    scene.fog = new THREE.FogExp2(bgHex, 0.045);

    const pmrem = new THREE.PMREMGenerator(renderer);
    const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTex;
    pmrem.dispose();

    const camera = new THREE.PerspectiveCamera(32, width / height, 0.1, 40);
    camera.position.copy(DEFAULT_CAM_POS);
    camera.lookAt(DEFAULT_TARGET);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.08;
    controls.enablePan = false;
    controls.minDistance = 4.2;
    controls.maxDistance = 9.2;
    controls.rotateSpeed = 0.72;
    controls.target.copy(DEFAULT_TARGET);

    const onControlStart = () => {
      stateRef.current.resettingCamera = false;
    };
    controls.addEventListener('start', onControlStart);

    resetCamRef.current = () => {
      stateRef.current.resettingCamera = true;
    };

    // 3-Point Studio Rim Lighting + Warm Internal Conduit Light
    const hemiLight = new THREE.HemisphereLight(0xdbeafe, 0x090d16, 0.95);
    hemiLight.position.set(0, 12, 0);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xfff1dc, 2.35);
    keyLight.position.set(6, 9, 5);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 1.95);
    rimLight.position.set(-7, 4, -6);
    scene.add(rimLight);

    const fillLight = new THREE.DirectionalLight(0xf59e0b, 0.85);
    fillLight.position.set(3, -5, 6);
    scene.add(fillLight);

    const coreLight = new THREE.PointLight(0xf59e0b, 5.2, 8.5, 1.5);
    coreLight.position.set(0, 0, 0);
    scene.add(coreLight);

    const maxAniso = renderer.capabilities.getMaxAnisotropy();
    const brushedTex = createAnodizedBrushedTexture(maxAniso);

    // Materials (high contrast roughness/metalness separation across adjacent components)
    const titaniumFrameMat = new THREE.MeshPhysicalMaterial({
      color: 0x3b4454,
      metalness: 0.94,
      roughness: 0.3,
      roughnessMap: brushedTex,
      bumpMap: brushedTex,
      bumpScale: 0.01,
      clearcoat: 0.5,
      clearcoatRoughness: 0.2,
      envMapIntensity: 1.45,
    });

    const darkAnodizedMat = new THREE.MeshPhysicalMaterial({
      color: 0x202938,
      metalness: 0.9,
      roughness: 0.35,
      roughnessMap: brushedTex,
      clearcoat: 0.35,
      envMapIntensity: 1.25,
    });

    const matteChassisMat = new THREE.MeshStandardMaterial({
      color: 0x0c111d,
      metalness: 0.32,
      roughness: 0.78,
    });

    const boltChromeMat = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      metalness: 0.96,
      roughness: 0.16,
      envMapIntensity: 1.5,
    });

    const amberConduitMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      emissive: 0xea580c,
      emissiveIntensity: 1.65,
      metalness: 0.22,
      roughness: 0.2,
    });

    const amberCoreGlowMat = new THREE.MeshBasicMaterial({
      color: 0xea580c,
      transparent: true,
      opacity: 0.3,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const cyanFiberMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x06b6d4,
      emissiveIntensity: 1.65,
      metalness: 0.1,
      roughness: 0.2,
    });

    const moteMat = new THREE.MeshBasicMaterial({ color: 0xfcd34d });

    const applyCubeFinish = (mode: CubeCoreFinish) => {
      if (mode === 'amber') {
        titaniumFrameMat.color.setHex(0x3b4454);
        darkAnodizedMat.color.setHex(0x202938);
        amberConduitMat.color.setHex(0xf59e0b);
        amberConduitMat.emissive.setHex(0xea580c);
        amberCoreGlowMat.color.setHex(0xea580c);
        cyanFiberMat.color.setHex(0x38bdf8);
        cyanFiberMat.emissive.setHex(0x06b6d4);
        coreLight.color.setHex(0xf59e0b);
        fillLight.color.setHex(0xf59e0b);
        moteMat.color.setHex(0xfcd34d);
      } else if (mode === 'cyan') {
        titaniumFrameMat.color.setHex(0x2d3a4f);
        darkAnodizedMat.color.setHex(0x162032);
        amberConduitMat.color.setHex(0x38bdf8);
        amberConduitMat.emissive.setHex(0x0284c7);
        amberCoreGlowMat.color.setHex(0x0284c7);
        cyanFiberMat.color.setHex(0xfcd34d);
        cyanFiberMat.emissive.setHex(0xd97706);
        coreLight.color.setHex(0x38bdf8);
        fillLight.color.setHex(0x38bdf8);
        moteMat.color.setHex(0x7dd3fc);
      } else {
        titaniumFrameMat.color.setHex(0x94a3b8);
        darkAnodizedMat.color.setHex(0x475569);
        amberConduitMat.color.setHex(0xe2e8f0);
        amberConduitMat.emissive.setHex(0x94a3b8);
        amberCoreGlowMat.color.setHex(0xcbd5e1);
        cyanFiberMat.color.setHex(0x38bdf8);
        cyanFiberMat.emissive.setHex(0x0284c7);
        coreLight.color.setHex(0xe2e8f0);
        fillLight.color.setHex(0x94a3b8);
        moteMat.color.setHex(0xf1f5f9);
      }
    };
    applyFinishRef.current = applyCubeFinish;
    applyCubeFinish(stateRef.current.coreFinish);

    const cubeRoot = new THREE.Group();
    scene.add(cubeRoot);

    // 1. Inner Dark Silicon Motherboard Chassis Core + Micro Circuit Blocks
    const innerCoreGeo = new THREE.BoxGeometry(1.44, 1.44, 1.44);
    const innerCoreMesh = new THREE.Mesh(innerCoreGeo, matteChassisMat);
    cubeRoot.add(innerCoreMesh);

    const innerGlowSphereGeo = new THREE.SphereGeometry(0.68, 20, 16);
    const innerGlowMesh = new THREE.Mesh(innerGlowSphereGeo, amberCoreGlowMat);
    cubeRoot.add(innerGlowMesh);

    // Instanced dark heatsink/chip modules mounted on the inner core
    const chipGeo = new THREE.BoxGeometry(0.18, 0.08, 0.18);
    const chipInstanced = new THREE.InstancedMesh(chipGeo, darkAnodizedMat, 48);
    const dummy = new THREE.Object3D();
    const faceNormals: Array<{
      axis: [number, number, number];
      rot: [number, number, number];
      kind: 'plate' | 'truss';
    }> = [
      { axis: [0, 1, 0], rot: [-Math.PI / 2, 0, 0], kind: 'plate' }, // Top
      { axis: [0, -1, 0], rot: [Math.PI / 2, 0, 0], kind: 'truss' }, // Bottom
      { axis: [1, 0, 0], rot: [0, Math.PI / 2, 0], kind: 'truss' }, // Right (X-brace)
      { axis: [-1, 0, 0], rot: [0, -Math.PI / 2, 0], kind: 'plate' }, // Left
      { axis: [0, 0, 1], rot: [0, 0, 0], kind: 'plate' }, // Front
      { axis: [0, 0, -1], rot: [0, Math.PI, 0], kind: 'truss' }, // Back
    ];

    let chipIdx = 0;
    const chipOffsets: Array<[number, number]> = [
      [-0.42, -0.42],
      [0.42, -0.42],
      [-0.42, 0.42],
      [0.42, 0.42],
      [0, -0.46],
      [0, 0.46],
      [-0.46, 0],
      [0.46, 0],
    ];
    faceNormals.forEach((f) => {
      const fMat = new THREE.Matrix4().makeRotationFromEuler(
        new THREE.Euler(f.rot[0], f.rot[1], f.rot[2]),
      );
      chipOffsets.forEach(([ox, oy]) => {
        const localPos = new THREE.Vector3(ox, oy, 0.75).applyMatrix4(fMat);
        dummy.position.copy(localPos);
        dummy.rotation.set(f.rot[0] + Math.PI / 2, f.rot[1], f.rot[2]);
        dummy.scale.set(0.9 + (chipIdx % 3) * 0.18, 1, 0.9 + ((chipIdx + 1) % 3) * 0.15);
        dummy.updateMatrix();
        chipInstanced.setMatrixAt(chipIdx++, dummy.matrix);
      });
    });
    chipInstanced.instanceMatrix.needsUpdate = true;
    chipInstanced.computeBoundingSphere();
    cubeRoot.add(chipInstanced);

    // 2. Glowing Amber-Gold Parallel Conduit Pipe Banks on all 6 Inner Faces (InstancedMesh)
    const conduitRodGeo = new THREE.CylinderGeometry(0.032, 0.032, 0.56, 10);
    // 6 faces * 2 banks * 4 rods = 48 glowing amber rods
    const conduitInstanced = new THREE.InstancedMesh(conduitRodGeo, amberConduitMat, 48);
    let rodIdx = 0;
    faceNormals.forEach((f, fIdx) => {
      const faceGroupMat = new THREE.Matrix4().makeRotationFromEuler(
        new THREE.Euler(f.rot[0], f.rot[1], f.rot[2]),
      );
      const bankOffsets = [-0.46, 0.46];
      const horizontal = fIdx % 2 === 0;
      bankOffsets.forEach((bankShift) => {
        for (let r = 0; r < 4; r++) {
          const spacing = (r - 1.5) * 0.092;
          const localP = horizontal
            ? new THREE.Vector3(bankShift, spacing, 0.81)
            : new THREE.Vector3(spacing, bankShift, 0.81);
          localP.applyMatrix4(faceGroupMat);

          const qFace = new THREE.Quaternion().setFromEuler(
            new THREE.Euler(f.rot[0], f.rot[1], f.rot[2]),
          );
          const qRod = new THREE.Quaternion().setFromEuler(
            new THREE.Euler(0, 0, horizontal ? Math.PI / 2 : 0),
          );
          qFace.multiply(qRod);

          dummy.position.copy(localP);
          dummy.quaternion.copy(qFace);
          dummy.scale.setScalar(1);
          dummy.updateMatrix();
          conduitInstanced.setMatrixAt(rodIdx++, dummy.matrix);
        }
      });
    });
    conduitInstanced.instanceMatrix.needsUpdate = true;
    conduitInstanced.computeBoundingSphere();
    cubeRoot.add(conduitInstanced);

    // 3. Delicate Electric Cyan Fiber-Optic Cable Bundles weaving inside cavities
    const fiberGroup = new THREE.Group();
    const fiberGeos: THREE.TubeGeometry[] = [];
    faceNormals.forEach((f, fIdx) => {
      const rotMat = new THREE.Matrix4().makeRotationFromEuler(
        new THREE.Euler(f.rot[0], f.rot[1], f.rot[2]),
      );
      for (let strand = 0; strand < 3; strand++) {
        const sign = strand % 2 === 0 ? 1 : -1;
        const offset = (strand - 1) * 0.16;
        const pts = [
          new THREE.Vector3(-0.72 * sign, -0.56 + offset, 0.82),
          new THREE.Vector3(-0.32 * sign, -0.22 + offset, 0.9),
          new THREE.Vector3(0.24 * sign, 0.28 - (fIdx % 2) * 0.12 + offset * 0.6, 0.89),
          new THREE.Vector3(0.68 * sign, 0.58 - offset * 0.5, 0.82),
        ].map((p) => p.applyMatrix4(rotMat));

        const curve = new THREE.CatmullRomCurve3(pts);
        const tubeGeo = new THREE.TubeGeometry(curve, 22, 0.012, 6, false);
        fiberGeos.push(tubeGeo);
        fiberGroup.add(new THREE.Mesh(tubeGeo, cyanFiberMat));
      }
    });
    cubeRoot.add(fiberGroup);

    // 4. Outer Machined Titanium Cage: 6 Explodable Beveled Face Assemblies
    const outerFrameGeo = createWindowedFrameGeometry(1.06, 0.8, 0.14, 0.16);
    const centerCapGeo = createBeveledPlateGeometry(0.36, 0.36, 0.11, 0.07);
    const bridgeBarGeo = new THREE.BoxGeometry(1.66, 0.14, 0.09);
    const diagStrutGeo = new THREE.BoxGeometry(1.72, 0.12, 0.08);
    const socketOuterGeo = createWindowedFrameGeometry(0.32, 0.19, 0.12, 0.06);
    const heatsinkFinGeo = new THREE.BoxGeometry(0.035, 0.19, 0.14);
    const boltGeo = new THREE.CylinderGeometry(0.032, 0.032, 0.05, 6);
    boltGeo.rotateX(Math.PI / 2);

    interface ExplodableFace {
      group: THREE.Group;
      normal: THREE.Vector3;
      baseOffset: number;
    }
    const explodableFaces: ExplodableFace[] = [];

    faceNormals.forEach((f) => {
      const faceGroup = new THREE.Group();
      const normal = new THREE.Vector3(...f.axis);
      const baseOffset = 0.99;
      faceGroup.position.copy(normal).multiplyScalar(baseOffset);
      faceGroup.rotation.set(f.rot[0], f.rot[1], f.rot[2]);

      // Main outer beveled aluminum frame
      faceGroup.add(new THREE.Mesh(outerFrameGeo, titaniumFrameMat));

      if (f.kind === 'truss') {
        // Diagonal X-brace truss + recessed central CPU processor socket (right face of reference!)
        const strutA = new THREE.Mesh(diagStrutGeo, darkAnodizedMat);
        strutA.rotation.z = Math.PI / 4;
        strutA.position.z = 0.01;
        const strutB = new THREE.Mesh(diagStrutGeo, darkAnodizedMat);
        strutB.rotation.z = -Math.PI / 4;
        strutB.position.z = 0.01;
        faceGroup.add(strutA, strutB);

        const socketBezel = new THREE.Mesh(socketOuterGeo, titaniumFrameMat);
        socketBezel.position.z = 0.035;
        faceGroup.add(socketBezel);

        const socketBacking = new THREE.Mesh(
          new THREE.BoxGeometry(0.38, 0.38, 0.05),
          matteChassisMat,
        );
        socketBacking.position.z = -0.02;
        faceGroup.add(socketBacking);
      } else {
        // Solid brushed center plate + cross bridges leaving 4 glowing amber window bays (top/left faces!)
        const hBridge = new THREE.Mesh(bridgeBarGeo, darkAnodizedMat);
        hBridge.position.z = 0.015;
        const vBridge = new THREE.Mesh(bridgeBarGeo, darkAnodizedMat);
        vBridge.rotation.z = Math.PI / 2;
        vBridge.position.z = 0.015;
        faceGroup.add(hBridge, vBridge);

        const cap = new THREE.Mesh(centerCapGeo, titaniumFrameMat);
        cap.position.z = 0.045;
        faceGroup.add(cap);
      }

      // 4 Corner Allen Bolts on each face plate
      const boltCoords: Array<[number, number]> = [
        [-0.91, -0.91],
        [0.91, -0.91],
        [-0.91, 0.91],
        [0.91, 0.91],
      ];
      boltCoords.forEach(([bx, by]) => {
        const bolt = new THREE.Mesh(boltGeo, boltChromeMat);
        bolt.position.set(bx, by, 0.08);
        faceGroup.add(bolt);
      });

      // Machined Ribbed Cooling Heatsink Fin Banks on 2 opposite edges of the face
      for (let side = -1; side <= 1; side += 2) {
        for (let fin = -3; fin <= 3; fin++) {
          const finMesh = new THREE.Mesh(heatsinkFinGeo, darkAnodizedMat);
          finMesh.position.set(fin * 0.072, side * 0.94, 0.055);
          faceGroup.add(finMesh);
        }
      }

      cubeRoot.add(faceGroup);
      explodableFaces.push({ group: faceGroup, normal, baseOffset });
    });

    // 5. 8 Chamfered Corner Bumpers locking the cube silhouette together
    const cornerGeo = new THREE.OctahedronGeometry(0.18, 0);
    const cornerInstanced = new THREE.InstancedMesh(cornerGeo, titaniumFrameMat, 8);
    let cIdx = 0;
    for (const sx of [-1, 1]) {
      for (const sy of [-1, 1]) {
        for (const sz of [-1, 1]) {
          dummy.position.set(sx * 0.98, sy * 0.98, sz * 0.98);
          dummy.rotation.set(0, Math.PI / 4, 0);
          dummy.scale.setScalar(1);
          dummy.updateMatrix();
          cornerInstanced.setMatrixAt(cIdx++, dummy.matrix);
        }
      }
    }
    cornerInstanced.instanceMatrix.needsUpdate = true;
    cornerInstanced.computeBoundingSphere();
    cubeRoot.add(cornerInstanced);

    // 6. Subtle Floating Golden Micro-Motes around the Server Cube
    const MOTE_COUNT = 44;
    const moteGeo = new THREE.OctahedronGeometry(0.018, 0);
    const moteInstanced = new THREE.InstancedMesh(moteGeo, moteMat, MOTE_COUNT);
    for (let i = 0; i < MOTE_COUNT; i++) {
      const radius = 1.95 + ((i * 31) % 100) * 0.016;
      const theta = (i / MOTE_COUNT) * Math.PI * 2 * 3.2;
      const y = (((i * 23) % 100) / 100 - 0.5) * 3.1;
      dummy.position.set(Math.cos(theta) * radius, y, Math.sin(theta) * radius);
      dummy.rotation.set(i * 0.4, i * 0.7, 0);
      dummy.scale.setScalar(0.55 + (i % 4) * 0.25);
      dummy.updateMatrix();
      moteInstanced.setMatrixAt(i, dummy.matrix);
    }
    moteInstanced.instanceMatrix.needsUpdate = true;
    moteInstanced.computeBoundingSphere();
    scene.add(moteInstanced);

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    const handleResize = () => {
      if (!mount) return;
      const w = Math.max(mount.clientWidth, 260);
      const h = Math.max(mount.clientHeight, 300);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
      if (stateRef.current.isVisible && !isDisposed) {
        renderer.render(scene, camera);
      }
    };
    const resizeObserver = new ResizeObserver(() => handleResize());
    resizeObserver.observe(mount);

    let frameId = 0;
    let isDisposed = false;
    const startTime = performance.now();
    let prevTime = startTime;
    let currentExplode = 0;

    function afterDraw(cb: () => void) {
      if (isDisposed) return;
      const gl = renderer.getContext() as WebGL2RenderingContext;
      if (gl && typeof gl.fenceSync === 'function') {
        const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
        gl.flush();
        const poll = () => {
          if (isDisposed) return;
          const status = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
          if (status === gl.UNSIGNALED) {
            frameId = window.setTimeout(poll, 5);
          } else {
            if (sync) gl.deleteSync(sync);
            frameId = window.setTimeout(cb, 80);
          }
        };
        frameId = window.setTimeout(poll, 5);
      } else {
        frameId = window.setTimeout(cb, 80);
      }
    }

    function scheduleNextFrame() {
      if (isDisposed || !stateRef.current.isVisible) return;
      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    }

    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        const visible = entries.some((entry) => entry.isIntersecting);
        const wasVisible = stateRef.current.isVisible;
        stateRef.current.isVisible = visible;
        if (visible && !wasVisible && !isDisposed) {
          cancelAnimationFrame(frameId);
          clearTimeout(frameId);
          prevTime = performance.now();
          tick();
        }
      },
      { threshold: 0.05 },
    );
    intersectionObserver.observe(outer);

    function tick() {
      if (isDisposed || !stateRef.current.isVisible) return;
      const now = performance.now();
      const dt = Math.min(Math.max((now - prevTime) / 1000, 0.001), 0.045);
      prevTime = now;
      const elapsed = (now - startTime) / 1000;
      const st = stateRef.current;

      // Smooth exponential damping for exploded-chassis inspection
      const targetExplode = st.exploded ? 1 : 0;
      currentExplode = THREE.MathUtils.damp(currentExplode, targetExplode, 6.5, dt);
      for (let i = 0; i < explodableFaces.length; i++) {
        const f = explodableFaces[i];
        f.group.position.copy(f.normal).multiplyScalar(f.baseOffset + currentExplode * 0.48);
      }

      // Gentle industrial levitation & rotation
      if (!st.paused && !st.reducedMotion) {
        cubeRoot.rotation.y += dt * (st.syncStatus === 'syncing' ? 0.65 : 0.22);
        cubeRoot.position.y = Math.sin(elapsed * 1.15) * 0.07;
        moteInstanced.rotation.y -= dt * 0.06;
      }

      // Subtle warm pulse on amber conduits proportional to live sync state
      const pulseSpeed = st.syncStatus === 'syncing' ? 5.2 : 1.7;
      const pulse = 0.5 + 0.5 * Math.sin(elapsed * pulseSpeed);
      amberConduitMat.emissiveIntensity = st.reducedMotion ? 1.65 : 1.45 + pulse * 0.45;
      coreLight.intensity = st.reducedMotion ? 5.2 : 4.8 + pulse * 1.4;

      if (st.resettingCamera) {
        camera.position.x = THREE.MathUtils.damp(camera.position.x, DEFAULT_CAM_POS.x, 6, dt);
        camera.position.y = THREE.MathUtils.damp(camera.position.y, DEFAULT_CAM_POS.y, 6, dt);
        camera.position.z = THREE.MathUtils.damp(camera.position.z, DEFAULT_CAM_POS.z, 6, dt);
        controls.target.x = THREE.MathUtils.damp(controls.target.x, DEFAULT_TARGET.x, 6, dt);
        controls.target.y = THREE.MathUtils.damp(controls.target.y, DEFAULT_TARGET.y, 6, dt);
        controls.target.z = THREE.MathUtils.damp(controls.target.z, DEFAULT_TARGET.z, 6, dt);
        if (camera.position.distanceTo(DEFAULT_CAM_POS) < 0.04) {
          st.resettingCamera = false;
        }
      }

      controls.update();
      renderer.render(scene, camera);
      scheduleNextFrame();
    }

    tick();

    return () => {
      isDisposed = true;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      intersectionObserver.disconnect();
      resizeObserver.disconnect();
      motionQuery.removeEventListener('change', onMotionChange);
      controls.removeEventListener('start', onControlStart);
      renderer.domElement.removeEventListener('webglcontextlost', onContextLost);
      renderer.domElement.removeEventListener('webglcontextrestored', onContextRestored);
      controls.dispose();

      innerCoreGeo.dispose();
      innerGlowSphereGeo.dispose();
      chipGeo.dispose();
      conduitRodGeo.dispose();
      fiberGeos.forEach((g) => g.dispose());
      outerFrameGeo.dispose();
      centerCapGeo.dispose();
      bridgeBarGeo.dispose();
      diagStrutGeo.dispose();
      socketOuterGeo.dispose();
      heatsinkFinGeo.dispose();
      boltGeo.dispose();
      cornerGeo.dispose();
      moteGeo.dispose();

      titaniumFrameMat.dispose();
      darkAnodizedMat.dispose();
      matteChassisMat.dispose();
      boltChromeMat.dispose();
      amberConduitMat.dispose();
      amberCoreGlowMat.dispose();
      cyanFiberMat.dispose();
      moteMat.dispose();
      brushedTex.dispose();
      envTex.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      data-testid="telemetry-cube-3d"
      data-core-finish={coreFinish}
      className="cad-frame relative flex h-[340px] w-full min-w-0 flex-col overflow-hidden rounded-xl border border-[#1E263B] bg-[#07090F] sm:h-[370px]"
    >
      <div ref={canvasMountRef} className="absolute inset-0 h-full w-full overflow-hidden" />

      {contextLost && (
        <div className="relative z-20 flex h-full w-full flex-col items-center justify-center bg-[#07090F]/95 p-6 text-center">
          <Cpu className="size-7 text-[#F59E0B]" aria-hidden="true" />
          <p className="mt-2 font-display text-sm font-semibold text-[#F4F5FA]">
            3D Core Paused
          </p>
          <p className="mt-1 text-xs text-[#A3A9BF]">Recovering WebGL context.</p>
        </div>
      )}

      {/* Top Left Minimal Spec Header (no backdrop-blur over WebGL) */}
      <div className="pointer-events-none relative z-10 flex items-center justify-between gap-2 p-3">
        <span className="inline-flex items-center gap-1.5 rounded-lg border border-[#1E263B] bg-[#0D111C]/95 px-2.5 py-1 font-mono text-[11px] text-[#C9CDE0] whitespace-nowrap">
          <Cpu className="size-3.5 text-[#F59E0B]" aria-hidden="true" />
          <span>Sync Core</span>
          <span aria-hidden="true">·</span>
          <span className="text-[#FCD34D] tabular-nums">
            {repoCount} repos · {packageCount} pkg
          </span>
        </span>
        <span className="hidden font-mono text-[11px] text-[#868CA6] sm:inline">
          Drag to orbit
        </span>
      </div>

      {/* Compact Bottom Control Bar (no viewport occlusion) */}
      <div className="pointer-events-none relative z-10 mt-auto flex items-center justify-center p-3">
        <div className="pointer-events-auto inline-flex flex-wrap items-center justify-center gap-1.5 rounded-lg border border-[#2D3854] bg-[#0D111C]/95 p-1 shadow-xl">
          <button
            type="button"
            onClick={() => setExploded((v) => !v)}
            aria-pressed={exploded}
            className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 font-mono text-[11px] font-medium transition-colors whitespace-nowrap shrink-0 ${
              exploded
                ? 'bg-[#F59E0B] font-semibold text-[#07090F]'
                : 'text-[#C9CDE0] hover:bg-[#141A29] hover:text-[#F4F5FA]'
            }`}
          >
            <Layers className="size-3" aria-hidden="true" />
            {exploded ? 'Assemble' : 'Explode'}
          </button>

          {/* Core Finish Switcher */}
          <div
            role="group"
            aria-label="Server core finish"
            className="flex items-center gap-0.5 rounded-md border border-[#1E263B] bg-[#07090F] p-0.5"
          >
            {CUBE_FINISH_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setCoreFinish(opt.id)}
                aria-pressed={coreFinish === opt.id}
                className={`inline-flex items-center gap-1 rounded px-2 py-0.5 font-mono text-[10px] font-medium transition-colors whitespace-nowrap shrink-0 ${
                  coreFinish === opt.id
                    ? 'bg-[#1E263B] text-[#FCD34D]'
                    : 'text-[#868CA6] hover:text-[#F4F5FA]'
                }`}
              >
                <span
                  aria-hidden="true"
                  className="size-1.5 rounded-full shrink-0"
                  style={{ backgroundColor: opt.swatch }}
                />
                {opt.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setPaused((v) => !v)}
            className="inline-flex items-center gap-1 rounded-md border border-[#1E263B] bg-[#141A29] px-2.5 py-1 font-mono text-[11px] text-[#F4F5FA] transition-colors hover:border-[#F59E0B] whitespace-nowrap shrink-0"
          >
            {paused ? (
              <>
                <Play className="size-3 text-[#F59E0B]" aria-hidden="true" />
                Resume
              </>
            ) : (
              <>
                <Pause className="size-3 text-[#F59E0B]" aria-hidden="true" />
                Pause
              </>
            )}
          </button>
          <button
            type="button"
            onClick={() => {
              setExploded(false);
              setPaused(false);
              setCoreFinish('amber');
              resetCamRef.current?.();
            }}
            aria-label="Reset 3D telemetry core view"
            className="inline-flex size-6 items-center justify-center rounded-md border border-[#1E263B] bg-[#141A29] text-[#C9CDE0] transition-colors hover:border-[#F59E0B] hover:text-[#F4F5FA] shrink-0"
          >
            <RotateCcw className="size-3" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
