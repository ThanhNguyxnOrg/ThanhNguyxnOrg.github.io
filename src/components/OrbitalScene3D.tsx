import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import {
  ChevronDown,
  ChevronUp,
  Compass,
  ExternalLink,
  Eye,
  Layers,
  Pause,
  Play,
  RotateCcw,
  Sparkles,
  Star,
} from 'lucide-react';
import type { OrgProject } from '../data/orgData';
import { assessProjectScientifically, computeOrbitalPositions } from '../utils/projectLogic';

export type MaterialFinish = 'obsidian-gold' | 'brushed-titanium' | 'optical-crystal';
export type CameraPreset = 'overview' | 'core' | 'top' | 'horizon';

interface OrbitalScene3DProps {
  projects: OrgProject[];
  selectedSlug: string;
  onSelectProject: (project: OrgProject) => void;
  onOpenDossier: (project: OrgProject) => void;
}

const CAMERA_PRESETS: Record<
  CameraPreset,
  { pos: [number, number, number]; target: [number, number, number] }
> = {
  overview: { pos: [0, 6.1, 13.9], target: [0, -1.18, 0] },
  core: { pos: [0, 2.2, 5.5], target: [0, 0.35, 0] },
  top: { pos: [0, 16.4, 0.01], target: [0, 0, 0] },
  horizon: { pos: [10.2, 2.1, 8.6], target: [0, -0.35, 0] },
};

function createCompassDialTexture(maxAnisotropy: number): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.clearRect(0, 0, 1024, 1024);
    const cx = 512;
    const cy = 512;

    // Soft radial floor illumination
    const grad = ctx.createRadialGradient(cx, cy, 20, cx, cy, 496);
    grad.addColorStop(0, 'rgba(245, 158, 11, 0.24)');
    grad.addColorStop(0.38, 'rgba(245, 158, 11, 0.07)');
    grad.addColorStop(0.75, 'rgba(56, 189, 248, 0.035)');
    grad.addColorStop(1, 'rgba(7, 9, 15, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx, cy, 496, 0, Math.PI * 2);
    ctx.fill();

    // Precision concentric calibration rings matching orbital track proportions
    [472, 396, 296, 196, 98].forEach((r, idx) => {
      ctx.strokeStyle =
        idx === 0
          ? 'rgba(245, 158, 11, 0.45)'
          : idx === 4
            ? 'rgba(56, 189, 248, 0.32)'
            : 'rgba(252, 211, 77, 0.18)';
      ctx.lineWidth = idx === 0 ? 2.2 : 1.2;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();
    });

    // 12 radial meridian spokes (every 30 deg)
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.11)';
    ctx.lineWidth = 1;
    for (let s = 0; s < 12; s++) {
      const a = (s / 12) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(a) * 98, cy + Math.sin(a) * 98);
      ctx.lineTo(cx + Math.cos(a) * 472, cy + Math.sin(a) * 472);
      ctx.stroke();
    }

    // 120 perimeter degree ticks
    for (let i = 0; i < 120; i++) {
      const angle = (i / 120) * Math.PI * 2;
      const isMajor = i % 10 === 0;
      const isMid = i % 5 === 0;
      const rInner = isMajor ? 440 : isMid ? 450 : 458;
      const rOuter = 470;
      ctx.strokeStyle = isMajor
        ? 'rgba(252, 211, 77, 0.88)'
        : isMid
          ? 'rgba(245, 158, 11, 0.48)'
          : 'rgba(148, 163, 184, 0.24)';
      ctx.lineWidth = isMajor ? 2.5 : 1.2;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(angle) * rInner, cy + Math.sin(angle) * rInner);
      ctx.lineTo(cx + Math.cos(angle) * rOuter, cy + Math.sin(angle) * rOuter);
      ctx.stroke();
    }
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = maxAnisotropy;
  return texture;
}

/**
 * Smooth radial glow texture for THREE.Sprite (zero hard polygon or sphere edges).
 */
function createRadialGlowTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const grad = ctx.createRadialGradient(128, 128, 2, 128, 128, 124);
    grad.addColorStop(0, 'rgba(254, 249, 195, 1.0)');
    grad.addColorStop(0.22, 'rgba(245, 158, 11, 0.68)');
    grad.addColorStop(0.52, 'rgba(245, 158, 11, 0.16)');
    grad.addColorStop(1, 'rgba(7, 9, 15, 0.0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 256, 256);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

// Pre-allocated math helpers outside animation loop for zero GC
const _targetCameraPos = new THREE.Vector3();
const _targetLookAt = new THREE.Vector3();
const _currentLookAt = new THREE.Vector3(0, -0.58, 0);
const _pointerNdc = new THREE.Vector2();
const _smoothPointer = new THREE.Vector2();
const _curveStart = new THREE.Vector3();
const _curveMid = new THREE.Vector3();
const _curveEnd = new THREE.Vector3();
const _tempVec = new THREE.Vector3();

export default function OrbitalScene3D({
  projects,
  selectedSlug,
  onSelectProject,
  onOpenDossier,
}: OrbitalScene3DProps) {
  const canvasMountRef = useRef<HTMLDivElement>(null);
  const [finish, setFinish] = useState<MaterialFinish>('obsidian-gold');
  const [cameraPreset, setCameraPreset] = useState<CameraPreset>('overview');
  const [explodeFactor, setExplodeFactor] = useState<number>(0);
  const [paused, setPaused] = useState<boolean>(false);
  const [dockCollapsed, setDockCollapsed] = useState<boolean>(true);
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);

  const stateRef = useRef({
    finish,
    cameraPreset,
    explodeFactor,
    paused,
    selectedSlug,
    hoveredSlug,
    activeCameraTransition: false,
    projects,
    onSelectProject,
  });

  useEffect(() => {
    stateRef.current.finish = finish;
  }, [finish]);

  useEffect(() => {
    stateRef.current.cameraPreset = cameraPreset;
    stateRef.current.activeCameraTransition = true;
  }, [cameraPreset]);

  useEffect(() => {
    stateRef.current.explodeFactor = explodeFactor;
  }, [explodeFactor]);

  useEffect(() => {
    stateRef.current.paused = paused;
  }, [paused]);

  useEffect(() => {
    stateRef.current.selectedSlug = selectedSlug;
  }, [selectedSlug]);

  useEffect(() => {
    stateRef.current.hoveredSlug = hoveredSlug;
  }, [hoveredSlug]);

  useEffect(() => {
    stateRef.current.projects = projects;
    stateRef.current.onSelectProject = onSelectProject;
  }, [projects, onSelectProject]);

  useEffect(() => {
    const mount = canvasMountRef.current;
    if (!mount) return;

    const isSoftwareGl = (() => {
      const probeCanvas = document.createElement('canvas');
      const gl = probeCanvas.getContext('webgl2') || probeCanvas.getContext('webgl');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    const width = Math.max(mount.clientWidth, 280);
    const height = Math.max(mount.clientHeight, 420);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
      alpha: false,
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.22;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height, false);
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    mount.innerHTML = '';
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const bgHex = 0x07090f;
    scene.background = new THREE.Color(bgHex);
    scene.fog = new THREE.FogExp2(bgHex, 0.022);

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envTexture = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTexture;
    pmremGenerator.dispose();

    const camera = new THREE.PerspectiveCamera(39, width / height, 0.1, 120);
    camera.position.set(...CAMERA_PRESETS.overview.pos);
    camera.lookAt(...CAMERA_PRESETS.overview.target);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.055;
    controls.rotateSpeed = 0.75;
    controls.zoomSpeed = 0.85;
    controls.maxPolarAngle = Math.PI * 0.48;
    controls.minDistance = 4.0;
    controls.maxDistance = 24;
    controls.target.set(...CAMERA_PRESETS.overview.target);

    const onControlStart = () => {
      stateRef.current.activeCameraTransition = false;
    };
    controls.addEventListener('start', onControlStart);

    // Studio 3-Point Lighting Rig
    const hemiLight = new THREE.HemisphereLight(0xdbeafe, 0x090d16, 0.95);
    hemiLight.position.set(0, 22, 0);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xffedd5, 2.35);
    keyLight.position.set(8, 15, 10);
    keyLight.castShadow = !isSoftwareGl;
    if (!isSoftwareGl) {
      keyLight.shadow.mapSize.width = 1024;
      keyLight.shadow.mapSize.height = 1024;
      const d = 11;
      keyLight.shadow.camera.left = -d;
      keyLight.shadow.camera.right = d;
      keyLight.shadow.camera.top = d;
      keyLight.shadow.camera.bottom = -d;
      keyLight.shadow.camera.near = 1;
      keyLight.shadow.camera.far = 35;
      keyLight.shadow.bias = -0.0005;
      keyLight.shadow.normalBias = 0.02;
    }
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 1.45);
    rimLight.position.set(-10, 7, -9);
    scene.add(rimLight);

    const FLOOR_Y = -0.35;
    const CORE_Y = 0.85;
    _curveStart.set(0, CORE_Y, 0);

    const corePointLight = new THREE.PointLight(0xf59e0b, 3.8, 19, 1.5);
    corePointLight.position.set(0, CORE_Y, 0);
    scene.add(corePointLight);

    const maxAniso = renderer.capabilities.getMaxAnisotropy();
    const dialTexture = createCompassDialTexture(maxAniso);
    const radialGlowTexture = createRadialGlowTexture();

    const primaryMetalMat = new THREE.MeshPhysicalMaterial({
      color: 0xf59e0b,
      metalness: 0.9,
      roughness: 0.14,
      clearcoat: 0.9,
      clearcoatRoughness: 0.08,
    });

    const darkStructuralMat = new THREE.MeshPhysicalMaterial({
      color: 0x1e293b,
      metalness: 0.85,
      roughness: 0.22,
      clearcoat: 0.7,
      clearcoatRoughness: 0.15,
    });

    const accentChromeMat = new THREE.MeshPhysicalMaterial({
      color: 0xfef3c7,
      metalness: 0.96,
      roughness: 0.08,
      clearcoat: 1.0,
    });

    // Custom GLSL Shader for the Central Harmonic Sun Core
    const coreShaderUniforms = {
      uTime: { value: 0 },
      uBaseColor: { value: new THREE.Color(0xd97706) },
      uRimColor: { value: new THREE.Color(0xfef08a) },
      uPulseColor: { value: new THREE.Color(0x38bdf8) },
    };

    const corePlasmaMat = new THREE.ShaderMaterial({
      uniforms: coreShaderUniforms,
      vertexShader: `
        uniform float uTime;
        varying vec3 vNormal;
        varying vec3 vViewPosition;
        varying float vDisplacement;

        void main() {
          float wave = sin(position.x * 4.0 + uTime * 1.8) * cos(position.y * 4.0 - uTime * 1.5) * cos(position.z * 4.0 + uTime * 1.2);
          float disp = wave * 0.03;
          vDisplacement = disp;

          vec3 newPos = position + normal * disp;
          vNormal = normalize(normalMatrix * normal);
          vec4 mvPosition = modelViewMatrix * vec4(newPos, 1.0);
          vViewPosition = -mvPosition.xyz;
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform vec3 uBaseColor;
        uniform vec3 uRimColor;
        uniform vec3 uPulseColor;
        varying vec3 vNormal;
        varying vec3 vViewPosition;
        varying float vDisplacement;

        void main() {
          vec3 normal = normalize(vNormal);
          vec3 viewDir = normalize(vViewPosition);
          float fresnel = pow(1.0 - max(0.0, dot(viewDir, normal)), 2.4);

          float band = smoothstep(-0.03, 0.03, vDisplacement);
          vec3 innerCol = mix(uBaseColor, uRimColor, band * 0.5);
          vec3 finalCol = mix(innerCol, uRimColor, fresnel * 0.92) + uPulseColor * pow(fresnel, 4.0) * 0.35;

          gl_FragColor = vec4(finalCol, 1.0);
        }
      `,
    });

    const masterGroup = new THREE.Group();
    scene.add(masterGroup);

    // Ground Astrolabe Plane at FLOOR_Y = -0.35
    const floorGroup = new THREE.Group();
    floorGroup.position.y = FLOOR_Y;
    masterGroup.add(floorGroup);

    const dialPlaneGeo = new THREE.CircleGeometry(9.6, 96);
    dialPlaneGeo.rotateX(-Math.PI / 2);
    const dialPlaneMat = new THREE.MeshBasicMaterial({
      map: dialTexture,
      transparent: true,
      opacity: 0.95,
      depthWrite: false,
    });
    const dialPlane = new THREE.Mesh(dialPlaneGeo, dialPlaneMat);
    dialPlane.position.y = 0.01;
    floorGroup.add(dialPlane);

    // Central Pedestal Base Ring on Floor directly under the Sun Core (grounds the core vertically)
    const coreFloorRingGeo = new THREE.RingGeometry(0.45, 1.05, 64);
    coreFloorRingGeo.rotateX(-Math.PI / 2);
    const coreFloorRingMat = new THREE.MeshBasicMaterial({
      color: 0xf59e0b,
      transparent: true,
      opacity: 0.38,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const coreFloorRing = new THREE.Mesh(coreFloorRingGeo, coreFloorRingMat);
    coreFloorRing.position.y = 0.025;
    floorGroup.add(coreFloorRing);

    // 3 Concentric 3D Torus Orbital Track Rings on Floor
    const trackRadii = [3.6, 5.8, 8.2];
    const trackMeshes: THREE.Mesh[] = [];
    trackRadii.forEach((r, idx) => {
      const torusTrackGeo = new THREE.TorusGeometry(r, 0.022, 16, 128);
      torusTrackGeo.rotateX(Math.PI / 2);
      const torusTrackMat = new THREE.MeshBasicMaterial({
        color: idx === 0 ? 0xf59e0b : idx === 1 ? 0xfcd34d : 0x38bdf8,
        transparent: true,
        opacity: idx === 0 ? 0.78 : idx === 1 ? 0.52 : 0.36,
      });
      const ringMesh = new THREE.Mesh(torusTrackGeo, torusTrackMat);
      ringMesh.position.y = 0.03 + idx * 0.004;
      floorGroup.add(ringMesh);
      trackMeshes.push(ringMesh);
    });

    // Central Symmetrical 3-Axis Armillary Astrolabe Core at (0, CORE_Y, 0)
    const coreAssembly = new THREE.Group();
    coreAssembly.position.set(0, CORE_Y, 0);
    masterGroup.add(coreAssembly);

    // Part 1: High-Subdivision Harmonic Plasma Sphere (centered at 0,0,0)
    const coreSphereGeo = new THREE.SphereGeometry(0.82, 64, 64);
    const coreMesh = new THREE.Mesh(coreSphereGeo, corePlasmaMat);
    coreAssembly.add(coreMesh);

    // Part 2: Seamless Radial Glow Sprite (centered at 0,0,0)
    const coreGlowSpriteMat = new THREE.SpriteMaterial({
      map: radialGlowTexture,
      color: 0xf59e0b,
      transparent: true,
      opacity: 0.78,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const coreGlowSprite = new THREE.Sprite(coreGlowSpriteMat);
    coreGlowSprite.scale.set(3.5, 3.5, 1);
    coreAssembly.add(coreGlowSprite);

    // Part 3: Horizontal Equatorial Horizon Ring with 8 Cardinal Calibration Nodes (100% symmetrical)
    const equatorialGroup = new THREE.Group();
    const eqRingGeo = new THREE.TorusGeometry(1.26, 0.028, 28, 128);
    eqRingGeo.rotateX(Math.PI / 2);
    const eqRingMesh = new THREE.Mesh(eqRingGeo, primaryMetalMat);
    equatorialGroup.add(eqRingMesh);

    const beadGeo = new THREE.SphereGeometry(0.052, 20, 20);
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      const bead = new THREE.Mesh(beadGeo, i % 2 === 0 ? accentChromeMat : primaryMetalMat);
      bead.position.set(Math.cos(a) * 1.26, 0, Math.sin(a) * 1.26);
      equatorialGroup.add(bead);
    }
    coreAssembly.add(equatorialGroup);

    // Part 4 & 5: Twin Symmetrical Inclined Meridian Gimbal Rings (+38 deg and -38 deg)
    const meridianRingGeo = new THREE.TorusGeometry(1.5, 0.022, 24, 128);
    const meridianGroupA = new THREE.Group();
    meridianGroupA.rotation.x = Math.PI * 0.21;
    const meridianMeshA = new THREE.Mesh(meridianRingGeo, accentChromeMat);
    meridianGroupA.add(meridianMeshA);
    coreAssembly.add(meridianGroupA);

    const meridianGroupB = new THREE.Group();
    meridianGroupB.rotation.x = -Math.PI * 0.21;
    const meridianMeshB = new THREE.Mesh(meridianRingGeo, primaryMetalMat);
    meridianGroupB.add(meridianMeshB);
    coreAssembly.add(meridianGroupB);

    // Part 6: Outer Ecliptic Precision Ring with 12 Degree Pearls
    const outerEclipticGroup = new THREE.Group();
    const outerRingGeo = new THREE.TorusGeometry(1.8, 0.018, 24, 128);
    outerRingGeo.rotateX(Math.PI / 2);
    const outerRingMesh = new THREE.Mesh(outerRingGeo, darkStructuralMat);
    outerEclipticGroup.add(outerRingMesh);

    const smallPearlGeo = new THREE.SphereGeometry(0.038, 16, 16);
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2;
      const p = new THREE.Mesh(smallPearlGeo, accentChromeMat);
      p.position.set(Math.cos(a) * 1.8, 0, Math.sin(a) * 1.8);
      outerEclipticGroup.add(p);
    }
    outerEclipticGroup.rotation.z = 0.22;
    coreAssembly.add(outerEclipticGroup);

    // Instanced Smooth Starlight Orbs
    const dustCount = 140;
    const dustGeo = new THREE.SphereGeometry(0.03, 12, 12);
    const dustMat = new THREE.MeshBasicMaterial({ color: 0xfcd34d });
    const dustInstanced = new THREE.InstancedMesh(dustGeo, dustMat, dustCount);
    const dummy = new THREE.Object3D();
    const dustColor = new THREE.Color();
    for (let i = 0; i < dustCount; i++) {
      const angle = (i * 137.5 * Math.PI) / 180;
      const radius = 2.5 + ((i * 29) % 85) * 0.1;
      const y = -0.15 + ((i * 19) % 50) * 0.08;
      dummy.position.set(Math.cos(angle) * radius, y, Math.sin(angle) * radius);
      const s = 0.5 + (i % 5) * 0.18;
      dummy.scale.setScalar(s);
      dummy.updateMatrix();
      dustInstanced.setMatrixAt(i, dummy.matrix);
      dustColor.setHex(i % 4 === 0 ? 0xf59e0b : i % 3 === 0 ? 0xfef08a : 0x38bdf8);
      dustInstanced.setColorAt(i, dustColor);
    }
    dustInstanced.instanceMatrix.needsUpdate = true;
    if (dustInstanced.instanceColor) dustInstanced.instanceColor.needsUpdate = true;
    dustInstanced.computeBoundingSphere();
    masterGroup.add(dustInstanced);

    // 19 Concentric, Co-Axial Sculptural Satellite Nodes + Dynamically Locked Energy Conduits & Photon Packets
    const orbitGroup = new THREE.Group();
    masterGroup.add(orbitGroup);

    const interactableHitMeshes: THREE.Mesh[] = [];
    const CURVE_SEGMENTS = 28;

    const satelliteRecords: {
      slug: string;
      group: THREE.Group;
      coreOrb: THREE.Object3D;
      innerGyro: THREE.Object3D;
      outerRing: THREE.Mesh;
      glowSprite: THREE.Sprite;
      stemPositions: Float32Array;
      stemLine: THREE.Line;
      floorAnchor: THREE.Mesh;
      conduitLine: THREE.Line;
      conduitPositions: Float32Array;
      photonPulse: THREE.Sprite;
      beaconMat: THREE.MeshPhysicalMaterial;
      nodeScale: number;
      ringIndex: number;
    }[] = [];

    const initialPositions = computeOrbitalPositions(stateRef.current.projects, 0);

    // Symmetrical Concentric Satellite Geometries (all centered at 0,0,0)
    const satOuterRingGeo = new THREE.TorusGeometry(0.45, 0.025, 24, 64);
    satOuterRingGeo.rotateX(Math.PI / 2);
    const satInnerGyroGeo = new THREE.TorusGeometry(0.33, 0.018, 20, 64);
    const satCoreSphereGeo = new THREE.SphereGeometry(0.2, 32, 32);
    const satCoreCrystalGeo = new THREE.OctahedronGeometry(0.22, 2);
    const satBaseDiscGeo = new THREE.RingGeometry(0.14, 0.25, 32);
    satBaseDiscGeo.rotateX(-Math.PI / 2);
    const satHitGeo = new THREE.SphereGeometry(0.75, 16, 16);
    const satHitMat = new THREE.MeshBasicMaterial({ visible: false });

    stateRef.current.projects.forEach((proj, idx) => {
      const nodePos = initialPositions[idx];
      const satGroup = new THREE.Group();
      const initialY = 0.45 + nodePos.yOffset * 0.55;
      satGroup.position.set(nodePos.x, initialY, nodePos.z);
      satGroup.scale.setScalar(nodePos.nodeScale);
      orbitGroup.add(satGroup);

      // 1. Center Core Gem/Sphere at exact (0, 0, 0)
      const coreOrb = new THREE.Mesh(
        proj.pattern === 'orbit' || proj.pattern === 'wave' ? satCoreSphereGeo : satCoreCrystalGeo,
        proj.stars >= 2 ? accentChromeMat : primaryMetalMat,
      );
      satGroup.add(coreOrb);

      // 2. Inner Tilted Gyroscopic Ring at exact (0, 0, 0)
      const innerGyro = new THREE.Mesh(satInnerGyroGeo, accentChromeMat);
      innerGyro.rotation.x = Math.PI / 3;
      satGroup.add(innerGyro);

      // 3. Outer Horizontal Status Halo Ring at exact (0, 0, 0)
      const beaconMat = new THREE.MeshPhysicalMaterial({
        color: proj.demoUrl ? 0xf59e0b : 0x38bdf8,
        emissive: proj.demoUrl ? 0xf59e0b : 0x0284c7,
        emissiveIntensity: proj.stars >= 2 ? 0.95 : 0.5,
        metalness: 0.88,
        roughness: 0.14,
        clearcoat: 1.0,
      });
      const outerRing = new THREE.Mesh(satOuterRingGeo, beaconMat);
      satGroup.add(outerRing);

      // 4. Soft Radial Sprite Aura at exact (0, 0, 0)
      const spriteMat = new THREE.SpriteMaterial({
        map: radialGlowTexture,
        color: proj.demoUrl ? 0xfcd34d : 0x38bdf8,
        transparent: true,
        opacity: 0.38,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const glowSprite = new THREE.Sprite(spriteMat);
      glowSprite.scale.set(1.35, 1.35, 1);
      satGroup.add(glowSprite);

      // 5. Dynamic Vertical Laser Anchor Stem connecting (0,0,0) straight down to exact FLOOR_Y
      const stemPositions = new Float32Array([
        0,
        0,
        0,
        0,
        (FLOOR_Y - initialY) / nodePos.nodeScale,
        0,
      ]);
      const stemGeo = new THREE.BufferGeometry();
      stemGeo.setAttribute('position', new THREE.BufferAttribute(stemPositions, 3));
      const stemMat = new THREE.LineBasicMaterial({
        color: proj.demoUrl ? 0xf59e0b : 0x38bdf8,
        transparent: true,
        opacity: 0.4,
      });
      const stemLine = new THREE.Line(stemGeo, stemMat);
      satGroup.add(stemLine);

      // Floor anchor target ring directly beneath the vertical stem (updated every frame so it stays flush on FLOOR_Y)
      const floorAnchor = new THREE.Mesh(
        satBaseDiscGeo,
        new THREE.MeshBasicMaterial({
          color: proj.demoUrl ? 0xf59e0b : 0x38bdf8,
          transparent: true,
          opacity: 0.5,
          side: THREE.DoubleSide,
          depthWrite: false,
        }),
      );
      floorAnchor.position.y = (FLOOR_Y - initialY + 0.02) / nodePos.nodeScale;
      satGroup.add(floorAnchor);

      // 6. Dynamic Curved Energy Conduit from Central Core to Satellite
      const conduitPositions = new Float32Array((CURVE_SEGMENTS + 1) * 3);
      const conduitGeo = new THREE.BufferGeometry();
      conduitGeo.setAttribute('position', new THREE.BufferAttribute(conduitPositions, 3));
      const conduitMat = new THREE.LineBasicMaterial({
        color: proj.demoUrl ? 0xfcd34d : 0x38bdf8,
        transparent: true,
        opacity: 0.28,
        blending: THREE.AdditiveBlending,
      });
      const conduitLine = new THREE.Line(conduitGeo, conduitMat);
      orbitGroup.add(conduitLine);

      // 7. Traveling Photon Energy Packet Sprite gliding along the Bezier conduit
      const photonMat = new THREE.SpriteMaterial({
        map: radialGlowTexture,
        color: proj.demoUrl ? 0xfef08a : 0x7dd3fc,
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const photonPulse = new THREE.Sprite(photonMat);
      photonPulse.scale.set(0.45, 0.45, 1);
      orbitGroup.add(photonPulse);

      // Raycast Proxy Sphere at exact (0, 0, 0)
      const hitMesh = new THREE.Mesh(satHitGeo, satHitMat);
      hitMesh.userData = { slug: proj.slug };
      satGroup.add(hitMesh);
      interactableHitMeshes.push(hitMesh);

      satelliteRecords.push({
        slug: proj.slug,
        group: satGroup,
        coreOrb,
        innerGyro,
        outerRing,
        glowSprite,
        stemPositions,
        stemLine,
        floorAnchor,
        conduitLine,
        conduitPositions,
        photonPulse,
        beaconMat,
        nodeScale: nodePos.nodeScale,
        ringIndex: nodePos.ringIndex,
      });
    });

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    const raycaster = new THREE.Raycaster();
    let lastRaycastTime = 0;

    const handlePointerMove = (e: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      _pointerNdc.set(nx, ny);

      const now = performance.now();
      if (now - lastRaycastTime < 45) return;
      lastRaycastTime = now;

      raycaster.setFromCamera(_pointerNdc, camera);
      const hits = raycaster.intersectObjects(interactableHitMeshes, false);
      if (hits.length > 0) {
        const slug = hits[0].object.userData.slug as string;
        setHoveredSlug(slug);
        renderer.domElement.style.cursor = 'pointer';
      } else {
        setHoveredSlug(null);
        renderer.domElement.style.cursor = 'grab';
      }
    };

    const handlePointerLeave = () => {
      _pointerNdc.set(0, 0);
      setHoveredSlug(null);
    };

    const handleClick = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      _pointerNdc.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      _pointerNdc.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(_pointerNdc, camera);
      const hits = raycaster.intersectObjects(interactableHitMeshes, false);
      if (hits.length > 0) {
        const slug = hits[0].object.userData.slug as string;
        const found = stateRef.current.projects.find((p) => p.slug === slug);
        if (found) {
          stateRef.current.onSelectProject(found);
        }
      }
    };

    renderer.domElement.addEventListener('pointermove', handlePointerMove);
    renderer.domElement.addEventListener('pointerleave', handlePointerLeave);
    renderer.domElement.addEventListener('click', handleClick);

    const handleResize = () => {
      if (!mount) return;
      const w = Math.max(mount.clientWidth, 280);
      const h = Math.max(mount.clientHeight, 420);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    };
    window.addEventListener('resize', handleResize);
    const resizeObserver = new ResizeObserver(() => handleResize());
    resizeObserver.observe(mount);

    let frameId = 0;
    let isDisposed = false;
    const startTime = performance.now();
    let prevTime = startTime;
    let currentExplode = 0;
    let orbitalAngle = 0;

    function afterDraw(cb: () => void) {
      if (isDisposed) return;
      const gl = renderer.getContext() as WebGL2RenderingContext;
      if (gl && typeof gl.fenceSync === 'function') {
        const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
        gl.flush();
        const poll = () => {
          if (isDisposed) return;
          const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
          if (state === gl.UNSIGNALED) {
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

    function tick() {
      if (isDisposed) return;
      const now = performance.now();
      const rawDelta = (now - prevTime) / 1000;
      prevTime = now;
      const dt = Math.min(Math.max(rawDelta, 0.001), 0.1);
      const elapsed = (now - startTime) / 1000;
      const st = stateRef.current;

      coreShaderUniforms.uTime.value = elapsed;

      if (st.finish === 'obsidian-gold') {
        primaryMetalMat.color.setHex(0xf59e0b);
        primaryMetalMat.metalness = 0.9;
        primaryMetalMat.roughness = 0.14;
        darkStructuralMat.color.setHex(0x1e293b);
        coreShaderUniforms.uBaseColor.value.setHex(0xd97706);
        coreShaderUniforms.uRimColor.value.setHex(0xfef08a);
      } else if (st.finish === 'brushed-titanium') {
        primaryMetalMat.color.setHex(0xe2e8f0);
        primaryMetalMat.metalness = 0.95;
        primaryMetalMat.roughness = 0.2;
        darkStructuralMat.color.setHex(0x334155);
        coreShaderUniforms.uBaseColor.value.setHex(0x64748b);
        coreShaderUniforms.uRimColor.value.setHex(0xf8fafc);
      } else {
        primaryMetalMat.color.setHex(0x38bdf8);
        primaryMetalMat.metalness = 0.35;
        primaryMetalMat.roughness = 0.08;
        darkStructuralMat.color.setHex(0x0f172a);
        coreShaderUniforms.uBaseColor.value.setHex(0x0284c7);
        coreShaderUniforms.uRimColor.value.setHex(0xe0f2fe);
      }

      // Subtle pointer parallax
      _smoothPointer.x = THREE.MathUtils.damp(_smoothPointer.x, _pointerNdc.x, 4, dt);
      _smoothPointer.y = THREE.MathUtils.damp(_smoothPointer.y, _pointerNdc.y, 4, dt);
      masterGroup.rotation.z = _smoothPointer.x * -0.032;
      masterGroup.rotation.x = _smoothPointer.y * 0.032;

      // Smoothly damp explodeFactor
      currentExplode = THREE.MathUtils.damp(currentExplode, st.explodeFactor, 6, dt);

      // Symmetrical expansion of Armillary Core rings
      equatorialGroup.scale.setScalar(1 + currentExplode * 0.18);
      meridianGroupA.scale.setScalar(1 + currentExplode * 0.26);
      meridianGroupB.scale.setScalar(1 + currentExplode * 0.26);
      outerEclipticGroup.scale.setScalar(1 + currentExplode * 0.36);
      const glowScale = 3.5 + Math.sin(elapsed * 2.2) * 0.14 + currentExplode * 0.6;
      coreGlowSprite.scale.set(glowScale, glowScale, 1);

      if (!st.paused) {
        orbitalAngle += dt * 0.11;
        coreMesh.rotation.y += dt * 0.35;
        equatorialGroup.rotation.y += dt * 0.28;
        meridianGroupA.rotation.y += dt * 0.42;
        meridianGroupB.rotation.y -= dt * 0.42;
        outerEclipticGroup.rotation.y -= dt * 0.22;
        orbitGroup.rotation.y = orbitalAngle;
      }

      const activeFocusSlug = st.hoveredSlug ?? st.selectedSlug;
      const updatedPositions = computeOrbitalPositions(st.projects, currentExplode);

      satelliteRecords.forEach((sat, idx) => {
        const targetPos = updatedPositions[idx];
        const targetY =
          0.45 +
          targetPos.yOffset * 0.55 +
          Math.sin(elapsed * 1.6 + idx * 0.85) * 0.06;

        sat.group.position.x = THREE.MathUtils.damp(sat.group.position.x, targetPos.x, 6, dt);
        sat.group.position.z = THREE.MathUtils.damp(sat.group.position.z, targetPos.z, 6, dt);
        sat.group.position.y = THREE.MathUtils.damp(sat.group.position.y, targetY, 6, dt);

        // Lock vertical stem and floorAnchor disc strictly onto FLOOR_Y so they never float or sink
        const localFloorY = (FLOOR_Y - sat.group.position.y) / sat.nodeScale;
        sat.stemPositions[4] = localFloorY;
        sat.stemLine.geometry.attributes.position.needsUpdate = true;
        sat.floorAnchor.position.y = localFloorY + 0.02 / sat.nodeScale;

        // Co-axial rotation of satellite sub-parts around their shared (0,0,0) center
        sat.coreOrb.rotation.y += dt * 0.9;
        sat.innerGyro.rotation.z += dt * 1.1;
        sat.innerGyro.rotation.y -= dt * 0.6;
        sat.innerGyro.scale.setScalar(1 + currentExplode * 0.25);

        const isSelected = sat.slug === activeFocusSlug;
        const targetEmissive = isSelected ? 2.2 : 0.48;
        sat.beaconMat.emissiveIntensity = THREE.MathUtils.damp(
          sat.beaconMat.emissiveIntensity,
          targetEmissive,
          8,
          dt,
        );

        const targetRingScale = isSelected
          ? 1.32 + currentExplode * 0.2
          : 1.0 + currentExplode * 0.14;
        sat.outerRing.scale.setScalar(
          THREE.MathUtils.damp(sat.outerRing.scale.x, targetRingScale, 8, dt),
        );

        // Smooth radial sprite aura
        const spriteScale = isSelected ? 1.85 + Math.sin(elapsed * 4) * 0.12 : 1.18;
        sat.glowSprite.scale.set(spriteScale, spriteScale, 1);
        sat.glowSprite.material.opacity = isSelected ? 0.68 : 0.26;

        // Dynamically lock the quadratic bezier conduit from Core (0, CORE_Y, 0) to exact Satellite center
        _curveEnd.copy(sat.group.position);
        _curveMid.set(
          _curveEnd.x * 0.5,
          FLOOR_Y + 0.14 + sat.ringIndex * 0.08,
          _curveEnd.z * 0.5,
        );
        const posArr = sat.conduitPositions;
        for (let s = 0; s <= CURVE_SEGMENTS; s++) {
          const t = s / CURVE_SEGMENTS;
          const invT = 1 - t;
          _tempVec.x =
            invT * invT * _curveStart.x +
            2 * invT * t * _curveMid.x +
            t * t * _curveEnd.x;
          _tempVec.y =
            invT * invT * _curveStart.y +
            2 * invT * t * _curveMid.y +
            t * t * _curveEnd.y;
          _tempVec.z =
            invT * invT * _curveStart.z +
            2 * invT * t * _curveMid.z +
            t * t * _curveEnd.z;
          posArr[s * 3] = _tempVec.x;
          posArr[s * 3 + 1] = _tempVec.y;
          posArr[s * 3 + 2] = _tempVec.z;
        }
        sat.conduitLine.geometry.attributes.position.needsUpdate = true;
        (sat.conduitLine.material as THREE.LineBasicMaterial).opacity = isSelected ? 0.78 : 0.2;

        // Animate traveling photon energy packet along the exact Bezier curve
        const pulseT = (elapsed * (isSelected ? 0.65 : 0.32) + idx * 0.17) % 1;
        const invPT = 1 - pulseT;
        sat.photonPulse.position.set(
          invPT * invPT * _curveStart.x +
            2 * invPT * pulseT * _curveMid.x +
            pulseT * pulseT * _curveEnd.x,
          invPT * invPT * _curveStart.y +
            2 * invPT * pulseT * _curveMid.y +
            pulseT * pulseT * _curveEnd.y,
          invPT * invPT * _curveStart.z +
            2 * invPT * pulseT * _curveMid.z +
            pulseT * pulseT * _curveEnd.z,
        );
        const pScale = isSelected ? 0.62 : 0.36;
        sat.photonPulse.scale.set(pScale, pScale, 1);
        sat.photonPulse.material.opacity = isSelected ? 0.95 : 0.55;
      });

      const spreadMultiplier = 1 + currentExplode * 0.45;
      trackMeshes.forEach((tm) => {
        tm.scale.setScalar(spreadMultiplier);
      });

      if (st.activeCameraTransition) {
        const preset = CAMERA_PRESETS[st.cameraPreset];
        _targetCameraPos.set(...preset.pos);
        _targetLookAt.set(...preset.target);

        camera.position.x = THREE.MathUtils.damp(camera.position.x, _targetCameraPos.x, 5, dt);
        camera.position.y = THREE.MathUtils.damp(camera.position.y, _targetCameraPos.y, 5, dt);
        camera.position.z = THREE.MathUtils.damp(camera.position.z, _targetCameraPos.z, 5, dt);

        _currentLookAt.x = THREE.MathUtils.damp(_currentLookAt.x, _targetLookAt.x, 5, dt);
        _currentLookAt.y = THREE.MathUtils.damp(_currentLookAt.y, _targetLookAt.y, 5, dt);
        _currentLookAt.z = THREE.MathUtils.damp(_currentLookAt.z, _targetLookAt.z, 5, dt);
        controls.target.copy(_currentLookAt);

        if (camera.position.distanceTo(_targetCameraPos) < 0.05) {
          st.activeCameraTransition = false;
        }
      }

      controls.update();
      renderer.render(scene, camera);

      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    }

    tick();

    return () => {
      isDisposed = true;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      resizeObserver.disconnect();
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('pointermove', handlePointerMove);
      renderer.domElement.removeEventListener('pointerleave', handlePointerLeave);
      renderer.domElement.removeEventListener('click', handleClick);
      controls.removeEventListener('start', onControlStart);
      controls.dispose();
      dialTexture.dispose();
      radialGlowTexture.dispose();
      envTexture.dispose();
      renderer.dispose();
    };
  }, []);

  const selectedProject =
    projects.find((p) => p.slug === (hoveredSlug ?? selectedSlug)) ?? projects[0];
  const scientific = selectedProject ? assessProjectScientifically(selectedProject) : null;

  return (
    <div
      data-testid="orbital-3d-viewport"
      className="relative flex h-[500px] w-full max-w-full min-w-0 flex-col overflow-hidden rounded-3xl border border-[#1E263B]/80 bg-[#07090F] shadow-[0_0_90px_-20px_rgba(245,158,11,0.18)] lg:h-[540px]"
    >
      {/* Isolated WebGL Canvas Mount */}
      <div ref={canvasMountRef} className="absolute inset-0 h-full w-full overflow-hidden" />

      {/* Organic Radial Atmospheric Vignette */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 50% 42%, transparent 55%, rgba(7, 9, 15, 0.72) 100%)',
        }}
      />

      {/* Compact Single-Line Top-Edge HUD Strip */}
      <div className="pointer-events-none relative z-10 flex w-full min-w-0 flex-wrap items-center justify-between gap-2 p-3 sm:px-4">
        <div className="pointer-events-auto inline-flex max-w-full items-center gap-1.5 rounded-full border border-[#2D3854]/80 bg-[#0D111C]/90 px-3 py-1 shadow-lg">
          <Compass className="size-3.5 shrink-0 text-[#F59E0B]" aria-hidden="true" />
          <span className="truncate font-mono text-[11px] font-medium text-[#F4F5FA]">
            3D ARMILLARY ASTROLABE
          </span>
          <span className="text-[#868CA6]" aria-hidden="true">
            ·
          </span>
          <span className="font-mono text-[11px] text-[#FCD34D] tabular-nums">
            {projects.length} NODES
          </span>
        </div>

        {/* Sleek Single-Line Active Node Pill */}
        {selectedProject && scientific && (
          <div className="pointer-events-auto flex max-w-full flex-wrap items-center gap-2 rounded-full border border-[#2D3854] bg-[#0D111C]/95 px-3 py-1 shadow-xl">
            <span className="font-mono text-xs font-bold text-[#F4F5FA]">
              {selectedProject.name}
            </span>
            <span className="font-mono text-[11px] text-[#38BDF8] tabular-nums">
              Idx {scientific.score}
            </span>
            <span className="inline-flex items-center gap-1 font-mono text-xs text-[#F4F5FA] tabular-nums">
              <Star className="size-3 text-[#F59E0B]" aria-hidden="true" />
              {selectedProject.stars}
            </span>
            <button
              type="button"
              onClick={() => onOpenDossier(selectedProject)}
              className="inline-flex items-center gap-1 rounded-full bg-[#F59E0B] px-2.5 py-0.5 text-[11px] font-semibold text-[#07090F] transition-colors hover:bg-[#FCD34D] whitespace-nowrap shrink-0"
            >
              <Eye className="size-3" aria-hidden="true" />
              Dossier
            </button>
            <a
              href={selectedProject.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Open ${selectedProject.name} on GitHub`}
              className="inline-flex items-center gap-1 rounded-full border border-[#2D3854] bg-[#141A29] px-2 py-0.5 text-[11px] font-medium text-[#C9CDE0] transition-colors hover:border-[#F59E0B] hover:text-[#F4F5FA] whitespace-nowrap shrink-0"
            >
              GitHub
              <ExternalLink className="size-3" aria-hidden="true" />
            </a>
          </div>
        )}
      </div>

      {/* Sleek Single-Row Bottom 3D Control Dock */}
      <div className="pointer-events-none relative z-10 mt-auto flex w-full min-w-0 flex-col items-center px-3 pb-3 sm:px-4 sm:pb-4">
        <div className="pointer-events-auto mb-1.5 flex items-center gap-2">
          <button
            type="button"
            onClick={() => setDockCollapsed((prev) => !prev)}
            aria-expanded={!dockCollapsed}
            className="inline-flex items-center gap-1.5 rounded-full border border-[#2D3854] bg-[#0D111C]/95 px-3 py-0.5 font-mono text-[11px] font-medium text-[#C9CDE0] shadow-md transition-colors hover:border-[#F59E0B] hover:text-[#FCD34D] whitespace-nowrap shrink-0"
          >
            {dockCollapsed ? (
              <>
                <ChevronUp className="size-3.5 text-[#F59E0B]" aria-hidden="true" />
                Show 3D Controls
              </>
            ) : (
              <>
                <ChevronDown className="size-3.5 text-[#F59E0B]" aria-hidden="true" />
                Hide Controls
              </>
            )}
          </button>
        </div>

        {!dockCollapsed && (
          <div
            role="region"
            aria-label="3D Viewport Controls"
            className="pointer-events-auto flex w-full max-w-full min-w-0 flex-wrap items-center justify-between gap-2 rounded-2xl border border-[#2D3854]/90 bg-[#0D111C]/95 px-3 py-2 shadow-2xl"
          >
            {/* Camera View Presets */}
            <div className="no-scrollbar flex max-w-full items-center gap-0.5 overflow-x-auto rounded-xl border border-[#1E263B] bg-[#07090F] p-1">
              {(
                [
                  { id: 'overview', label: 'Overview' },
                  { id: 'core', label: 'Core' },
                  { id: 'top', label: 'Top' },
                  { id: 'horizon', label: 'Horizon' },
                ] as const
              ).map((cam) => (
                <button
                  key={cam.id}
                  type="button"
                  onClick={() => setCameraPreset(cam.id)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                    cameraPreset === cam.id
                      ? 'bg-[#1E263B] text-[#FCD34D]'
                      : 'text-[#868CA6] hover:text-[#F4F5FA]'
                  }`}
                >
                  {cam.label}
                </button>
              ))}
            </div>

            {/* Exploded Assembly Slider */}
            <div className="flex items-center gap-2">
              <label
                htmlFor="explode-slider"
                className="inline-flex items-center gap-1 font-mono text-xs text-[#C9CDE0] whitespace-nowrap shrink-0"
              >
                <Layers className="size-3.5 text-[#F59E0B]" aria-hidden="true" />
                Explode
              </label>
              <input
                id="explode-slider"
                type="range"
                min={0}
                max={100}
                value={Math.round(explodeFactor * 100)}
                onChange={(e) => setExplodeFactor(Number(e.target.value) / 100)}
                aria-label="Exploded view separation"
                className="h-1.5 w-16 cursor-pointer appearance-none rounded-lg bg-[#1E263B] accent-[#F59E0B] sm:w-20"
              />
              <span className="w-8 font-mono text-xs text-[#868CA6] tabular-nums">
                {Math.round(explodeFactor * 100)}%
              </span>
            </div>

            {/* Material Finish Switcher */}
            <div className="no-scrollbar flex items-center gap-0.5 overflow-x-auto rounded-xl border border-[#1E263B] bg-[#07090F] p-1">
              <Sparkles className="ml-1.5 mr-0.5 size-3.5 text-[#F59E0B] shrink-0" aria-hidden="true" />
              {(
                [
                  { id: 'obsidian-gold', label: 'Gold' },
                  { id: 'brushed-titanium', label: 'Titanium' },
                  { id: 'optical-crystal', label: 'Crystal' },
                ] as const
              ).map((mat) => (
                <button
                  key={mat.id}
                  type="button"
                  onClick={() => setFinish(mat.id)}
                  className={`rounded-lg px-2 py-1 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                    finish === mat.id
                      ? 'bg-[#1E263B] text-[#FCD34D]'
                      : 'text-[#868CA6] hover:text-[#F4F5FA]'
                  }`}
                >
                  {mat.label}
                </button>
              ))}
            </div>

            {/* Play/Pause & Reset */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setPaused((p) => !p)}
                className="inline-flex items-center gap-1.5 rounded-xl border border-[#2D3854] bg-[#141A29] px-2.5 py-1.5 text-xs font-medium text-[#F4F5FA] transition-colors hover:border-[#F59E0B] whitespace-nowrap shrink-0"
              >
                {paused ? (
                  <>
                    <Play className="size-3.5 text-[#F59E0B]" aria-hidden="true" />
                    Resume
                  </>
                ) : (
                  <>
                    <Pause className="size-3.5 text-[#F59E0B]" aria-hidden="true" />
                    Pause
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  setCameraPreset('overview');
                  setExplodeFactor(0);
                  setFinish('obsidian-gold');
                  setPaused(false);
                }}
                aria-label="Reset 3D view"
                className="inline-flex size-8 items-center justify-center rounded-xl border border-[#2D3854] bg-[#141A29] text-[#C9CDE0] transition-colors hover:border-[#F59E0B] hover:text-[#F4F5FA] shrink-0"
              >
                <RotateCcw className="size-3.5" aria-hidden="true" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
