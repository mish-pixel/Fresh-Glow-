import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { ProductVariant, SkincareProduct, ViewerLightingSettings, LightingPreset } from '../../types';
import { PRODUCTS, GEL_CREAM_VARIANTS } from '../../data/products';
import { createJarLabelTexture, createLidTopTexture, createEcoTubeTexture } from '../../utils/textureGenerator';
import { 
  RotateCw, 
  ZoomIn, 
  ZoomOut, 
  Sun, 
  Sparkles, 
  Layers, 
  Camera, 
  Maximize2, 
  RefreshCcw, 
  Sliders, 
  Eye
} from 'lucide-react';

interface ProductModelViewerProps {
  product?: SkincareProduct;
  modelType?: 'jar' | 'dropper' | 'pump' | 'spray' | 'tube';
  selectedVariant?: ProductVariant;
  variant?: ProductVariant;
  customEngraving?: string;
  includeEcoTube?: boolean;
  onOpenAR: () => void;
  className?: string;
}

export const ProductModelViewer: React.FC<ProductModelViewerProps> = ({
  product,
  modelType,
  selectedVariant,
  variant,
  customEngraving,
  includeEcoTube = false,
  onOpenAR,
  className = ''
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Safe fallback resolution so modelType and variant never throw undefined errors
  const activeProduct = product || PRODUCTS[0];
  const activeModelType = modelType || activeProduct?.modelType || 'jar';
  const activeVariant = selectedVariant || variant || (activeProduct?.variants ? activeProduct.variants[0] : GEL_CREAM_VARIANTS[0]);

  // Viewer state
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [isLidOpen, setIsLidOpen] = useState<boolean>(false);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [lighting, setLighting] = useState<ViewerLightingSettings>({
    preset: 'studio',
    intensity: 1.2,
    ambientIntensity: 0.85,
    rotation: 45,
    roughness: 0.18,
    metalness: 0.85,
    transmission: 0.45,
    backgroundMode: 'cream'
  });
  const [showLightingControls, setShowLightingControls] = useState<boolean>(false);
  const [activeViewAngle, setActiveViewAngle] = useState<string>('hero');

  // Three.js instances ref
  const threeRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    productGroup: THREE.Group;
    lidMesh: THREE.Group | null;
    creamMesh: THREE.Mesh | null;
    keyLight: THREE.DirectionalLight;
    fillLight: THREE.DirectionalLight;
    backLight: THREE.DirectionalLight;
    ambientLight: THREE.AmbientLight;
    jarMaterial: THREE.MeshPhysicalMaterial | null;
    lidMaterial: THREE.MeshStandardMaterial | null;
    labelMaterial: THREE.MeshStandardMaterial | null;
    targetRotationY: number;
    targetRotationX: number;
    currentRotationY: number;
    currentRotationX: number;
    targetCameraDistance: number;
    currentCameraDistance: number;
    isDragging: boolean;
    previousMousePosition: { x: number; y: number };
    lidOffsetY: number;
    targetLidOffsetY: number;
  } | null>(null);

  // Initialize Three.js scene
  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const width = containerRef.current.clientWidth || 600;
    const height = containerRef.current.clientHeight || 500;

    // 1. Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xF6F4EC); // Soft cream

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 1.2, 5.2);

    // 3. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
      preserveDrawingBuffer: true // for snapshot
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;

    // 4. Lights
    const ambientLight = new THREE.AmbientLight(0xfff8ee, 0.85);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfffdf5, 1.3);
    keyLight.position.set(4, 5, 4);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 15;
    keyLight.shadow.bias = -0.0001;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xe8f0f8, 0.7);
    fillLight.position.set(-4, 3, -2);
    scene.add(fillLight);

    const backLight = new THREE.DirectionalLight(0xffeedd, 0.9);
    backLight.position.set(0, 4, -4);
    scene.add(backLight);

    // Subtle botanical pedestal shadow plane
    const shadowGeo = new THREE.PlaneGeometry(8, 8);
    const shadowMat = new THREE.ShadowMaterial({ opacity: 0.18 });
    const shadowPlane = new THREE.Mesh(shadowGeo, shadowMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -1.2;
    shadowPlane.receiveShadow = true;
    scene.add(shadowPlane);

    // Aesthetic Circular Pedestal
    const pedestalGeo = new THREE.CylinderGeometry(1.8, 1.9, 0.15, 64);
    const pedestalMat = new THREE.MeshStandardMaterial({
      color: 0xECE8DC,
      roughness: 0.4,
      metalness: 0.05
    });
    const pedestal = new THREE.Mesh(pedestalGeo, pedestalMat);
    pedestal.position.y = -1.28;
    pedestal.receiveShadow = true;
    scene.add(pedestal);

    // Product Group
    const productGroup = new THREE.Group();
    productGroup.position.y = -0.2;
    scene.add(productGroup);

    threeRef.current = {
      scene,
      camera,
      renderer,
      productGroup,
      lidMesh: null,
      creamMesh: null,
      keyLight,
      fillLight,
      backLight,
      ambientLight,
      jarMaterial: null,
      lidMaterial: null,
      labelMaterial: null,
      targetRotationY: 0.35,
      targetRotationX: 0.1,
      currentRotationY: 0.35,
      currentRotationX: 0.1,
      targetCameraDistance: 4.8,
      currentCameraDistance: 4.8,
      isDragging: false,
      previousMousePosition: { x: 0, y: 0 },
      lidOffsetY: 0,
      targetLidOffsetY: 0
    };

    // Resize Observer
    const handleResize = () => {
      if (!containerRef.current || !threeRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      threeRef.current.camera.aspect = w / h;
      threeRef.current.camera.updateProjectionMatrix();
      threeRef.current.renderer.setSize(w, h);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(containerRef.current);

    // Animation Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const state = threeRef.current;
      if (!state) return;

      // Auto rotation
      if (autoRotate && !state.isDragging) {
        state.targetRotationY += 0.45 * delta;
      }

      // Smooth inertia rotation interpolation
      state.currentRotationY += (state.targetRotationY - state.currentRotationY) * 0.1;
      state.currentRotationX += (state.targetRotationX - state.currentRotationX) * 0.1;
      state.currentRotationX = Math.max(-0.6, Math.min(0.85, state.currentRotationX));

      state.productGroup.rotation.y = state.currentRotationY;
      state.productGroup.rotation.x = state.currentRotationX;

      // Smooth camera distance / zoom
      state.currentCameraDistance += (state.targetCameraDistance - state.currentCameraDistance) * 0.1;
      state.camera.position.z = state.currentCameraDistance;

      // Smooth lid opening animation
      if (state.lidMesh) {
        state.lidOffsetY += (state.targetLidOffsetY - state.lidOffsetY) * 0.12;
        state.lidMesh.position.y = state.lidOffsetY;
      }

      state.renderer.render(state.scene, state.camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      renderer.dispose();
    };
  }, []);

  // Re-build 3D geometry and textures when product, variant, or engraving changes
  useEffect(() => {
    const state = threeRef.current;
    if (!state) return;

    // Clear existing product meshes
    while (state.productGroup.children.length > 0) {
      const obj = state.productGroup.children[0];
      state.productGroup.remove(obj);
    }
    state.lidMesh = null;
    state.creamMesh = null;

    if (activeModelType === 'jar') {
      buildSkincareJar(state, activeVariant, customEngraving, includeEcoTube);
    } else if (activeModelType === 'dropper') {
      buildDropperBottle(state, activeVariant);
    } else if (activeModelType === 'pump') {
      buildPumpBottle(state, activeVariant);
    } else if (activeModelType === 'spray') {
      buildSprayBottle(state, activeVariant);
    } else if (activeModelType === 'tube') {
      buildEcoTubeSet(state, activeVariant);
    }
  }, [activeModelType, activeVariant, customEngraving, includeEcoTube]);

  // Apply lighting preset & settings
  useEffect(() => {
    const state = threeRef.current;
    if (!state) return;

    // Background color
    if (lighting.backgroundMode === 'cream') {
      state.scene.background = new THREE.Color(0xF6F4EC);
    } else if (lighting.backgroundMode === 'forest') {
      state.scene.background = new THREE.Color(0x1F3D2B);
    } else if (lighting.backgroundMode === 'pedestal') {
      state.scene.background = new THREE.Color(0xEDE7DC);
    } else {
      state.scene.background = null;
    }

    // Light presets
    if (lighting.preset === 'studio') {
      state.keyLight.color.setHex(0xFFFCF5);
      state.fillLight.color.setHex(0xE8F0F8);
      state.backLight.color.setHex(0xFFF0E0);
      state.ambientLight.color.setHex(0xFFF8EE);
    } else if (lighting.preset === 'sunset') {
      state.keyLight.color.setHex(0xF5A876);
      state.fillLight.color.setHex(0xF7D0BA);
      state.backLight.color.setHex(0xD9896A);
      state.ambientLight.color.setHex(0xFCEEE3);
    } else if (lighting.preset === 'spa') {
      state.keyLight.color.setHex(0xE0F2E5);
      state.fillLight.color.setHex(0xB2D8BD);
      state.backLight.color.setHex(0xA7C4A1);
      state.ambientLight.color.setHex(0xEDF7F0);
    } else if (lighting.preset === 'midnight') {
      state.keyLight.color.setHex(0xE6EEF8);
      state.fillLight.color.setHex(0x566B7D);
      state.backLight.color.setHex(0x2A3E4E);
      state.ambientLight.color.setHex(0x24323E);
    }

    // Intensity & angle
    const angleRad = (lighting.rotation * Math.PI) / 180;
    state.keyLight.position.set(Math.cos(angleRad) * 5, 5, Math.sin(angleRad) * 5);
    state.keyLight.intensity = lighting.intensity;
    state.ambientLight.intensity = lighting.ambientIntensity;

    // Materials updates
    if (state.jarMaterial) {
      state.jarMaterial.roughness = lighting.roughness;
      state.jarMaterial.transmission = lighting.transmission;
    }
    if (state.lidMaterial) {
      state.lidMaterial.roughness = Math.max(0.12, lighting.roughness * 0.7);
      state.lidMaterial.metalness = lighting.metalness;
    }
  }, [lighting]);

  // Handle lid open animation toggle
  useEffect(() => {
    if (!threeRef.current) return;
    threeRef.current.targetLidOffsetY = isLidOpen ? 1.4 : 0;
  }, [isLidOpen]);

  // -------------------------------------------------------------
  // BUILD PROCEDURAL 3D MODELS
  // -------------------------------------------------------------

  function buildSkincareJar(
    state: NonNullable<typeof threeRef.current>,
    variant: ProductVariant,
    engraving?: string,
    showEcoTube?: boolean
  ) {
    const jarGroup = new THREE.Group();

    // If companion eco packaging tube is selected, render it beside the jar
    if (showEcoTube) {
      const tubeGeo = new THREE.CylinderGeometry(1.25, 1.25, 3.0, 64);
      const tubeTexture = createEcoTubeTexture();
      const tubeMat = new THREE.MeshStandardMaterial({
        map: tubeTexture,
        roughness: 0.75,
        metalness: 0.05
      });
      const tube = new THREE.Mesh(tubeGeo, tubeMat);
      tube.position.set(1.4, 0.45, -0.6);
      tube.castShadow = true;
      jarGroup.add(tube);
      jarGroup.position.x = -0.4;
    } else {
      jarGroup.position.x = 0;
    }

    // 1. Heavy Frosted/Clear Glass Jar Outer Body
    const jarOuterGeo = new THREE.CylinderGeometry(1.2, 1.18, 1.35, 64);
    const jarMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(variant.jarColor),
      roughness: 0.18,
      metalness: 0.05,
      transmission: 0.65,
      ior: 1.52,
      thickness: 1.2,
      transparent: true,
      opacity: 0.94,
      reflectivity: 0.6
    });
    state.jarMaterial = jarMat;
    const jarOuter = new THREE.Mesh(jarOuterGeo, jarMat);
    jarOuter.castShadow = true;
    jarOuter.receiveShadow = true;
    jarOuter.position.y = 0;
    jarGroup.add(jarOuter);

    // 2. Thick Glass Bottom Well
    const bottomWellGeo = new THREE.CylinderGeometry(1.05, 1.05, 0.28, 64);
    const bottomWellMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      roughness: 0.1,
      transmission: 0.9,
      ior: 1.52,
      thickness: 2.0
    });
    const bottomWell = new THREE.Mesh(bottomWellGeo, bottomWellMat);
    bottomWell.position.y = -0.52;
    jarGroup.add(bottomWell);

    // 3. Inner Cosmetic Cream Swirl
    const creamGeo = new THREE.CylinderGeometry(1.08, 1.05, 0.9, 64);
    const creamMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(variant.creamColor),
      roughness: 0.35,
      metalness: 0.02
    });
    const creamMesh = new THREE.Mesh(creamGeo, creamMat);
    creamMesh.position.y = 0.05;
    state.creamMesh = creamMesh;
    jarGroup.add(creamMesh);

    // Cream surface dome swirl with organic cosmetic crest
    const creamTopGeo = new THREE.SphereGeometry(1.07, 48, 24, 0, Math.PI * 2, 0, Math.PI * 0.3);
    const creamTop = new THREE.Mesh(creamTopGeo, creamMat);
    creamTop.position.y = 0.45;
    creamTop.scale.set(1, 0.4, 1);
    jarGroup.add(creamTop);

    // 4. High-Res Cylindrical Label Wrap (from multi-angle specs)
    const labelGeo = new THREE.CylinderGeometry(1.205, 1.185, 1.12, 64, 1, true);
    const labelTexture = createJarLabelTexture(variant, engraving);
    const labelMat = new THREE.MeshStandardMaterial({
      map: labelTexture,
      roughness: 0.4,
      metalness: 0.05,
      transparent: true
    });
    state.labelMaterial = labelMat;
    const labelMesh = new THREE.Mesh(labelGeo, labelMat);
    labelMesh.position.y = 0;
    labelMesh.rotation.y = -Math.PI / 2; // Face front label to camera
    jarGroup.add(labelMesh);

    // 5. Screw Thread Rim Collar
    const rimGeo = new THREE.CylinderGeometry(1.08, 1.08, 0.22, 64);
    const rimMat = new THREE.MeshStandardMaterial({
      color: 0xD4AF37,
      roughness: 0.2,
      metalness: 0.9
    });
    const rimMesh = new THREE.Mesh(rimGeo, rimMat);
    rimMesh.position.y = 0.72;
    jarGroup.add(rimMesh);

    // 6. Brushed Gold Metallic Lid (Separable Group for Open-Lid view)
    const lidGroup = new THREE.Group();

    // Lid cylinder
    const lidGeo = new THREE.CylinderGeometry(1.22, 1.22, 0.42, 64);
    const lidMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(variant.lidColor),
      roughness: 0.22,
      metalness: 0.88
    });
    state.lidMaterial = lidMat;
    const lidBody = new THREE.Mesh(lidGeo, lidMat);
    lidBody.castShadow = true;
    lidBody.position.y = 0.86;
    lidGroup.add(lidBody);

    // Lid Top View Disk with Embossed Leaf Emblem Texture
    const lidTopDiskGeo = new THREE.CircleGeometry(1.215, 64);
    const lidTopTexture = createLidTopTexture(engraving);
    const lidTopMat = new THREE.MeshStandardMaterial({
      map: lidTopTexture,
      roughness: 0.2,
      metalness: 0.85
    });
    const lidTopDisk = new THREE.Mesh(lidTopDiskGeo, lidTopMat);
    lidTopDisk.rotation.x = -Math.PI / 2;
    lidTopDisk.position.y = 1.072;
    lidGroup.add(lidTopDisk);

    // Inner lid silicone gasket liner
    const gasketGeo = new THREE.CylinderGeometry(1.15, 1.15, 0.05, 48);
    const gasketMat = new THREE.MeshStandardMaterial({ color: 0xFFFFFF, roughness: 0.8 });
    const gasket = new THREE.Mesh(gasketGeo, gasketMat);
    gasket.position.y = 0.68;
    lidGroup.add(gasket);

    state.lidMesh = lidGroup;
    jarGroup.add(lidGroup);

    state.productGroup.add(jarGroup);
  }

  function buildDropperBottle(state: NonNullable<typeof threeRef.current>, variant: ProductVariant) {
    const bottleGroup = new THREE.Group();

    // Slender amber/green cosmetic bottle
    const bodyGeo = new THREE.CylinderGeometry(0.85, 0.85, 2.2, 48);
    const bodyMat = new THREE.MeshPhysicalMaterial({
      color: 0x224B28, // Deep organic emerald bottle
      roughness: 0.12,
      transmission: 0.65,
      ior: 1.52,
      thickness: 1.2
    });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.castShadow = true;
    bottleGroup.add(body);

    // Bottle shoulder curve
    const shoulderGeo = new THREE.SphereGeometry(0.85, 48, 16, 0, Math.PI * 2, 0, Math.PI * 0.35);
    const shoulder = new THREE.Mesh(shoulderGeo, bodyMat);
    shoulder.position.y = 1.1;
    bottleGroup.add(shoulder);

    // Label wrap
    const labelGeo = new THREE.CylinderGeometry(0.86, 0.86, 1.7, 48, 1, true);
    const labelTexture = createJarLabelTexture({
      ...variant,
      name: 'Vitamin C Face Serum',
      tagline: 'Brightens | Protects | Hydrates',
      netWeight: '30 ml e 1.01 fl. oz.'
    });
    const labelMat = new THREE.MeshStandardMaterial({
      map: labelTexture,
      roughness: 0.35,
      metalness: 0.05
    });
    const label = new THREE.Mesh(labelGeo, labelMat);
    label.rotation.y = -Math.PI / 2;
    bottleGroup.add(label);

    // Gold collar
    const collarGeo = new THREE.CylinderGeometry(0.48, 0.48, 0.5, 32);
    const collarMat = new THREE.MeshStandardMaterial({
      color: 0xD4AF37,
      roughness: 0.18,
      metalness: 0.92
    });
    const collar = new THREE.Mesh(collarGeo, collarMat);
    collar.position.y = 1.6;
    bottleGroup.add(collar);

    // White soft rubber pipette bulb
    const bulbGeo = new THREE.CylinderGeometry(0.38, 0.44, 0.7, 32);
    const bulbMat = new THREE.MeshStandardMaterial({ color: 0xFFFFFF, roughness: 0.7 });
    const bulb = new THREE.Mesh(bulbGeo, bulbMat);
    bulb.position.y = 2.1;
    bottleGroup.add(bulb);

    state.productGroup.add(bottleGroup);
  }

  function buildPumpBottle(state: NonNullable<typeof threeRef.current>, variant: ProductVariant) {
    const pumpGroup = new THREE.Group();

    // Tall Cleanser bottle body
    const bodyGeo = new THREE.CylinderGeometry(0.95, 0.95, 2.6, 48);
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0xF7F6F0, // Crisp clean frosted white
      roughness: 0.25,
      metalness: 0.05
    });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.castShadow = true;
    pumpGroup.add(body);

    // Label wrap
    const labelGeo = new THREE.CylinderGeometry(0.96, 0.96, 2.1, 48, 1, true);
    const labelTexture = createJarLabelTexture({
      ...variant,
      name: 'Gentle Cleanser',
      tagline: 'With Aloe Vera & Chamomile',
      netWeight: '100 ml e 3.38 fl. oz.'
    });
    const labelMat = new THREE.MeshStandardMaterial({ map: labelTexture });
    const label = new THREE.Mesh(labelGeo, labelMat);
    label.rotation.y = -Math.PI / 2;
    pumpGroup.add(label);

    // Gold Pump collar
    const collarGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.35, 32);
    const collarMat = new THREE.MeshStandardMaterial({ color: 0xD4AF37, metalness: 0.9, roughness: 0.2 });
    const collar = new THREE.Mesh(collarGeo, collarMat);
    collar.position.y = 1.45;
    pumpGroup.add(collar);

    // Pump nozzle head
    const nozzleGeo = new THREE.BoxGeometry(0.35, 0.3, 0.9);
    const nozzle = new THREE.Mesh(nozzleGeo, collarMat);
    nozzle.position.set(0, 1.8, 0.25);
    pumpGroup.add(nozzle);

    state.productGroup.add(pumpGroup);
  }

  function buildSprayBottle(state: NonNullable<typeof threeRef.current>, variant: ProductVariant) {
    const sprayGroup = new THREE.Group();

    const bodyGeo = new THREE.CylinderGeometry(0.85, 0.85, 2.4, 48);
    const bodyMat = new THREE.MeshPhysicalMaterial({
      color: 0x2A5D3E, // Forest green glass mist bottle
      roughness: 0.15,
      transmission: 0.7,
      ior: 1.5
    });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.castShadow = true;
    sprayGroup.add(body);

    // Label
    const labelGeo = new THREE.CylinderGeometry(0.86, 0.86, 1.9, 48, 1, true);
    const labelTexture = createJarLabelTexture({
      ...variant,
      name: 'Hydrating Toner',
      tagline: 'With Witch Hazel & Rose Water',
      netWeight: '100 ml e 3.38 fl. oz.'
    });
    const label = new THREE.Mesh(labelGeo, new THREE.MeshStandardMaterial({ map: labelTexture }));
    label.rotation.y = -Math.PI / 2;
    sprayGroup.add(label);

    // Spray collar and clear overcap
    const collarGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.4, 32);
    const collarMat = new THREE.MeshStandardMaterial({ color: 0xD4AF37, metalness: 0.9, roughness: 0.2 });
    const collar = new THREE.Mesh(collarGeo, collarMat);
    collar.position.y = 1.4;
    sprayGroup.add(collar);

    const capGeo = new THREE.CylinderGeometry(0.55, 0.55, 0.8, 32);
    const capMat = new THREE.MeshPhysicalMaterial({ color: 0xffffff, transmission: 0.9, roughness: 0.1 });
    const cap = new THREE.Mesh(capGeo, capMat);
    cap.position.y = 1.8;
    sprayGroup.add(cap);

    state.productGroup.add(sprayGroup);
  }

  function buildEcoTubeSet(state: NonNullable<typeof threeRef.current>, variant: ProductVariant) {
    const bundleGroup = new THREE.Group();

    // Large Kraft Cylindrical Outer Tube (User image feature!)
    const tubeGeo = new THREE.CylinderGeometry(1.35, 1.35, 3.2, 64);
    const tubeTexture = createEcoTubeTexture();
    const tubeMat = new THREE.MeshStandardMaterial({
      map: tubeTexture,
      roughness: 0.75,
      metalness: 0.05
    });
    const tube = new THREE.Mesh(tubeGeo, tubeMat);
    tube.position.set(0.9, 0.4, -0.4);
    tube.castShadow = true;
    bundleGroup.add(tube);

    // Front Jar standing beside tube
    const jarMiniGroup = new THREE.Group();
    jarMiniGroup.position.set(-0.8, -0.3, 0.5);
    buildSkincareJar(state, variant);
    // Move jar inside the group
    jarMiniGroup.add(...state.productGroup.children);
    bundleGroup.add(jarMiniGroup);

    state.productGroup.add(bundleGroup);
  }

  // -------------------------------------------------------------
  // INTERACTIVE MOUSE & TOUCH CONTROLS
  // -------------------------------------------------------------

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const state = threeRef.current;
    if (!state) return;
    state.isDragging = true;
    state.previousMousePosition = { x: e.clientX, y: e.clientY };
    canvasRef.current?.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const state = threeRef.current;
    if (!state || !state.isDragging) return;

    const deltaX = e.clientX - state.previousMousePosition.x;
    const deltaY = e.clientY - state.previousMousePosition.y;

    state.targetRotationY += deltaX * 0.008;
    state.targetRotationX += deltaY * 0.006;

    state.previousMousePosition = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const state = threeRef.current;
    if (!state) return;
    state.isDragging = false;
    try {
      canvasRef.current?.releasePointerCapture(e.pointerId);
    } catch {
      // safely ignore
    }
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const state = threeRef.current;
    if (!state) return;
    const newDistance = THREE.MathUtils.clamp(
      state.targetCameraDistance + e.deltaY * 0.005,
      2.8,
      8.0
    );
    state.targetCameraDistance = newDistance;
    setZoomLevel(Number((4.8 / newDistance).toFixed(2)));
  };

  // Camera preset views
  const setCameraView = (angle: string) => {
    const state = threeRef.current;
    if (!state) return;
    setActiveViewAngle(angle);
    setAutoRotate(false);

    switch (angle) {
      case 'front':
        state.targetRotationY = 0;
        state.targetRotationX = 0.05;
        state.targetCameraDistance = 4.6;
        break;
      case 'back':
        state.targetRotationY = Math.PI;
        state.targetRotationX = 0.05;
        state.targetCameraDistance = 4.6;
        break;
      case 'side':
        state.targetRotationY = Math.PI * 0.55;
        state.targetRotationX = 0.05;
        state.targetCameraDistance = 4.6;
        break;
      case 'lid':
        state.targetRotationY = 0;
        state.targetRotationX = 0.82; // steep top-down view to admire lid
        state.targetCameraDistance = 3.9;
        break;
      case 'hero':
      default:
        state.targetRotationY = 0.45;
        state.targetRotationX = 0.15;
        state.targetCameraDistance = 4.8;
        break;
    }
  };

  const adjustZoom = (delta: number) => {
    const state = threeRef.current;
    if (!state) return;
    const newDist = THREE.MathUtils.clamp(state.targetCameraDistance - delta * 0.7, 2.8, 8.0);
    state.targetCameraDistance = newDist;
    setZoomLevel(Number((4.8 / newDist).toFixed(2)));
  };

  const handleDownloadSnapshot = () => {
    if (!canvasRef.current) return;
    const dataUrl = canvasRef.current.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `FreshGlow-${selectedVariant.name.replace(/\s+/g, '-')}-3D.png`;
    link.href = dataUrl;
    link.click();
  };

  return (
    <div
      id="product-3d-viewer-container"
      ref={containerRef}
      className={`relative w-full h-[540px] md:h-[620px] rounded-2xl overflow-hidden select-none border border-[#E8DCC0]/70 bg-gradient-to-b from-[#FAF9F5] to-[#F2EFE6] shadow-sm flex flex-col justify-between ${className}`}
    >
      {/* 3D WebGL Canvas */}
      <canvas
        id="webgl-product-canvas"
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onWheel={handleWheel}
        className="w-full h-full cursor-grab active:cursor-grabbing block touch-none"
      />

      {/* Top Floating Control Bar */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
        {/* Quality / Mode Badge */}
        <div className="pointer-events-auto flex items-center space-x-2 bg-white/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#E8DCC0] shadow-sm text-xs font-medium text-[#2E6B4E]">
          <span className="w-2 h-2 rounded-full bg-[#2E6B4E] animate-pulse"></span>
          <span>WebGL 3D Interactive</span>
          <span className="text-gray-400">|</span>
          <span className="text-[#333333]">{selectedVariant.name}</span>
        </div>

        {/* Action Buttons */}
        <div className="pointer-events-auto flex items-center space-x-2">
          {/* AR Experience Button */}
          <button
            id="launch-ar-btn"
            onClick={onOpenAR}
            className="flex items-center space-x-1.5 bg-[#2E6B4E] hover:bg-[#1F4835] text-white px-3.5 py-1.5 rounded-full text-xs font-semibold shadow-md hover:shadow-lg transition-all transform hover:scale-[1.02] active:scale-[0.98]"
            title="View in your room with Augmented Reality"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#F2C7C1]" />
            <span>View in AR</span>
          </button>

          {/* Lighting Controls Toggle */}
          <button
            id="toggle-lighting-btn"
            onClick={() => setShowLightingControls(!showLightingControls)}
            className={`p-2 rounded-full border text-xs transition-colors backdrop-blur-md ${
              showLightingControls
                ? 'bg-[#2E6B4E] text-white border-[#2E6B4E]'
                : 'bg-white/80 text-[#333333] border-[#E8DCC0] hover:bg-white'
            }`}
            title="Adjust Studio Lighting"
          >
            <Sun className="w-4 h-4" />
          </button>

          {/* Snapshot Button */}
          <button
            id="take-snapshot-btn"
            onClick={handleDownloadSnapshot}
            className="p-2 rounded-full bg-white/80 hover:bg-white text-[#333333] border border-[#E8DCC0] text-xs transition-colors backdrop-blur-md"
            title="Download 3D View Snapshot"
          >
            <Camera className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Expandable Lighting & Material Settings Drawer */}
      {showLightingControls && (
        <div className="absolute top-16 right-4 z-20 w-72 bg-white/95 backdrop-blur-lg p-4 rounded-xl border border-[#E8DCC0] shadow-xl text-xs space-y-3">
          <div className="flex items-center justify-between border-b border-[#F0EBE0] pb-2 font-semibold text-[#2E6B4E]">
            <span className="flex items-center gap-1.5">
              <Sun className="w-3.5 h-3.5" /> Studio Lighting & Shader
            </span>
            <button
              onClick={() => setShowLightingControls(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          {/* Presets */}
          <div>
            <label className="text-[11px] font-medium text-gray-600 block mb-1">Atmosphere Preset</label>
            <div className="grid grid-cols-2 gap-1.5">
              {(['studio', 'sunset', 'spa', 'midnight'] as LightingPreset[]).map((p) => (
                <button
                  key={p}
                  onClick={() => setLighting((prev) => ({ ...prev, preset: p }))}
                  className={`py-1.5 px-2 rounded-lg text-[11px] font-medium capitalize border transition-all ${
                    lighting.preset === p
                      ? 'bg-[#2E6B4E] text-white border-[#2E6B4E]'
                      : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Light Intensity Slider */}
          <div>
            <div className="flex justify-between text-[11px] text-gray-600 mb-0.5">
              <span>Light Intensity</span>
              <span>{lighting.intensity.toFixed(1)}x</span>
            </div>
            <input
              type="range"
              min="0.4"
              max="2.2"
              step="0.1"
              value={lighting.intensity}
              onChange={(e) => setLighting({ ...lighting, intensity: parseFloat(e.target.value) })}
              className="w-full accent-[#2E6B4E] cursor-pointer"
            />
          </div>

          {/* Light Rotation Slider */}
          <div>
            <div className="flex justify-between text-[11px] text-gray-600 mb-0.5">
              <span>Key Light Angle</span>
              <span>{lighting.rotation}°</span>
            </div>
            <input
              type="range"
              min="0"
              max="360"
              step="5"
              value={lighting.rotation}
              onChange={(e) => setLighting({ ...lighting, rotation: parseInt(e.target.value) })}
              className="w-full accent-[#2E6B4E] cursor-pointer"
            />
          </div>

          {/* Glass Finish / Roughness */}
          <div>
            <div className="flex justify-between text-[11px] text-gray-600 mb-0.5">
              <span>Glass Finish</span>
              <span>{lighting.roughness < 0.25 ? 'Glossy' : 'Frosted Matte'}</span>
            </div>
            <input
              type="range"
              min="0.05"
              max="0.6"
              step="0.05"
              value={lighting.roughness}
              onChange={(e) => setLighting({ ...lighting, roughness: parseFloat(e.target.value) })}
              className="w-full accent-[#2E6B4E] cursor-pointer"
            />
          </div>
        </div>
      )}

      {/* Bottom Camera Angles & Interactive Controls */}
      <div className="absolute bottom-4 left-4 right-4 flex flex-col sm:flex-row items-center justify-between gap-2 pointer-events-none">
        {/* Multi-angle Quick Viewpoints (Matching Front, Back, Side, Lid Top in User's Image!) */}
        <div className="pointer-events-auto flex items-center space-x-1.5 bg-white/85 backdrop-blur-md p-1.5 rounded-full border border-[#E8DCC0] shadow-sm overflow-x-auto max-w-full">
          <button
            id="view-hero-btn"
            onClick={() => setCameraView('hero')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
              activeViewAngle === 'hero' ? 'bg-[#2E6B4E] text-white shadow-xs' : 'text-[#333333] hover:bg-gray-100'
            }`}
          >
            Hero 45°
          </button>
          <button
            id="view-front-btn"
            onClick={() => setCameraView('front')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
              activeViewAngle === 'front' ? 'bg-[#2E6B4E] text-white shadow-xs' : 'text-[#333333] hover:bg-gray-100'
            }`}
          >
            Front View
          </button>
          <button
            id="view-side-btn"
            onClick={() => setCameraView('side')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
              activeViewAngle === 'side' ? 'bg-[#2E6B4E] text-white shadow-xs' : 'text-[#333333] hover:bg-gray-100'
            }`}
          >
            Side Certs
          </button>
          <button
            id="view-back-btn"
            onClick={() => setCameraView('back')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
              activeViewAngle === 'back' ? 'bg-[#2E6B4E] text-white shadow-xs' : 'text-[#333333] hover:bg-gray-100'
            }`}
          >
            Back Directions
          </button>
          <button
            id="view-lid-btn"
            onClick={() => setCameraView('lid')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
              activeViewAngle === 'lid' ? 'bg-[#2E6B4E] text-white shadow-xs' : 'text-[#333333] hover:bg-gray-100'
            }`}
          >
            Lid Top View
          </button>
        </div>

        {/* Action Toggles: Lid Explode / Auto-spin / Zoom */}
        <div className="pointer-events-auto flex items-center space-x-1.5 bg-white/85 backdrop-blur-md p-1.5 rounded-full border border-[#E8DCC0] shadow-sm">
          {/* Lid Open / Reveal Swirl toggle for jar */}
          {activeModelType === 'jar' && (
            <button
              id="open-lid-btn"
              onClick={() => setIsLidOpen(!isLidOpen)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all flex items-center gap-1 ${
                isLidOpen ? 'bg-[#D9896A] text-white' : 'text-[#333333] hover:bg-gray-100'
              }`}
              title="Open lid to inspect cream texture inside"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{isLidOpen ? 'Close Lid' : 'Open Lid'}</span>
            </button>
          )}

          {/* Auto rotate toggle */}
          <button
            id="auto-rotate-btn"
            onClick={() => setAutoRotate(!autoRotate)}
            className={`p-1.5 rounded-full text-xs transition-colors ${
              autoRotate ? 'bg-[#2E6B4E] text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
            title={autoRotate ? 'Pause 360° spin' : 'Start 360° spin'}
          >
            <RotateCw className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin' : ''}`} style={{ animationDuration: '8s' }} />
          </button>

          {/* Zoom controls */}
          <button
            id="zoom-out-btn"
            onClick={() => adjustZoom(-1)}
            className="p-1.5 rounded-full text-gray-600 hover:bg-gray-100"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="text-[11px] font-semibold text-gray-600 w-8 text-center">{zoomLevel}x</span>
          <button
            id="zoom-in-btn"
            onClick={() => adjustZoom(1)}
            className="p-1.5 rounded-full text-gray-600 hover:bg-gray-100"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Drag gesture hint */}
      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 pointer-events-none opacity-60 hover:opacity-0 transition-opacity">
        <span className="text-[10px] uppercase tracking-wider text-gray-500 bg-white/70 backdrop-blur-xs px-2.5 py-1 rounded-full border border-gray-200/50">
          Drag to 360° Rotate • Scroll to Zoom
        </span>
      </div>
    </div>
  );
};
