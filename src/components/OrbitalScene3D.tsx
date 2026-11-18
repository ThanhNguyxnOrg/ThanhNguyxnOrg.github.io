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
  Star,
} from 'lucide-react';
import type { OrgProject } from '../data/orgData';
import {
  assessProjectScientifically,
  ORBITAL_RING_TILTS,
} from '../utils/projectLogic';

export type MaterialFinish = 'obsidian-gold' | 'brushed-titanium' | 'optical-crystal';
export type CameraPreset = 'overview' | 'core' | 'top' | 'horizon' | 'focus';

interface OrbitalScene3DProps {
  projects: OrgProject[];
  selectedSlug: string;
  onSelectProject: (project: OrgProject) => void;
  onOpenDossier: (project: OrgProject) => void;
}

const CAMERA_PRESETS: Record<
  Exclude<CameraPreset, 'focus'>,
  { pos: [number, number, number]; target: [number, number, number] }
> = {
  overview: { pos: [0, 4.9, 14.4], target: [0, 0.15, 0] },
  core: { pos: [0, 1.9, 5.4], target: [0, 0.45, 0] },
  top: { pos: [0.4, 15.8, 2.2], target: [0, 0.2, 0] },
  horizon: { pos: [11.2, 1.4, 7.6], target: [0, 0.25, 0] },
};

const FINISH_OPTIONS: { id: MaterialFinish; label: string; swatch: string }[] = [
  { id: 'obsidian-gold', label: 'Gold', swatch: '#F59E0B' },
  { id: 'brushed-titanium', label: 'Titanium', swatch: '#CBD5E1' },
  { id: 'optical-crystal', label: 'Crystal', swatch: '#38BDF8' },
];

type PlanetArchetype = 'ai' | 'systems' | 'media' | 'learning';
type PlanetSilhouette =
  | 'gyro'
  | 'relay'
  | 'prism'
  | 'observatory'
  | 'cubesat'
  | 'binary'
  | 'beacon';

function getPlanetArchetype(proj: OrgProject): PlanetArchetype {
  const { cluster } = assessProjectScientifically(proj);
  if (cluster === 'AI & Agentic Workflows') return 'ai';
  if (cluster === 'Media DSP & Creative Web') return 'media';
  if (cluster === 'Learning & Org Architecture') return 'learning';
  return 'systems';
}

function getPlanetSilhouette(proj: OrgProject, idx: number): PlanetSilhouette {
  if (proj.category === 'Network') return 'relay';
  if (proj.category === 'AI & Agents') return idx % 2 === 0 ? 'gyro' : 'beacon';
  if (proj.category === 'Media') return 'prism';
  if (proj.category === 'Web Apps') return 'binary';
  if (proj.category === 'Learning' || proj.category === 'Documents') return 'observatory';
  if (proj.category === 'Meta') return 'beacon';
  return idx % 2 === 0 ? 'cubesat' : 'relay';
}

