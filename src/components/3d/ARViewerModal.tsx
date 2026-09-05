import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { ProductVariant, SkincareProduct } from '../../types';
import { GEL_CREAM_VARIANTS } from '../../data/products';
import { createJarLabelTexture, createLidTopTexture } from '../../utils/textureGenerator';
import { 
  Camera, 
  X, 
  RotateCw, 
  ZoomIn, 
  ZoomOut, 
  Smartphone, 
  Maximize, 
  Sliders, 
  Check, 
  AlertCircle,
  Sparkles
} from 'lucide-react';

interface ARViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: SkincareProduct;
  selectedVariant: ProductVariant;
  customEngraving?: string;
}

export const ARViewerModal: React.FC<ARViewerModalProps> = ({
  isOpen,
  onClose,
  product,
  selectedVariant,
  customEngraving
}) => {
  const activeVariant = selectedVariant || (product?.variants && product.variants[0]) || GEL_CREAM_VARIANTS[0];

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [hasCamera, setHasCamera] = useState<boolean | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [selectedBackdrop, setSelectedBackdrop] = useState<'vanity' | 'wood' | 'marble'>('vanity');
  const [scaleFactor, setScaleFactor] = useState<number>(1.0); // 1:1 true scale
  const [arLighting, setArLighting] = useState<'daylight' | 'warm' | 'bathroom'>('warm');
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [surfaceDetected, setSurfaceDetected] = useState<boolean>(true);

  const threeAR = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    productGroup: THREE.Group;
    keyLight: THREE.DirectionalLight;
    ambientLight: THREE.AmbientLight;
    isDragging: boolean;
    prevX: number;
    prevY: number;
    posX: number;
    posY: number;
    rotY: number;
  } | null>(null);

  // Initialize camera
  useEffect(() => {
    if (!isOpen) return;

    let mediaStream: MediaStream | null = null;

    async function initCamera() {
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error('Camera not supported by browser');
        }
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: 'environment' } },
          audio: false
        });
        mediaStream = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
        setHasCamera(true);
        setCameraError(null);
      } catch (err) {
        console.log('Camera access unavailable, using interactive room backdrop:', err);
        setHasCamera(false);
        setCameraError('Camera unavailable or permission denied. Showing simulated room space.');
      }
    }

    initCamera();

    return () => {
      if (mediaStream) {
        mediaStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isOpen]);

  // Initialize 3D AR overlay scene
  useEffect(() => {
    if (!isOpen || !canvasRef.current || !containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0.6, 2.5);
    camera.lookAt(0, -0.1, 0);

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true,
      preserveDrawingBuffer: true
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;

    // AR Lights matching environment
    const ambientLight = new THREE.AmbientLight(0xFFF9EE, 1.2);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xFFFFFF, 1.5);
    keyLight.position.set(2, 4, 3);
    keyLight.castShadow = true;
    scene.add(keyLight);

    // Reticle Target ring on table surface
    const ringGeo = new THREE.RingGeometry(0.35, 0.42, 32);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x2E6B4E,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.7
    });
    const reticle = new THREE.Mesh(ringGeo, ringMat);
    reticle.rotation.x = -Math.PI / 2;
    reticle.position.y = -0.5;
    scene.add(reticle);

    // Soft contact shadow
    const shadowGeo = new THREE.PlaneGeometry(1.8, 1.8);
    const shadowMat = new THREE.ShadowMaterial({ opacity: 0.35 });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = -0.49;
    shadowMesh.receiveShadow = true;
    scene.add(shadowMesh);

    // Product Model Group
    const productGroup = new THREE.Group();
    productGroup.position.set(0, -0.48, 0);
    productGroup.scale.set(0.45, 0.45, 0.45); // realistic desk size
    scene.add(productGroup);

    // Build jar for AR
    const jarOuterGeo = new THREE.CylinderGeometry(0.7, 0.68, 0.75, 48);
    const jarMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(activeVariant.jarColor),
      roughness: 0.2,
      metalness: 0.05,
      transmission: 0.6,
      transparent: true,
      opacity: 0.95
    });
    const jar = new THREE.Mesh(jarOuterGeo, jarMat);
    jar.castShadow = true;
    productGroup.add(jar);

    // Label wrap
    const labelGeo = new THREE.CylinderGeometry(0.702, 0.682, 0.62, 48, 1, true);
    const labelTex = createJarLabelTexture(activeVariant, customEngraving);
    const labelMat = new THREE.MeshStandardMaterial({ map: labelTex });
    const label = new THREE.Mesh(labelGeo, labelMat);
    label.rotation.y = -Math.PI / 2;
    productGroup.add(label);

    // Gold Lid with Embossed Top View
    const lidGeo = new THREE.CylinderGeometry(0.71, 0.71, 0.24, 48);
    const lidMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(activeVariant.lidColor),
      metalness: 0.88,
      roughness: 0.2
    });
    const lid = new THREE.Mesh(lidGeo, lidMat);
    lid.position.y = 0.48;
    lid.castShadow = true;
    productGroup.add(lid);

    const lidTopGeo = new THREE.CircleGeometry(0.705, 48);
    const lidTopTex = createLidTopTexture(customEngraving);
    const lidTop = new THREE.Mesh(lidTopGeo, new THREE.MeshStandardMaterial({ map: lidTopTex, metalness: 0.85, roughness: 0.2 }));
    lidTop.rotation.x = -Math.PI / 2;
    lidTop.position.y = 0.601;
    productGroup.add(lidTop);

    threeAR.current = {
      scene,
      camera,
      renderer,
      productGroup,
      keyLight,
      ambientLight,
      isDragging: false,
      prevX: 0,
      prevY: 0,
      posX: 0,
      posY: -0.48,
      rotY: 0.2
    };

    let animId: number;
    let clock = new THREE.Clock();

    const renderLoop = () => {
      animId = requestAnimationFrame(renderLoop);
      const t = clock.getElapsedTime();
      // Reticle pulse
      ringMat.opacity = 0.4 + Math.sin(t * 3) * 0.25;

      const state = threeAR.current;
      if (state) {
        state.productGroup.rotation.y = state.rotY;
        state.productGroup.position.x = state.posX;
        state.productGroup.position.y = state.posY;
        state.productGroup.scale.set(0.45 * scaleFactor, 0.45 * scaleFactor, 0.45 * scaleFactor);
        state.renderer.render(state.scene, state.camera);
      }
    };
    renderLoop();

    return () => {
      cancelAnimationFrame(animId);
      renderer.dispose();
    };
  }, [isOpen, selectedVariant, customEngraving, scaleFactor]);

  // Adjust AR lighting
  useEffect(() => {
    const state = threeAR.current;
    if (!state) return;

    if (arLighting === 'warm') {
      state.keyLight.color.setHex(0xFFEDD5);
      state.ambientLight.color.setHex(0xFFF7ED);
      state.keyLight.intensity = 1.4;
    } else if (arLighting === 'daylight') {
      state.keyLight.color.setHex(0xF8FAFC);
      state.ambientLight.color.setHex(0xF1F5F9);
      state.keyLight.intensity = 1.6;
    } else {
      state.keyLight.color.setHex(0xFEF3C7);
      state.ambientLight.color.setHex(0xFEF9C3);
      state.keyLight.intensity = 1.2;
    }
  }, [arLighting]);

  // Pointer drag for moving & spinning in AR space
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const state = threeAR.current;
    if (!state) return;
    state.isDragging = true;
    state.prevX = e.clientX;
    state.prevY = e.clientY;
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const state = threeAR.current;
    if (!state || !state.isDragging) return;

    const dx = e.clientX - state.prevX;
    const dy = e.clientY - state.prevY;

    // If shift or 2 fingers, move position; otherwise rotate
    if (e.buttons === 2 || e.shiftKey) {
      state.posX += dx * 0.003;
      state.posY -= dy * 0.003;
    } else {
      state.rotY += dx * 0.01;
    }

    state.prevX = e.clientX;
    state.prevY = e.clientY;
  };

  const handlePointerUp = () => {
    if (threeAR.current) threeAR.current.isDragging = false;
  };

  const handleCaptureSnapshot = () => {
    if (!canvasRef.current) return;
    // Composite video background and 3D canvas
    const compCanvas = document.createElement('canvas');
    compCanvas.width = canvasRef.current.width;
    compCanvas.height = canvasRef.current.height;
    const ctx = compCanvas.getContext('2d');
    if (!ctx) return;

    if (videoRef.current && hasCamera) {
      ctx.drawImage(videoRef.current, 0, 0, compCanvas.width, compCanvas.height);
    } else {
      // Draw background gradient or texture
      ctx.fillStyle = selectedBackdrop === 'vanity' ? '#D6C8B4' : selectedBackdrop === 'marble' ? '#EAE8E4' : '#C7B299';
      ctx.fillRect(0, 0, compCanvas.width, compCanvas.height);
    }

    // Draw 3D WebGL render
    ctx.drawImage(canvasRef.current, 0, 0);

    // Watermark
    ctx.fillStyle = '#2E6B4E';
    ctx.font = 'bold 20px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('FreshGlow AR Experience', 24, compCanvas.height - 24);

    const dataUrl = compCanvas.toDataURL('image/png');
    setCapturedPhoto(dataUrl);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-6 animate-in fade-in duration-200">
      <div
        ref={containerRef}
        className="relative w-full max-w-4xl h-[85vh] max-h-[780px] bg-gray-900 rounded-2xl overflow-hidden shadow-2xl flex flex-col justify-between border border-gray-700"
      >
        {/* Background Camera Video Stream */}
        {hasCamera ? (
          <video
            ref={videoRef}
            playsInline
            muted
            autoPlay
            className="absolute inset-0 w-full h-full object-cover z-0"
          />
        ) : (
          <div
            className={`absolute inset-0 w-full h-full z-0 transition-all duration-500 ${
              selectedBackdrop === 'vanity'
                ? 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#EFEAE1] via-[#D8CEBF] to-[#BDB09E]'
                : selectedBackdrop === 'marble'
                ? 'bg-gradient-to-tr from-[#E3E3E3] via-[#F2F2F2] to-[#D9D9D9]'
                : 'bg-gradient-to-b from-[#C4A482] via-[#9E7D59] to-[#6E543C]'
            }`}
          >
            {/* Architectural room grid / surface table lines */}
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-black/10 border-t border-white/20">
              <div className="w-full h-full opacity-20 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:32px_32px]"></div>
            </div>
          </div>
        )}

        {/* 3D WebGL Overlay Canvas */}
        <canvas
          ref={canvasRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onContextMenu={(e) => e.preventDefault()}
          className="absolute inset-0 w-full h-full z-10 cursor-move touch-none"
        />

        {/* Top Floating Header */}
        <div className="relative z-20 p-4 flex items-center justify-between pointer-events-none">
          <div className="pointer-events-auto bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20 text-white text-xs flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="font-semibold text-emerald-300">AR Live Surface Tracking</span>
            <span className="text-gray-400">|</span>
            <span>{selectedVariant.name}</span>
          </div>

          <div className="pointer-events-auto flex items-center gap-2">
            {/* Capture snapshot */}
            <button
              onClick={handleCaptureSnapshot}
              className="bg-white hover:bg-gray-100 text-gray-900 px-3.5 py-1.5 rounded-full text-xs font-semibold shadow-lg flex items-center gap-1.5 transition-all"
            >
              <Camera className="w-3.5 h-3.5 text-[#2E6B4E]" />
              <span>Take Photo</span>
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-black/60 hover:bg-black text-white border border-white/20 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Camera fallback notice & Room backdrop switcher */}
        {!hasCamera && (
          <div className="relative z-20 self-center bg-black/70 backdrop-blur-md text-white text-xs px-4 py-2 rounded-xl border border-white/20 flex flex-col sm:flex-row items-center gap-3">
            <div className="flex items-center gap-1.5 text-amber-300">
              <AlertCircle className="w-4 h-4" />
              <span>Simulated Vanity Studio Space</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-gray-300 text-[11px]">Backdrop:</span>
              <button
                onClick={() => setSelectedBackdrop('vanity')}
                className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                  selectedBackdrop === 'vanity' ? 'bg-[#2E6B4E] text-white' : 'bg-white/20'
                }`}
              >
                Vanity
              </button>
              <button
                onClick={() => setSelectedBackdrop('marble')}
                className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                  selectedBackdrop === 'marble' ? 'bg-[#2E6B4E] text-white' : 'bg-white/20'
                }`}
              >
                Marble
              </button>
              <button
                onClick={() => setSelectedBackdrop('wood')}
                className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                  selectedBackdrop === 'wood' ? 'bg-[#2E6B4E] text-white' : 'bg-white/20'
                }`}
              >
                Spa Wood
              </button>
            </div>
          </div>
        )}

        {/* Bottom AR Tools: Scale, Environment, Instructions */}
        <div className="relative z-20 p-4 bg-gradient-to-t from-black/80 via-black/50 to-transparent flex flex-col sm:flex-row items-center justify-between gap-3 text-white text-xs">
          {/* Scale Buttons (1:1 true-to-life size) */}
          <div className="flex items-center space-x-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20">
            <span className="text-gray-300 text-[11px]">Real Scale:</span>
            <button
              onClick={() => setScaleFactor(0.75)}
              className={`px-2 py-0.5 rounded text-[11px] ${scaleFactor === 0.75 ? 'bg-[#2E6B4E] font-bold' : 'hover:bg-white/10'}`}
            >
              0.75x
            </button>
            <button
              onClick={() => setScaleFactor(1.0)}
              className={`px-2 py-0.5 rounded text-[11px] ${scaleFactor === 1.0 ? 'bg-[#2E6B4E] font-bold' : 'hover:bg-white/10'}`}
            >
              1:1 (True Size)
            </button>
            <button
              onClick={() => setScaleFactor(1.4)}
              className={`px-2 py-0.5 rounded text-[11px] ${scaleFactor === 1.4 ? 'bg-[#2E6B4E] font-bold' : 'hover:bg-white/10'}`}
            >
              1.4x (Inspect)
            </button>
          </div>

          {/* AR Environment Lighting */}
          <div className="flex items-center space-x-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20">
            <span className="text-gray-300 text-[11px]">Lighting:</span>
            <button
              onClick={() => setArLighting('warm')}
              className={`px-2 py-0.5 rounded text-[11px] ${arLighting === 'warm' ? 'bg-[#D9896A] font-bold' : 'hover:bg-white/10'}`}
            >
              Warm Ambient
            </button>
            <button
              onClick={() => setArLighting('daylight')}
              className={`px-2 py-0.5 rounded text-[11px] ${arLighting === 'daylight' ? 'bg-[#2E6B4E] font-bold' : 'hover:bg-white/10'}`}
            >
              Daylight
            </button>
            <button
              onClick={() => setArLighting('bathroom')}
              className={`px-2 py-0.5 rounded text-[11px] ${arLighting === 'bathroom' ? 'bg-amber-600 font-bold' : 'hover:bg-white/10'}`}
            >
              Vanity Mirror
            </button>
          </div>

          {/* Touch instruction */}
          <div className="text-[11px] text-gray-300 hidden md:block">
            <span>Drag to rotate • Shift + drag to move product position</span>
          </div>
        </div>

        {/* Snapshot Preview Modal */}
        {capturedPhoto && (
          <div className="absolute inset-0 z-30 bg-black/90 flex flex-col items-center justify-center p-6 animate-in fade-in">
            <div className="bg-white p-4 rounded-2xl max-w-md w-full shadow-2xl space-y-3">
              <div className="flex justify-between items-center text-[#2E6B4E]">
                <h4 className="font-semibold text-sm flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-600" /> AR Photo Captured
                </h4>
                <button onClick={() => setCapturedPhoto(null)} className="text-gray-400 hover:text-gray-600">
                  ✕
                </button>
              </div>
              <div className="rounded-xl overflow-hidden border border-gray-200">
                <img src={capturedPhoto} alt="Captured AR Skincare" className="w-full h-auto object-cover" />
              </div>
              <div className="flex gap-2 pt-1">
                <a
                  href={capturedPhoto}
                  download={`FreshGlow-AR-${selectedVariant.name}.png`}
                  className="flex-1 bg-[#2E6B4E] hover:bg-[#1F4835] text-white py-2 rounded-xl text-center text-xs font-semibold shadow-sm transition-colors"
                >
                  Download Photo
                </a>
                <button
                  onClick={() => setCapturedPhoto(null)}
                  className="px-4 py-2 border border-gray-200 rounded-xl text-xs text-gray-700 hover:bg-gray-50"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