function createCompassDialTexture(maxAnisotropy: number): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.clearRect(0, 0, 512, 512);
    const cx = 256;
    const cy = 256;

    const grad = ctx.createRadialGradient(cx, cy, 12, cx, cy, 248);
    grad.addColorStop(0, 'rgba(245, 158, 11, 0.16)');
    grad.addColorStop(0.45, 'rgba(56, 189, 248, 0.05)');
    grad.addColorStop(1, 'rgba(7, 9, 15, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx, cy, 248, 0, Math.PI * 2);
    ctx.fill();

    [236, 188, 134, 82].forEach((r, idx) => {
      ctx.strokeStyle =
        idx === 0
          ? 'rgba(245, 158, 11, 0.34)'
          : idx === 3
            ? 'rgba(56, 189, 248, 0.25)'
            : 'rgba(148, 163, 184, 0.16)';
      ctx.lineWidth = idx === 0 ? 1.5 : 1;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();
    });

    for (let i = 0; i < 72; i++) {
      const angle = (i / 72) * Math.PI * 2;
      const isMajor = i % 6 === 0;
      const rInner = isMajor ? 220 : 228;
      const rOuter = 235;
      ctx.strokeStyle = isMajor ? 'rgba(252, 211, 77, 0.65)' : 'rgba(148, 163, 184, 0.2)';
      ctx.lineWidth = isMajor ? 1.8 : 1;
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

function createRadialGlowTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const grad = ctx.createRadialGradient(64, 64, 2, 64, 64, 62);
    grad.addColorStop(0, 'rgba(254, 249, 195, 1.0)');
    grad.addColorStop(0.24, 'rgba(245, 158, 11, 0.62)');
    grad.addColorStop(0.55, 'rgba(56, 189, 248, 0.16)');
    grad.addColorStop(1, 'rgba(7, 9, 15, 0.0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 128, 128);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

// Pre-allocated math helpers outside animation loop (zero GC)
const _targetCameraPos = new THREE.Vector3();
const _targetLookAt = new THREE.Vector3();
const _currentLookAt = new THREE.Vector3(0, 0.15, 0);
const _pointerNdc = new THREE.Vector2();
const _projWorldPos = new THREE.Vector3();
const _focusWorldPos = new THREE.Vector3();
const _curveMid = new THREE.Vector3();

export default function OrbitalScene3D({
  projects,
  selectedSlug,
  onSelectProject,
  onOpenDossier,
}: OrbitalScene3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasMountRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);

  const [finish, setFinish] = useState<MaterialFinish>('obsidian-gold');
  const [cameraPreset, setCameraPreset] = useState<CameraPreset>('overview');
  const [explodeFactor, setExplodeFactor] = useState<number>(0);
  const [paused, setPaused] = useState<boolean>(false);
  const [dockCollapsed, setDockCollapsed] = useState<boolean>(false);
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);
  const [contextLost, setContextLost] = useState<boolean>(false);

  const applyFinishRef = useRef<((mode: MaterialFinish) => void) | null>(null);

  const stateRef = useRef({
    finish,
    cameraPreset,
    explodeFactor,
    paused,
    selectedSlug,
    hoveredSlug,
    activeCameraTransition: false,
    isVisible: true,
    reducedMotion: false,
    projects,
    onSelectProject,
    onOpenDossier,
  });

  useEffect(() => {
    stateRef.current.finish = finish;
    applyFinishRef.current?.(finish);
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
    stateRef.current.onOpenDossier = onOpenDossier;
  }, [projects, onSelectProject, onOpenDossier]);

  useEffect(() => {
    const mount = canvasMountRef.current;
    const outerContainer = containerRef.current;
    if (!mount || !outerContainer) return;

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    stateRef.current.reducedMotion = motionQuery.matches;
    const handleMotionChange = (e: MediaQueryListEvent) => {
      stateRef.current.reducedMotion = e.matches;
    };
    motionQuery.addEventListener('change', handleMotionChange);

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
    const height = Math.max(mount.clientHeight, 360);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
      alpha: false,
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(width, height, false);
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';
    renderer.shadowMap.enabled = false; // Zero shadow-pass overhead for smooth 60fps orbit

    const handleContextLost = (e: Event) => {
      e.preventDefault();
      setContextLost(true);
    };
    const handleContextRestored = () => {
      setContextLost(false);
    };
    renderer.domElement.addEventListener('webglcontextlost', handleContextLost);
    renderer.domElement.addEventListener('webglcontextrestored', handleContextRestored);

    mount.innerHTML = '';
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const bgHex = 0x07090f;
    scene.background = new THREE.Color(bgHex);
    scene.fog = new THREE.FogExp2(bgHex, 0.02);

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envTexture = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTexture;
    pmremGenerator.dispose();

    const aspect = width / height;
    const camera = new THREE.PerspectiveCamera(aspect < 0.95 ? 52 : 39, aspect, 0.1, 110);
    camera.position.set(...CAMERA_PRESETS.overview.pos);
    camera.lookAt(...CAMERA_PRESETS.overview.target);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.075;
    controls.rotateSpeed = 0.72;
    controls.zoomSpeed = 0.8;
    controls.enablePan = false;
    controls.maxPolarAngle = Math.PI * 0.62;
    controls.minPolarAngle = Math.PI * 0.12;
    controls.minDistance = 4.2;
    controls.maxDistance = 22;
    controls.target.set(...CAMERA_PRESETS.overview.target);

    const onControlStart = () => {
      stateRef.current.activeCameraTransition = false;
    };
    controls.addEventListener('start', onControlStart);

    // 3-Point Studio Lighting Rig (warm key + cool sky fill + cyan rim)
    const hemiLight = new THREE.HemisphereLight(0xdbeafe, 0x090d16, 1.05);
    hemiLight.position.set(0, 22, 0);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xffedd5, 2.25);
    keyLight.position.set(8, 14, 10);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 1.55);
    rimLight.position.set(-10, 6, -9);
    scene.add(rimLight);

    const FLOOR_Y = -2.15;
    const CORE_Y = 0.35;

    const corePointLight = new THREE.PointLight(0xf59e0b, 3.4, 18, 1.4);
    corePointLight.position.set(0, CORE_Y, 0);
    scene.add(corePointLight);

    const maxAniso = renderer.capabilities.getMaxAnisotropy();
    const dialTexture = createCompassDialTexture(maxAniso);
    const radialGlowTexture = createRadialGlowTexture();

    // Shared Core Materials (only updated inside applyFinish)
    const primaryMetalMat = new THREE.MeshPhysicalMaterial({
      color: 0xf59e0b,
      metalness: 0.9,
      roughness: 0.14,
      clearcoat: 0.9,
      clearcoatRoughness: 0.08,
      ior: 1.54,
      thickness: 1.2,
      attenuationColor: new THREE.Color(0x38bdf8),
      attenuationDistance: 2.5,
    });

    const darkStructuralMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      metalness: 0.84,
      roughness: 0.24,
    });

    const accentChromeMat = new THREE.MeshPhysicalMaterial({
      color: 0xfef3c7,
      metalness: 0.95,
      roughness: 0.09,
      anisotropy: 0.75,
      clearcoat: 0.85,
    });

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
          float wave = sin(position.x * 4.0 + uTime * 1.5) * cos(position.y * 4.0 - uTime * 1.3) * cos(position.z * 4.0 + uTime * 1.1);
          float disp = wave * 0.028;
          vDisplacement = disp;

          vec3 newPos = position + normal * disp;
          vec4 mvPosition = modelViewMatrix * vec4(newPos, 1.0);
          vViewPosition = -mvPosition.xyz;
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform vec3 uBaseColor;
        uniform vec3 uRimColor;
        uniform vec3 uPulseColor;
        varying vec3 vNormal;
        varying vec3 vViewPosition;
        varying float vDisplacement;

        void main() {
          vec3 normal = normalize(vNormal);
          vec3 viewDir = normalize(vViewPosition);
          float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 2.3);
          float bands = sin(vDisplacement * 90.0 + uTime * 2.2) * 0.5 + 0.5;
          vec3 col = mix(uBaseColor, uRimColor, fresnel * 0.85 + bands * 0.25);
          col = mix(col, uPulseColor, pow(fresnel, 4.0) * 0.45);
          gl_FragColor = vec4(col, 1.0);
        }
      `,
    });

    // Pooled Planet Archetype Materials (8 shared PBR materials instead of 23x duplicate Physical shaders!)
    const archetypeBodyMats: Record<PlanetArchetype, THREE.MeshStandardMaterial> = {
      ai: new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        emissive: 0x78350f,
        emissiveIntensity: 0.45,
        metalness: 0.88,
        roughness: 0.16,
      }),
      systems: new THREE.MeshStandardMaterial({
        color: 0x94a3b8,
        emissive: 0x075985,
        emissiveIntensity: 0.35,
        metalness: 0.92,
        roughness: 0.22,
      }),
      media: new THREE.MeshStandardMaterial({
        color: 0x34d399,
        emissive: 0x065f46,
        emissiveIntensity: 0.42,
        metalness: 0.65,
        roughness: 0.18,
      }),
      learning: new THREE.MeshStandardMaterial({
        color: 0x818cf8,
        emissive: 0x312e81,
        emissiveIntensity: 0.4,
        metalness: 0.78,
        roughness: 0.2,
      }),
    };

    const archetypeRingMats: Record<PlanetArchetype, THREE.MeshStandardMaterial> = {
      ai: new THREE.MeshStandardMaterial({
        color: 0xfcd34d,
        emissive: 0xd97706,
        emissiveIntensity: 0.55,
        metalness: 0.88,
        roughness: 0.15,
      }),
      systems: new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        emissive: 0x0284c7,
        emissiveIntensity: 0.65,
        metalness: 0.85,
        roughness: 0.16,
      }),
      media: new THREE.MeshStandardMaterial({
        color: 0xa78bfa,
        emissive: 0x7c3aed,
        emissiveIntensity: 0.5,
        metalness: 0.8,
        roughness: 0.18,
      }),
      learning: new THREE.MeshStandardMaterial({
        color: 0xfbbf24,
        emissive: 0x4f46e5,
        emissiveIntensity: 0.48,
        metalness: 0.84,
        roughness: 0.18,
      }),
    };

    const selectedRingMat = new THREE.MeshStandardMaterial({
      color: 0xfef08a,
      emissive: 0xf59e0b,
      emissiveIntensity: 1.75,
      metalness: 0.9,
      roughness: 0.1,
    });

    const conduitDefaultMats: Record<PlanetArchetype, THREE.LineBasicMaterial> = {
      ai: new THREE.LineBasicMaterial({ color: 0xf59e0b, transparent: true, opacity: 0.2 }),
      systems: new THREE.LineBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.18 }),
      media: new THREE.LineBasicMaterial({ color: 0x34d399, transparent: true, opacity: 0.18 }),
      learning: new THREE.LineBasicMaterial({ color: 0x818cf8, transparent: true, opacity: 0.18 }),
    };

    const conduitActiveMat = new THREE.LineBasicMaterial({
      color: 0xfef08a,
      transparent: true,
      opacity: 0.82,
    });

    const photonAmberMat = new THREE.SpriteMaterial({
      map: radialGlowTexture,
      color: 0xfef08a,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const photonCyanMat = new THREE.SpriteMaterial({
      map: radialGlowTexture,
      color: 0x7dd3fc,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const glowSpriteAmberMat = new THREE.SpriteMaterial({
      map: radialGlowTexture,
      color: 0xfcd34d,
      transparent: true,
      opacity: 0.42,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const glowSpriteCyanMat = new THREE.SpriteMaterial({
      map: radialGlowTexture,
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.34,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const applyFinish = (mode: MaterialFinish) => {
      if (mode === 'obsidian-gold') {
        primaryMetalMat.color.setHex(0xf59e0b);
        primaryMetalMat.metalness = 0.9;
        primaryMetalMat.roughness = 0.14;
        primaryMetalMat.transmission = 0;
        primaryMetalMat.opacity = 1;
        primaryMetalMat.transparent = false;
        darkStructuralMat.color.setHex(0x1e293b);
        coreShaderUniforms.uBaseColor.value.setHex(0xd97706);
        coreShaderUniforms.uRimColor.value.setHex(0xfef08a);
      } else if (mode === 'brushed-titanium') {
        primaryMetalMat.color.setHex(0xe2e8f0);
        primaryMetalMat.metalness = 0.95;
        primaryMetalMat.roughness = 0.19;
        primaryMetalMat.transmission = 0;
        primaryMetalMat.opacity = 1;
        primaryMetalMat.transparent = false;
        darkStructuralMat.color.setHex(0x334155);
        coreShaderUniforms.uBaseColor.value.setHex(0x64748b);
        coreShaderUniforms.uRimColor.value.setHex(0xf8fafc);
      } else {
        primaryMetalMat.color.setHex(0x7dd3fc);
        primaryMetalMat.metalness = 0.12;
        primaryMetalMat.roughness = 0.06;
        primaryMetalMat.transmission = isSoftwareGl ? 0 : 0.85;
        primaryMetalMat.transparent = true;
        primaryMetalMat.opacity = isSoftwareGl ? 0.58 : 1;
        darkStructuralMat.color.setHex(0x0f172a);
        coreShaderUniforms.uBaseColor.value.setHex(0x0284c7);
        coreShaderUniforms.uRimColor.value.setHex(0xe0f2fe);
      }
    };
    applyFinishRef.current = applyFinish;
    applyFinish(stateRef.current.finish);

    const masterGroup = new THREE.Group();
    scene.add(masterGroup);

    // Subtle Observatory Floor Compass Dial far beneath the floating 3D astrolabe
    const dialGeo = new THREE.CircleGeometry(9.6, 72);
    const dialMat = new THREE.MeshStandardMaterial({
      map: dialTexture,
      transparent: true,
      opacity: 0.72,
      roughness: 0.88,
      metalness: 0.1,
      depthWrite: false,
      polygonOffset: true,
      polygonOffsetFactor: -1,
      polygonOffsetUnits: -1,
    });
    const dialMesh = new THREE.Mesh(dialGeo, dialMat);
    dialMesh.rotation.x = -Math.PI / 2;
    dialMesh.position.y = FLOOR_Y;
    masterGroup.add(dialMesh);

    // Central Gimbal Armillary Assembly (suspended in 3D space at CORE_Y)
    const coreAnchorGroup = new THREE.Group();
    coreAnchorGroup.position.set(0, CORE_Y, 0);
    masterGroup.add(coreAnchorGroup);

    const coreMesh = new THREE.Mesh(new THREE.IcosahedronGeometry(0.54, 2), corePlasmaMat);
    coreAnchorGroup.add(coreMesh);

    const coreGlowSprite = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: radialGlowTexture,
        color: 0xfcd34d,
        transparent: true,
        opacity: 0.68,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    );
    coreGlowSprite.scale.set(3.2, 3.2, 1);
    coreAnchorGroup.add(coreGlowSprite);

    const equatorialGroup = new THREE.Group();
    equatorialGroup.add(new THREE.Mesh(new THREE.TorusGeometry(1.08, 0.032, 14, 64), primaryMetalMat));
    equatorialGroup.rotation.x = Math.PI * 0.42;
    coreAnchorGroup.add(equatorialGroup);

    const meridianGroupA = new THREE.Group();
    meridianGroupA.add(new THREE.Mesh(new THREE.TorusGeometry(1.34, 0.024, 12, 64), accentChromeMat));
    meridianGroupA.rotation.set(Math.PI / 4, Math.PI / 6, 0);
    coreAnchorGroup.add(meridianGroupA);

    const meridianGroupB = new THREE.Group();
    meridianGroupB.add(new THREE.Mesh(new THREE.TorusGeometry(1.34, 0.024, 12, 64), primaryMetalMat));
    meridianGroupB.rotation.set(-Math.PI / 4, -Math.PI / 6, 0);
    coreAnchorGroup.add(meridianGroupB);

    const outerEclipticGroup = new THREE.Group();
    outerEclipticGroup.add(
      new THREE.Mesh(new THREE.TorusGeometry(1.64, 0.028, 12, 64), darkStructuralMat),
    );
    outerEclipticGroup.rotation.set(Math.PI / 2 - 0.16, 0, 0.22);
    coreAnchorGroup.add(outerEclipticGroup);

    // Tall Vertical Meridian Calibration Frame around the Constellation (breaks horizontal flatness)
    const verticalMeridianMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      emissive: 0x0f172a,
      emissiveIntensity: 0.35,
      metalness: 0.88,
      roughness: 0.25,
    });
    const verticalMeridianA = new THREE.Mesh(
      new THREE.TorusGeometry(4.35, 0.014, 10, 88),
      verticalMeridianMat,
    );
    verticalMeridianA.rotation.y = Math.PI * 0.18;
    coreAnchorGroup.add(verticalMeridianA);

    const verticalMeridianB = new THREE.Mesh(
      new THREE.TorusGeometry(6.35, 0.012, 10, 96),
      verticalMeridianMat,
    );
    verticalMeridianB.rotation.y = -Math.PI * 0.32;
    verticalMeridianB.rotation.x = 0.14;
    coreAnchorGroup.add(verticalMeridianB);

    // 3 Cross-Inclined 3D Orbital Planes (each ring tilts & spins cleanly around its own normal!)
    const ringConfigs = [0, 1, 2] as const;
    const ringTiltGroups: THREE.Group[] = [];
    const ringSpinGroups: THREE.Group[] = [];
    const ringTrackMeshes: THREE.Mesh[] = [];

    ringConfigs.forEach((ringIdx) => {
      const cfg = ORBITAL_RING_TILTS[ringIdx];
      const tiltGroup = new THREE.Group();
      tiltGroup.position.set(0, CORE_Y, 0);
      tiltGroup.rotation.set(cfg.tiltX, 0, cfg.tiltZ);
      masterGroup.add(tiltGroup);
      ringTiltGroups.push(tiltGroup);

      const spinGroup = new THREE.Group();
      tiltGroup.add(spinGroup);
      ringSpinGroups.push(spinGroup);

      const trackGeo = new THREE.TorusGeometry(
        cfg.baseRadius,
        ringIdx === 0 ? 0.022 : 0.016,
        10,
        96,
      );
      trackGeo.rotateX(Math.PI / 2);
      const trackMat = new THREE.MeshStandardMaterial({
        color: ringIdx === 0 ? 0xf59e0b : ringIdx === 1 ? 0x38bdf8 : 0x64748b,
        emissive: ringIdx === 0 ? 0x92400e : ringIdx === 1 ? 0x075985 : 0x1e293b,
        emissiveIntensity: 0.48,
        metalness: 0.85,
        roughness: 0.25,
      });
      const trackMesh = new THREE.Mesh(trackGeo, trackMat);
      spinGroup.add(trackMesh);
      ringTrackMeshes.push(trackMesh);
    });

    // Instanced 3D Spherical Cosmic Dust Field (spread in full vertical & horizontal volume)
    const DUST_COUNT = 160;
    const dustGeo = new THREE.OctahedronGeometry(0.026, 0);
    const dustMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const dustInstanced = new THREE.InstancedMesh(dustGeo, dustMat, DUST_COUNT);
    const dummy = new THREE.Object3D();
    const dustColor = new THREE.Color();
    for (let i = 0; i < DUST_COUNT; i++) {
      const radius = 2.8 + ((i * 37) % 100) * 0.08;
      const theta = (i / DUST_COUNT) * Math.PI * 2 * 6.5;
      const phi = ((i * 29) % 100) / 100 - 0.5;
      dummy.position.set(
        Math.cos(theta) * radius,
        CORE_Y + phi * 6.4,
        Math.sin(theta) * radius,
      );
      dummy.scale.setScalar(0.5 + (i % 5) * 0.18);
      dummy.updateMatrix();
      dustInstanced.setMatrixAt(i, dummy.matrix);
      dustColor.setHex(i % 4 === 0 ? 0xf59e0b : i % 3 === 0 ? 0xfef08a : 0x38bdf8);
      dustInstanced.setColorAt(i, dustColor);
    }
    dustInstanced.instanceMatrix.needsUpdate = true;
    if (dustInstanced.instanceColor) dustInstanced.instanceColor.needsUpdate = true;
    dustInstanced.computeBoundingSphere();
    masterGroup.add(dustInstanced);

    // Distant Parallax Starfield Shell (1 draw call via THREE.Points, zero per-frame allocations)
    const STAR_COUNT = 240;
    const starPositions = new Float32Array(STAR_COUNT * 3);
    const starColors = new Float32Array(STAR_COUNT * 3);
    const starPalette = [
      new THREE.Color(0xfef3c7), // soft warm starlight
      new THREE.Color(0xbae6fd), // crisp cool cyan star
      new THREE.Color(0xe2e8f0), // silver white
    ];
    for (let i = 0; i < STAR_COUNT; i++) {
      // Deterministic golden-ratio spherical shell (r: 16..28) so no hydration jitter
      const u = ((i * 73) % STAR_COUNT) / STAR_COUNT * 2 - 1;
      const phi = (i * 2.3999632) % (Math.PI * 2);
      const r = 16 + ((i * 19) % 120) * 0.1;
      const sinTheta = Math.sqrt(Math.max(0, 1 - u * u));
      starPositions[i * 3] = r * sinTheta * Math.cos(phi);
      starPositions[i * 3 + 1] = r * u;
      starPositions[i * 3 + 2] = r * sinTheta * Math.sin(phi);

      const c = starPalette[i % starPalette.length];
      starColors[i * 3] = c.r;
      starColors[i * 3 + 1] = c.g;
      starColors[i * 3 + 2] = c.b;
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3));
    const starMat = new THREE.PointsMaterial({
      size: 0.13,
      sizeAttenuation: true,
      vertexColors: true,
      transparent: true,
      opacity: 0.78,
      depthWrite: false,
    });
    const starField = new THREE.Points(starGeo, starMat);
    scene.add(starField);

    // Pooled Astronomical Target Reticle (billboarded ring tracking focused satellite)
    const selectionReticle = new THREE.Group();
    const reticleOuterMat = new THREE.MeshBasicMaterial({
      color: 0xfcd34d,
      transparent: true,
      opacity: 0.85,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const reticleInnerMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.55,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const reticleOuterRing = new THREE.Mesh(
      new THREE.RingGeometry(0.55, 0.59, 32),
      reticleOuterMat,
    );
    const reticleInnerRing = new THREE.Mesh(
      new THREE.RingGeometry(0.64, 0.66, 4, 1, 0, Math.PI * 1.4),
      reticleInnerMat,
    );
    selectionReticle.add(reticleOuterRing);
    selectionReticle.add(reticleInnerRing);
    selectionReticle.visible = false;
    scene.add(selectionReticle);

    // Shared Archetype & Satellite Geometries (7 distinct planet silhouettes + 4 micro-satellite moonlet types)
    const sharedGeos = {
      aiCore: new THREE.OctahedronGeometry(0.23, 1),
      aiRingA: new THREE.TorusGeometry(0.39, 0.02, 10, 36),
      aiRingB: new THREE.TorusGeometry(0.3, 0.014, 8, 30),

      sysCore: new THREE.CylinderGeometry(0.16, 0.21, 0.27, 6),
      sysCollar: new THREE.TorusGeometry(0.22, 0.018, 8, 24),
      sysRing: new THREE.TorusGeometry(0.42, 0.02, 10, 36),
      sysMast: new THREE.CylinderGeometry(0.014, 0.014, 0.56, 6),
      solarWing: new THREE.BoxGeometry(0.34, 0.012, 0.11),

      mediaCore: new THREE.DodecahedronGeometry(0.22, 0),
      mediaFlagshipCore: new THREE.TorusKnotGeometry(0.145, 0.044, 34, 8),
      mediaRing: new THREE.TorusGeometry(0.41, 0.02, 10, 36),

      learnCore: new THREE.SphereGeometry(0.21, 16, 12),
      learnBand: new THREE.TorusGeometry(0.24, 0.015, 8, 28),
      learnRing: new THREE.TorusGeometry(0.39, 0.02, 10, 36),
      learnBeacon: new THREE.ConeGeometry(0.08, 0.16, 6),

      cubeCore: new THREE.BoxGeometry(0.24, 0.24, 0.24),
      cubeBoom: new THREE.CylinderGeometry(0.01, 0.01, 0.62, 5),

      binaryPrimary: new THREE.SphereGeometry(0.135, 12, 10),
      binaryCompanion: new THREE.OctahedronGeometry(0.095, 0),

      moonletSphere: new THREE.SphereGeometry(0.052, 8, 6),
      moonletCube: new THREE.BoxGeometry(0.078, 0.056, 0.056),
      moonletWing: new THREE.BoxGeometry(0.18, 0.009, 0.042),
      moonletOcta: new THREE.OctahedronGeometry(0.062, 0),
      moonletCone: new THREE.ConeGeometry(0.046, 0.11, 5),
      hitSphere: new THREE.SphereGeometry(0.68, 8, 6),
    };
    sharedGeos.aiRingA.rotateX(Math.PI / 2);
    sharedGeos.sysCollar.rotateX(Math.PI / 2);
    sharedGeos.sysRing.rotateX(Math.PI / 2);
    sharedGeos.mediaRing.rotateX(Math.PI / 2);
    sharedGeos.learnRing.rotateX(Math.PI / 2);

    const satHitMat = new THREE.MeshBasicMaterial({ visible: false });
    const interactableHitMeshes: THREE.Mesh[] = [];
    const CURVE_SEGMENTS = 18;

    interface SatelliteRecord {
      slug: string;
      archetype: PlanetArchetype;
      ringIndex: 0 | 1 | 2;
      angleRad: number;
      baseRadius: number;
      baseLocalY: number;
      nodeScale: number;
      spinSpeed: number;
      moonletSpeed: number;
      group: THREE.Group;
      bodyGroup: THREE.Group;
      outerRing: THREE.Mesh;
      ringFrame: THREE.Group;
      moonletOrbitGroup: THREE.Group;
      glowSprite: THREE.Sprite;
      conduitLine: THREE.Line;
      conduitPositions: Float32Array;
      photonPulse: THREE.Sprite;
      localPos: THREE.Vector3;
      hasDemo: boolean;
      isSelectedNow: boolean;
      currentRingScale: number;
    }

    const satelliteRecords: SatelliteRecord[] = [];

    // Partition projects cleanly into the 3 cross-inclined orbital rings
    const projs = stateRef.current.projects;
    const ringBuckets: [OrgProject[], OrgProject[], OrgProject[]] = [
      projs.slice(0, 5),
      projs.slice(5, 12),
      projs.slice(12),
    ];

    let globalIdx = 0;
    ringConfigs.forEach((ringIndex) => {
      const items = ringBuckets[ringIndex];
      const count = Math.max(1, items.length);
      const ringCfg = ORBITAL_RING_TILTS[ringIndex];
      const spinGroup = ringSpinGroups[ringIndex];

      items.forEach((proj, idxInRing) => {
        const idx = globalIdx++;
        const archetype = getPlanetArchetype(proj);
        const silhouette = getPlanetSilhouette(proj, idx);
        const phaseOffset = ringIndex * 0.55;
        const angleRad = (idxInRing / count) * Math.PI * 2 + phaseOffset;
        const baseRadius = ringCfg.baseRadius;
        const baseLocalY =
          Math.sin(idxInRing * 1.9 + ringIndex) * 0.34 +
          (idxInRing % 2 === 0 ? 0.14 : -0.14);
        const demoBonus = proj.demoUrl ? 0.1 : 0;
        const nodeScale = 0.96 + Math.min(proj.stars, 4) * 0.12 + demoBonus;

        const lx = Math.cos(angleRad) * baseRadius;
        const lz = Math.sin(angleRad) * baseRadius;

        const satGroup = new THREE.Group();
        satGroup.position.set(lx, baseLocalY, lz);
        satGroup.scale.setScalar(nodeScale);
        spinGroup.add(satGroup);

        // Distinct individual axial tilt so every planet has its own orientation in 3D space
        const tiltSeed = ((idx * 37) % 11) - 5;
        const bodyGroup = new THREE.Group();
        bodyGroup.rotation.set(tiltSeed * 0.08, idx * 0.7, -tiltSeed * 0.06);
        satGroup.add(bodyGroup);

        const bodyMat = archetypeBodyMats[archetype];
        const ringMat = archetypeRingMats[archetype];

        // 7 Distinct Planet / Satellite Silhouettes
        if (silhouette === 'gyro') {
          bodyGroup.add(new THREE.Mesh(sharedGeos.aiCore, bodyMat));
          const innerDiamond = new THREE.Mesh(sharedGeos.aiRingB, accentChromeMat);
          innerDiamond.rotation.set(Math.PI / 3, Math.PI / 5, 0);
          bodyGroup.add(innerDiamond);
        } else if (silhouette === 'relay') {
          bodyGroup.add(new THREE.Mesh(sharedGeos.sysCore, bodyMat));
          const flange = new THREE.Mesh(sharedGeos.sysCollar, accentChromeMat);
          flange.position.y = 0.06;
          bodyGroup.add(flange);
          bodyGroup.add(new THREE.Mesh(sharedGeos.sysMast, darkStructuralMat));
          const leftWing = new THREE.Mesh(sharedGeos.solarWing, ringMat);
          leftWing.position.set(-0.29, 0, 0);
          bodyGroup.add(leftWing);
          const rightWing = new THREE.Mesh(sharedGeos.solarWing, ringMat);
          rightWing.position.set(0.29, 0, 0);
          bodyGroup.add(rightWing);
        } else if (silhouette === 'prism') {
          const mediaMesh = new THREE.Mesh(
            proj.stars >= 2 ? sharedGeos.mediaFlagshipCore : sharedGeos.mediaCore,
            bodyMat,
          );
          bodyGroup.add(mediaMesh);
        } else if (silhouette === 'cubesat') {
          const cube = new THREE.Mesh(sharedGeos.cubeCore, bodyMat);
          cube.rotation.set(0.35, 0.65, 0.2);
          bodyGroup.add(cube);
          const boomA = new THREE.Mesh(sharedGeos.cubeBoom, accentChromeMat);
          boomA.rotation.z = Math.PI / 4;
          bodyGroup.add(boomA);
          const boomB = new THREE.Mesh(sharedGeos.cubeBoom, darkStructuralMat);
          boomB.rotation.z = -Math.PI / 4;
          bodyGroup.add(boomB);
        } else if (silhouette === 'binary') {
          const primary = new THREE.Mesh(sharedGeos.binaryPrimary, bodyMat);
          primary.position.set(-0.12, 0.03, 0);
          bodyGroup.add(primary);
          const companion = new THREE.Mesh(sharedGeos.binaryCompanion, ringMat);
          companion.position.set(0.15, -0.04, 0);
          bodyGroup.add(companion);
        } else if (silhouette === 'beacon') {
          bodyGroup.add(new THREE.Mesh(sharedGeos.aiCore, bodyMat));
          const vertBand = new THREE.Mesh(sharedGeos.learnBand, ringMat);
          vertBand.rotation.x = Math.PI / 2;
          bodyGroup.add(vertBand);
          const crest = new THREE.Mesh(sharedGeos.learnBeacon, accentChromeMat);
          crest.position.y = 0.25;
          bodyGroup.add(crest);
        } else {
          // observatory
          bodyGroup.add(new THREE.Mesh(sharedGeos.learnCore, bodyMat));
          const meridianBand = new THREE.Mesh(sharedGeos.learnBand, accentChromeMat);
          meridianBand.rotation.z = Math.PI / 2;
          bodyGroup.add(meridianBand);
          const beaconTip = new THREE.Mesh(sharedGeos.learnBeacon, ringMat);
          beaconTip.position.y = 0.27;
          bodyGroup.add(beaconTip);
        }

        // Outer Planetary Ring Frame
        const ringFrame = new THREE.Group();
        ringFrame.rotation.set(
          ((idx * 19) % 7 - 3) * 0.14,
          0,
          ((idx * 23) % 7 - 3) * 0.12,
        );
        satGroup.add(ringFrame);

        const ringGeo =
          archetype === 'ai'
            ? sharedGeos.aiRingA
            : archetype === 'systems'
              ? sharedGeos.sysRing
              : archetype === 'media'
                ? sharedGeos.mediaRing
                : sharedGeos.learnRing;

        const outerRing = new THREE.Mesh(ringGeo, ringMat);
        if (archetype === 'media') {
          outerRing.scale.set(1.18, 1, 0.84);
        }
        ringFrame.add(outerRing);

        // Diverse Independently Orbiting Sub-Satellites (Moons / CubeSats / Probes)
        const moonletOrbitGroup = new THREE.Group();
        moonletOrbitGroup.rotation.set(
          ((idx * 13) % 9 - 4) * 0.18,
          idx * 0.9,
          ((idx * 17) % 7 - 3) * 0.16,
        );
        satGroup.add(moonletOrbitGroup);

        const moonCount = proj.stars >= 2 || proj.demoUrl ? 2 : idx % 3 === 0 ? 0 : 1;
        for (let m = 0; m < moonCount; m++) {
          const moonType = (idx + m * 2) % 4;
          const orbitRadius = m === 0 ? 0.48 : 0.59;
          const moonAngle = m * Math.PI * 0.85 + idx * 0.6;
          const mx = Math.cos(moonAngle) * orbitRadius;
          const mz = Math.sin(moonAngle) * orbitRadius;
          const my = m === 0 ? 0.04 : -0.08;

          if (moonType === 0) {
            // Micro CubeSat with solar panels
            const probeGroup = new THREE.Group();
            probeGroup.position.set(mx, my, mz);
            probeGroup.rotation.y = -moonAngle;
            probeGroup.add(new THREE.Mesh(sharedGeos.moonletCube, accentChromeMat));
            probeGroup.add(new THREE.Mesh(sharedGeos.moonletWing, ringMat));
            moonletOrbitGroup.add(probeGroup);
          } else if (moonType === 1) {
            // Crystalline Octahedron Asteroid / Probe
            const octa = new THREE.Mesh(sharedGeos.moonletOcta, ringMat);
            octa.position.set(mx, my, mz);
            octa.rotation.set(0.4, 0.8, 0.2);
            moonletOrbitGroup.add(octa);
          } else if (moonType === 2) {
            // Directional Telemetry Cone Probe
            const cone = new THREE.Mesh(sharedGeos.moonletCone, accentChromeMat);
            cone.position.set(mx, my, mz);
            cone.rotation.z = Math.PI / 3;
            moonletOrbitGroup.add(cone);
          } else {
            // Classic Icy Spherical Moonlet
            const sphere = new THREE.Mesh(sharedGeos.moonletSphere, accentChromeMat);
            sphere.position.set(mx, my, mz);
            moonletOrbitGroup.add(sphere);
          }
        }

        const glowSprite = new THREE.Sprite(
          proj.demoUrl || archetype === 'ai' ? glowSpriteAmberMat : glowSpriteCyanMat,
        );
        glowSprite.scale.set(0.96, 0.96, 1);
        satGroup.add(glowSprite);

        // Local-space curved Bezier conduit from Core (0,0,0) to satellite inside the tilted ringGroup!
        const conduitPositions = new Float32Array((CURVE_SEGMENTS + 1) * 3);
        const conduitGeo = new THREE.BufferGeometry();
        conduitGeo.setAttribute('position', new THREE.BufferAttribute(conduitPositions, 3));
        const conduitLine = new THREE.Line(conduitGeo, conduitDefaultMats[archetype]);
        spinGroup.add(conduitLine);

        const photonPulse = new THREE.Sprite(
          proj.demoUrl || archetype === 'ai' ? photonAmberMat : photonCyanMat,
        );
        photonPulse.scale.set(0.36, 0.36, 1);
        spinGroup.add(photonPulse);

        const hitMesh = new THREE.Mesh(sharedGeos.hitSphere, satHitMat);
        hitMesh.userData = { slug: proj.slug };
        satGroup.add(hitMesh);
        interactableHitMeshes.push(hitMesh);

        satelliteRecords.push({
          slug: proj.slug,
          archetype,
          ringIndex,
          angleRad,
          baseRadius,
          baseLocalY,
          nodeScale,
          spinSpeed: 0.35 + (idx % 5) * 0.12,
          moonletSpeed: (idx % 2 === 0 ? 1 : -1) * (0.95 + (idx % 4) * 0.32),
          group: satGroup,
          bodyGroup,
          outerRing,
          ringFrame,
          moonletOrbitGroup,
          glowSprite,
          conduitLine,
          conduitPositions,
          photonPulse,
          localPos: new THREE.Vector3(lx, baseLocalY, lz),
          hasDemo: Boolean(proj.demoUrl),
          isSelectedNow: false,
          currentRingScale: 1.0,
        });
      });
    });

    // Helper to rebuild conduit Bezier vertices ONLY when explodeFactor changes (zero per-frame rebuilds!)
    const updateConduitGeometry = (sat: SatelliteRecord, explode: number) => {
      const spread = 1 + explode * 0.42;
      const r = sat.baseRadius * spread;
      const lx = Math.cos(sat.angleRad) * r;
      const lz = Math.sin(sat.angleRad) * r;
      const ly = sat.baseLocalY + explode * (sat.ringIndex - 1) * 0.72;
      sat.localPos.set(lx, ly, lz);
      sat.group.position.set(lx, ly, lz);

      _curveMid.set(lx * 0.52, ly * 0.35 - 0.38, lz * 0.52);
      const posArr = sat.conduitPositions;
      for (let s = 0; s <= CURVE_SEGMENTS; s++) {
        const t = s / CURVE_SEGMENTS;
        const invT = 1 - t;
        const b1 = 2 * invT * t;
        const b2 = t * t;
        posArr[s * 3] = b1 * _curveMid.x + b2 * lx;
        posArr[s * 3 + 1] = b1 * _curveMid.y + b2 * ly;
        posArr[s * 3 + 2] = b1 * _curveMid.z + b2 * lz;
      }
      sat.conduitLine.geometry.attributes.position.needsUpdate = true;
    };

    // Initial curve placement
    satelliteRecords.forEach((sat) => updateConduitGeometry(sat, 0));

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    const raycaster = new THREE.Raycaster();
    let lastRaycastTime = 0;
    let lastHoveredSlug: string | null = null;

    const handlePointerMove = (e: PointerEvent) => {
      const now = performance.now();
      if (now - lastRaycastTime < 55) return;
      lastRaycastTime = now;

      const rect = renderer.domElement.getBoundingClientRect();
      _pointerNdc.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      _pointerNdc.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(_pointerNdc, camera);
      const hits = raycaster.intersectObjects(interactableHitMeshes, false);
      const nextSlug = hits.length > 0 ? (hits[0].object.userData.slug as string) : null;

      if (nextSlug !== lastHoveredSlug) {
        lastHoveredSlug = nextSlug;
        setHoveredSlug(nextSlug);
        renderer.domElement.style.cursor = nextSlug ? 'pointer' : 'grab';
      }
    };

    const handlePointerLeave = () => {
      if (lastHoveredSlug !== null) {
        lastHoveredSlug = null;
        setHoveredSlug(null);
        renderer.domElement.style.cursor = 'grab';
      }
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

    const handleDoubleClick = (e: MouseEvent) => {
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
          stateRef.current.onOpenDossier(found);
        }
      }
    };

    renderer.domElement.addEventListener('pointermove', handlePointerMove);
    renderer.domElement.addEventListener('pointerleave', handlePointerLeave);
    renderer.domElement.addEventListener('click', handleClick);
    renderer.domElement.addEventListener('dblclick', handleDoubleClick);

    const handleResize = () => {
      if (!mount) return;
      const w = Math.max(mount.clientWidth, 280);
      const h = Math.max(mount.clientHeight, 340);
      const nextAspect = w / h;
      camera.fov = nextAspect < 0.95 ? 52 : 39;
      camera.aspect = nextAspect;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
      if (stateRef.current.isVisible && !isDisposed) {
        renderer.render(scene, camera);
      }
    };
    window.addEventListener('resize', handleResize);
    const resizeObserver = new ResizeObserver(() => handleResize());
    resizeObserver.observe(mount);

    let frameId = 0;
    let isDisposed = false;
    const startTime = performance.now();
    let prevTime = startTime;
    let currentExplode = 0;
    let lastConduitExplode = 0;
    let hoverSpeedDamp = 1.0;

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
    intersectionObserver.observe(outerContainer);

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
      if (isDisposed || !stateRef.current.isVisible) return;
      const now = performance.now();
      const rawDelta = (now - prevTime) / 1000;
      prevTime = now;
      // Strict dt cap eliminates sudden velocity leaps ("nhanh quá") after tab switches or frame hiccups
      const dt = Math.min(Math.max(rawDelta, 0.001), 0.045);
      const elapsed = (now - startTime) / 1000;
      const st = stateRef.current;

      coreShaderUniforms.uTime.value = st.reducedMotion ? 0 : elapsed;

      currentExplode = THREE.MathUtils.damp(currentExplode, st.explodeFactor, 7, dt);
      const explodeChanged = Math.abs(currentExplode - lastConduitExplode) > 0.0008;

      if (explodeChanged) {
        lastConduitExplode = currentExplode;
        const spread = 1 + currentExplode * 0.42;
        ringTrackMeshes.forEach((tm) => tm.scale.setScalar(spread));
        equatorialGroup.scale.setScalar(1 + currentExplode * 0.16);
        meridianGroupA.scale.setScalar(1 + currentExplode * 0.24);
        meridianGroupB.scale.setScalar(1 + currentExplode * 0.24);
        outerEclipticGroup.scale.setScalar(1 + currentExplode * 0.34);
      }

      // Smoothly ease orbital speed down while user hovers a planet so selection is effortless
      const targetSpeedMult = st.hoveredSlug ? 0.22 : 1.0;
      hoverSpeedDamp = THREE.MathUtils.damp(hoverSpeedDamp, targetSpeedMult, 6, dt);

      if (!st.paused && !st.reducedMotion) {
        coreMesh.rotation.y += dt * 0.26;
        equatorialGroup.rotation.y += dt * 0.2;
        meridianGroupA.rotation.y += dt * 0.28;
        meridianGroupB.rotation.y -= dt * 0.28;
        outerEclipticGroup.rotation.y -= dt * 0.16;
        starField.rotation.y += dt * 0.014;

        ringSpinGroups[0].rotation.y += dt * ORBITAL_RING_TILTS[0].speed * hoverSpeedDamp;
        ringSpinGroups[1].rotation.y += dt * ORBITAL_RING_TILTS[1].speed * hoverSpeedDamp;
        ringSpinGroups[2].rotation.y += dt * ORBITAL_RING_TILTS[2].speed * hoverSpeedDamp;
      }

      const activeFocusSlug = st.hoveredSlug ?? st.selectedSlug;
      let focusedSatellite: SatelliteRecord | null = null;

      for (let i = 0; i < satelliteRecords.length; i++) {
        const sat = satelliteRecords[i];
        if (explodeChanged) {
          updateConduitGeometry(sat, currentExplode);
        }

        if (!st.reducedMotion) {
          sat.bodyGroup.rotation.y += dt * sat.spinSpeed;
          sat.ringFrame.rotation.y -= dt * (sat.spinSpeed * 0.65);
          sat.moonletOrbitGroup.rotation.y += dt * sat.moonletSpeed * hoverSpeedDamp;
        }

        const isSelected = sat.slug === activeFocusSlug;
        if (isSelected) {
          focusedSatellite = sat;
        }

        // Only swap pooled materials on state change (zero per-frame material churn)
        if (isSelected !== sat.isSelectedNow) {
          sat.isSelectedNow = isSelected;
          sat.outerRing.material = isSelected
            ? selectedRingMat
            : archetypeRingMats[sat.archetype];
          sat.conduitLine.material = isSelected
            ? conduitActiveMat
            : conduitDefaultMats[sat.archetype];
        }

        const targetScale = isSelected ? 1.28 : 1.0;
        if (Math.abs(sat.currentRingScale - targetScale) > 0.001) {
          sat.currentRingScale = THREE.MathUtils.damp(sat.currentRingScale, targetScale, 8, dt);
          if (Math.abs(sat.currentRingScale - targetScale) <= 0.001) {
            sat.currentRingScale = targetScale;
          }
          if (sat.archetype === 'media') {
            sat.outerRing.scale.set(
              sat.currentRingScale * 1.18,
              sat.currentRingScale,
              sat.currentRingScale * 0.84,
            );
          } else {
            sat.outerRing.scale.setScalar(sat.currentRingScale);
          }
        }

        const targetGlow = isSelected ? 1.5 : 0.96;
        if (sat.glowSprite.scale.x !== targetGlow) {
          sat.glowSprite.scale.setScalar(targetGlow);
        }

        // Animate photon pulse cleanly along local Bezier curve (zero allocations, zero buffer upload)
        const pulseT =
          ((st.reducedMotion ? 0.5 : elapsed * (isSelected ? 0.55 : 0.25)) + i * 0.17) % 1;
        const invPT = 1 - pulseT;
        const b1 = 2 * invPT * pulseT;
        const b2 = pulseT * pulseT;
        const midX = sat.localPos.x * 0.52;
        const midY = sat.localPos.y * 0.35 - 0.38;
        const midZ = sat.localPos.z * 0.52;
        sat.photonPulse.position.set(
          b1 * midX + b2 * sat.localPos.x,
          b1 * midY + b2 * sat.localPos.y,
          b1 * midZ + b2 * sat.localPos.z,
        );
        sat.photonPulse.scale.setScalar(isSelected ? 0.52 : 0.3);
      }

      if (focusedSatellite) {
        focusedSatellite.group.getWorldPosition(_focusWorldPos);
        selectionReticle.visible = true;
        selectionReticle.position.copy(_focusWorldPos);
        selectionReticle.scale.setScalar(focusedSatellite.nodeScale);
        selectionReticle.quaternion.copy(camera.quaternion);
        if (!st.reducedMotion) {
          reticleInnerRing.rotation.z = elapsed * 0.85;
        }
      } else {
        selectionReticle.visible = false;
      }

      if (st.activeCameraTransition) {
        if (st.cameraPreset === 'focus' && focusedSatellite) {
          _targetLookAt.copy(_focusWorldPos);
          const len = Math.hypot(_focusWorldPos.x, _focusWorldPos.z) || 1;
          _targetCameraPos.set(
            _focusWorldPos.x + (_focusWorldPos.x / len) * 2.8,
            _focusWorldPos.y + 1.15,
            _focusWorldPos.z + (_focusWorldPos.z / len) * 2.8,
          );
        } else {
          const presetKey = st.cameraPreset === 'focus' ? 'overview' : st.cameraPreset;
          const preset = CAMERA_PRESETS[presetKey];
          _targetCameraPos.set(...preset.pos);
          _targetLookAt.set(...preset.target);
        }

        camera.position.x = THREE.MathUtils.damp(camera.position.x, _targetCameraPos.x, 5.5, dt);
        camera.position.y = THREE.MathUtils.damp(camera.position.y, _targetCameraPos.y, 5.5, dt);
        camera.position.z = THREE.MathUtils.damp(camera.position.z, _targetCameraPos.z, 5.5, dt);

        _currentLookAt.x = THREE.MathUtils.damp(_currentLookAt.x, _targetLookAt.x, 5.5, dt);
        _currentLookAt.y = THREE.MathUtils.damp(_currentLookAt.y, _targetLookAt.y, 5.5, dt);
        _currentLookAt.z = THREE.MathUtils.damp(_currentLookAt.z, _targetLookAt.z, 5.5, dt);
        controls.target.copy(_currentLookAt);

        if (st.cameraPreset !== 'focus' && camera.position.distanceTo(_targetCameraPos) < 0.05) {
          st.activeCameraTransition = false;
        }
      }

      controls.update();
      renderer.render(scene, camera);

      // Update Projected 3D Callout Pin directly via DOM ref (zero 60Hz React re-renders)
      const pinEl = pinRef.current;
      if (pinEl && focusedSatellite && mount) {
        focusedSatellite.group.getWorldPosition(_projWorldPos);
        _projWorldPos.y += 0.62;
        _projWorldPos.project(camera);
        const w = mount.clientWidth;
        const h = mount.clientHeight;
        if (_projWorldPos.z < 1 && _projWorldPos.z > -1) {
          const sx = (_projWorldPos.x * 0.5 + 0.5) * w;
          const sy = (-_projWorldPos.y * 0.5 + 0.5) * h;
          const marginX = Math.min(96, Math.max(64, w * 0.25));
          const clampedX = Math.max(marginX, Math.min(w - marginX, sx));
          const clampedY = Math.max(54, Math.min(h - 98, sy));
          pinEl.style.opacity = '1';
          pinEl.style.transform = `translate3d(${clampedX.toFixed(1)}px, ${clampedY.toFixed(1)}px, 0) translate(-50%, -100%)`;
        } else {
          pinEl.style.opacity = '0';
        }
      } else if (pinEl) {
        pinEl.style.opacity = '0';
      }

      scheduleNextFrame();
    }

    tick();

    return () => {
      isDisposed = true;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      intersectionObserver.disconnect();
      resizeObserver.disconnect();
      motionQuery.removeEventListener('change', handleMotionChange);
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('pointermove', handlePointerMove);
      renderer.domElement.removeEventListener('pointerleave', handlePointerLeave);
      renderer.domElement.removeEventListener('click', handleClick);
      renderer.domElement.removeEventListener('dblclick', handleDoubleClick);
      renderer.domElement.removeEventListener('webglcontextlost', handleContextLost);
      renderer.domElement.removeEventListener('webglcontextrestored', handleContextRestored);
      controls.removeEventListener('start', onControlStart);
      controls.dispose();

      const disposedGeos = new Set<THREE.BufferGeometry>();
      const disposedMats = new Set<THREE.Material>();
      scene.traverse((obj) => {
        const meshLike = obj as THREE.Mesh;
        if (meshLike.geometry && !disposedGeos.has(meshLike.geometry)) {
          meshLike.geometry.dispose();
          disposedGeos.add(meshLike.geometry);
        }
        const mat = meshLike.material;
        if (Array.isArray(mat)) {
          mat.forEach((m) => {
            if (!disposedMats.has(m)) {
              m.dispose();
              disposedMats.add(m);
            }
          });
        } else if (mat && !disposedMats.has(mat)) {
          mat.dispose();
          disposedMats.add(mat);
        }
      });

      Object.values(sharedGeos).forEach((g) => g.dispose());
      Object.values(archetypeBodyMats).forEach((m) => m.dispose());
      Object.values(archetypeRingMats).forEach((m) => m.dispose());
      Object.values(conduitDefaultMats).forEach((m) => m.dispose());
      selectedRingMat.dispose();
      conduitActiveMat.dispose();
      photonAmberMat.dispose();
      photonCyanMat.dispose();
      glowSpriteAmberMat.dispose();
      glowSpriteCyanMat.dispose();
      satHitMat.dispose();
      dialTexture.dispose();
      radialGlowTexture.dispose();
      envTexture.dispose();
      renderer.dispose();
    };
  }, []);

  const selectedProject =
    projects.find((p) => p.slug === (hoveredSlug ?? selectedSlug)) ?? projects[0];

  return (
    <div
      ref={containerRef}
      data-testid="orbital-3d-viewport"
      className="relative flex h-[410px] w-full max-w-full min-w-0 flex-col overflow-hidden rounded-2xl border border-[#1E263B] bg-[#07090F] shadow-[0_24px_80px_-24px_rgba(245,158,11,0.18)] sm:h-[480px] lg:h-[552px]"
    >
      {/* Isolated WebGL Canvas Mount */}
      <div ref={canvasMountRef} className="absolute inset-0 h-full w-full overflow-hidden" />

      {/* WebGL Context Loss Fallback */}
      {contextLost && (
        <div className="relative z-30 flex h-full w-full flex-col items-center justify-center bg-[#07090F]/95 p-6 text-center">
          <Compass className="size-8 text-[#F59E0B]" aria-hidden="true" />
          <p className="mt-3 font-display text-lg font-semibold text-[#F4F5FA]">
            3D Viewport Paused
          </p>
          <p className="mt-1 max-w-xs text-xs text-[#A3A9BF]">
            WebGL context is recovering. You can still cycle and inspect every repository below.
          </p>
        </div>
      )}

      {/* Organic Radial Vignette */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 50% 42%, transparent 56%, rgba(7, 9, 15, 0.72) 100%)',
        }}
      />

      {/* Projected 3D Node Spatial Callout Pin (updated via ref) */}
      {selectedProject && !contextLost && (
        <div
          ref={pinRef}
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-0 z-10 flex flex-col items-center opacity-0 transition-opacity duration-200"
        >
          <div className="flex items-center gap-2 rounded-lg border border-[#F59E0B]/60 bg-[#0D111C]/95 px-2.5 py-1 font-mono text-[11px] text-[#F4F5FA] shadow-lg whitespace-nowrap">
            <span className="font-semibold text-[#FCD34D]">{selectedProject.name}</span>
            <span className="text-[#868CA6]">·</span>
            <span className="text-[#A3A9BF]">{selectedProject.language}</span>
          </div>
          <div className="h-3 w-px bg-gradient-to-b from-[#F59E0B] to-transparent" />
        </div>
      )}

      {/* Compact Single-Row Top-Edge HUD Strip */}
      <div className="pointer-events-none relative z-10 flex w-full min-w-0 items-center justify-between gap-2 p-3 sm:px-4">
        <div className="pointer-events-auto hidden items-center gap-1.5 rounded-lg border border-[#1E263B] bg-[#0D111C]/92 px-2.5 py-1.5 font-mono text-[11px] text-[#A3A9BF] whitespace-nowrap shrink-0 sm:inline-flex">
          <Compass className="size-3.5 shrink-0 text-[#F59E0B]" aria-hidden="true" />
          <span className="font-medium text-[#F4F5FA]">Astrolabe</span>
          <span aria-hidden="true">·</span>
          <span className="text-[#FCD34D]">Interactive Orbit</span>
        </div>

        {selectedProject && (
          <div className="pointer-events-auto flex w-full min-w-0 items-center gap-2 rounded-lg border border-[#2D3854] bg-[#0D111C]/95 px-2.5 py-1.5 shadow-xl sm:w-auto sm:max-w-[75%]">
            <span className="min-w-0 truncate font-mono text-xs font-semibold text-[#F4F5FA]">
              {selectedProject.name}
            </span>
            <span className="hidden font-mono text-[11px] text-[#868CA6] whitespace-nowrap shrink-0 md:inline">
              {selectedProject.language}
            </span>
            <span className="hidden shrink-0 items-center gap-1 font-mono text-xs text-[#FCD34D] tabular-nums sm:inline-flex">
              <Star className="size-3 text-[#F59E0B]" aria-hidden="true" />
              {selectedProject.stars}
            </span>
            <button
              type="button"
              onClick={() => onOpenDossier(selectedProject)}
              className="ml-auto inline-flex shrink-0 items-center gap-1 rounded-md bg-[#F59E0B] px-2.5 py-1 text-[11px] font-semibold text-[#07090F] transition-colors hover:bg-[#FCD34D] whitespace-nowrap sm:ml-0"
            >
              <Eye className="size-3" aria-hidden="true" />
              Dossier
            </button>
            <a
              href={selectedProject.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Open ${selectedProject.name} on GitHub`}
              className="inline-flex shrink-0 items-center gap-1 rounded-md border border-[#2D3854] bg-[#141A29] px-2 py-1 text-[11px] font-medium text-[#C9CDE0] transition-colors hover:border-[#F59E0B] hover:text-[#F4F5FA] whitespace-nowrap"
            >
              <span className="hidden lg:inline">GitHub</span>
              <ExternalLink className="size-3" aria-hidden="true" />
            </a>
          </div>
        )}
      </div>

      {/* Collapsible Bottom 3D Control Dock (wraps cleanly with zero clipping) */}
      <div className="pointer-events-none relative z-10 mt-auto flex w-full min-w-0 flex-col items-center px-3 pb-3 sm:px-4 sm:pb-3.5">
        <div className="pointer-events-auto mb-1.5">
          <button
            type="button"
            onClick={() => setDockCollapsed((prev) => !prev)}
            aria-expanded={!dockCollapsed}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#2D3854] bg-[#0D111C]/95 px-2.5 py-1 font-mono text-[11px] font-medium text-[#C9CDE0] shadow-md transition-colors hover:border-[#F59E0B] hover:text-[#FCD34D] whitespace-nowrap shrink-0"
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
            className="pointer-events-auto flex w-full max-w-full min-w-0 flex-wrap items-center justify-center gap-x-2.5 gap-y-1.5 rounded-xl border border-[#2D3854]/90 bg-[#0D111C]/95 px-2.5 py-2 shadow-2xl"
          >
            {/* Camera View Presets */}
            <div className="flex flex-wrap items-center gap-0.5 rounded-lg border border-[#1E263B] bg-[#07090F] p-0.5">
              {(
                [
                  { id: 'overview', label: 'Overview' },
                  { id: 'core', label: 'Core' },
                  { id: 'top', label: 'Top' },
                  { id: 'horizon', label: 'Horizon' },
                  { id: 'focus', label: 'Node' },
                ] as const
              ).map((cam) => (
                <button
                  key={cam.id}
                  type="button"
                  onClick={() => setCameraPreset(cam.id)}
                  className={`rounded-md px-2 py-1 text-[11px] font-medium transition-colors whitespace-nowrap shrink-0 ${
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
            <div className="flex items-center gap-1.5 shrink-0">
              <label
                htmlFor="explode-slider"
                className="inline-flex items-center gap-1 font-mono text-[11px] text-[#C9CDE0] whitespace-nowrap shrink-0"
              >
                <Layers className="size-3 text-[#F59E0B]" aria-hidden="true" />
                <span>Explode</span>
              </label>
              <input
                id="explode-slider"
                type="range"
                min={0}
                max={100}
                value={Math.round(explodeFactor * 100)}
                onChange={(e) => setExplodeFactor(Number(e.target.value) / 100)}
                aria-label="Exploded view separation"
                className="h-1.5 w-14 cursor-pointer appearance-none rounded-md bg-[#1E263B] accent-[#F59E0B]"
              />
              <span className="w-7 font-mono text-[11px] text-[#868CA6] tabular-nums">
                {Math.round(explodeFactor * 100)}%
              </span>
            </div>

            {/* Material Finish Switcher */}
            <div className="flex items-center gap-0.5 rounded-lg border border-[#1E263B] bg-[#07090F] p-0.5">
              {FINISH_OPTIONS.map((mat) => (
                <button
                  key={mat.id}
                  type="button"
                  onClick={() => setFinish(mat.id)}
                  className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-medium transition-colors whitespace-nowrap shrink-0 ${
                    finish === mat.id
                      ? 'bg-[#1E263B] text-[#FCD34D]'
                      : 'text-[#868CA6] hover:text-[#F4F5FA]'
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className="size-2 rounded-full shrink-0"
                    style={{ backgroundColor: mat.swatch }}
                  />
                  {mat.label}
                </button>
              ))}
            </div>

            {/* Play/Pause & Reset */}
            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={() => setPaused((p) => !p)}
                className="inline-flex items-center gap-1 rounded-lg border border-[#2D3854] bg-[#141A29] px-2.5 py-1 text-[11px] font-medium text-[#F4F5FA] transition-colors hover:border-[#F59E0B] whitespace-nowrap shrink-0"
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
                  setCameraPreset('overview');
                  setExplodeFactor(0);
                  setFinish('obsidian-gold');
                  setPaused(false);
                }}
                aria-label="Reset 3D view"
                className="inline-flex size-7 items-center justify-center rounded-lg border border-[#2D3854] bg-[#141A29] text-[#C9CDE0] transition-colors hover:border-[#F59E0B] hover:text-[#F4F5FA] shrink-0"
              >
                <RotateCcw className="size-3" aria-hidden="true" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
