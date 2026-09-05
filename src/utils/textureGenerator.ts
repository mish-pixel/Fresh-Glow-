import * as THREE from 'three';
import { ProductVariant } from '../types';

/**
 * Creates high-resolution 2048x1024 texture for cylindrical jar wraps
 * faithfully replicating the multi-angle views in the user's uploaded images.
 */
export function createJarLabelTexture(
  variant: ProductVariant,
  customEngraving?: string
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return new THREE.CanvasTexture(canvas);
  }

  // Soft cream label background matching #F6F4EC with subtle organic paper grain
  ctx.fillStyle = '#F8F6EE';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Subtle organic texture shading
  const bgGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
  bgGrad.addColorStop(0, 'rgba(232, 220, 192, 0.25)');
  bgGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.4)');
  bgGrad.addColorStop(1, 'rgba(232, 220, 192, 0.3)');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Decorative border lines
  ctx.strokeStyle = variant.accentColor;
  ctx.lineWidth = 2;
  ctx.strokeRect(40, 40, canvas.width - 80, canvas.height - 80);

  // -------------------------------------------------------------
  // FRONT VIEW PANEL (Center at x = 1024)
  // -------------------------------------------------------------
  const frontX = 1024;

  // Leaf Emblem top
  drawLeafEmblem(ctx, frontX, 220, 50, variant.accentColor);

  // Brand Name
  ctx.fillStyle = variant.textColor;
  ctx.textAlign = 'center';
  ctx.font = '600 84px "Playfair Display", Georgia, serif';
  ctx.fillText('FreshGlow', frontX, 330);

  // Brand Tagline
  ctx.font = '500 28px "Plus Jakarta Sans", sans-serif';
  ctx.letterSpacing = '6px';
  ctx.fillStyle = '#2E6B4E';
  ctx.fillText('ORGANIC SKINCARE', frontX, 380);
  ctx.letterSpacing = '0px';

  // Divider leaf vine
  drawDividerVine(ctx, frontX, 420, 300, variant.accentColor);

  // Product Name
  ctx.font = '700 68px "Playfair Display", Georgia, serif';
  ctx.fillStyle = '#1A3324';
  ctx.fillText(variant.name.toUpperCase(), frontX, 520);

  // Product Subtitle / Active Actives
  ctx.font = '400 34px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = variant.textColor;
  ctx.fillText(variant.tagline, frontX, 580);

  // Botanical leaf accent on sides of front panel
  drawSideLeaves(ctx, frontX - 340, 500, variant.accentColor, -1);
  drawSideLeaves(ctx, frontX + 340, 500, variant.accentColor, 1);

  // Net Weight
  ctx.font = '500 32px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = '#555555';
  ctx.fillText(variant.netWeight, frontX, 740);

  // If custom engraved message
  if (customEngraving && customEngraving.trim()) {
    ctx.font = 'italic 500 28px "Playfair Display", Georgia, serif';
    ctx.fillStyle = '#D9896A';
    ctx.fillText(`“${customEngraving}”`, frontX, 810);
  }

  // -------------------------------------------------------------
  // BACK VIEW PANEL (Left at x = 460)
  // -------------------------------------------------------------
  const backX = 460;
  ctx.textAlign = 'center';
  ctx.fillStyle = '#333333';
  ctx.font = '600 26px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('DIRECTIONS', backX, 220);

  ctx.font = '400 22px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('Apply a small amount to clean face and neck.', backX, 260);
  ctx.fillText('Use daily morning and evening.', backX, 295);

  ctx.font = '600 24px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = '#884433';
  ctx.fillText('CAUTION: For external use only.', backX, 360);
  ctx.font = '400 20px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = '#555555';
  ctx.fillText('Discontinue if irritation occurs.', backX, 395);

  // Badges (Vegan, Cruelty Free, Paraben Free)
  drawBadge(ctx, backX - 120, 540, 'VEGAN', 'FRIENDLY');
  drawBadge(ctx, backX, 540, 'CRUELTY', 'FREE');
  drawBadge(ctx, backX + 120, 540, 'PARABEN', 'FREE');

  ctx.font = '500 20px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = '#666666';
  ctx.fillText(`LOT NO: ${variant.batchNumber} | EXP: 10/2028`, backX, 740);
  ctx.fillText('MADE WITH LOVE IN PACIFIC NORTHWEST', backX, 780);

  // -------------------------------------------------------------
  // SIDE VIEW PANEL (Right at x = 1600)
  // -------------------------------------------------------------
  const sideX = 1600;
  ctx.textAlign = 'center';

  drawSideCert(ctx, sideX, 260, '🌿', 'MADE WITH', 'NATURAL INGREDIENTS');
  drawSideCert(ctx, sideX, 420, '🔬', 'DERMATOLOGICALLY', 'TESTED & APPROVED');
  drawSideCert(ctx, sideX, 580, '✨', 'SUITABLE FOR', 'ALL SKIN TYPES');

  // Sustainability motto
  ctx.font = '500 22px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = '#2E6B4E';
  ctx.fillText('BEAUTY THAT’S GOOD FOR YOU', sideX, 730);
  ctx.fillText('& KIND TO EARTH', sideX, 765);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.anisotropy = 8;
  texture.needsUpdate = true;
  return texture;
}

/**
 * Creates high-res 1024x1024 texture for the Gold Jar Lid Top View
 * with concentric brushed metal rings, the embossed leaf crest, and optional user engraving!
 */
export function createLidTopTexture(customEngraving?: string): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return new THREE.CanvasTexture(canvas);
  }

  const cx = 512;
  const cy = 512;
  const radius = 500;

  // Rich brushed metallic gold radial gradient
  const grad = ctx.createRadialGradient(cx - 100, cy - 100, 50, cx, cy, radius);
  grad.addColorStop(0, '#F5E3A9');
  grad.addColorStop(0.35, '#DFB86C');
  grad.addColorStop(0.7, '#C59A45');
  grad.addColorStop(0.95, '#A3792A');
  grad.addColorStop(1, '#8C631B');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.fill();

  // Brushed circular micro-grooves
  ctx.lineWidth = 1.5;
  for (let r = 80; r < radius - 20; r += 16) {
    ctx.strokeStyle = `rgba(255, 255, 255, ${0.08 + (r % 32 === 0 ? 0.08 : 0.02)})`;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = 'rgba(100, 70, 20, 0.07)';
    ctx.beginPath();
    ctx.arc(cx, cy, r + 4, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Outer bevel ring
  ctx.strokeStyle = '#6D4E12';
  ctx.lineWidth = 14;
  ctx.beginPath();
  ctx.arc(cx, cy, radius - 20, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = '#FFE899';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.arc(cx, cy, radius - 30, 0, Math.PI * 2);
  ctx.stroke();

  // Central Embossed Leaf Crest (from user's "LID TOP VIEW" image)
  drawEmbossedLidLeaf(ctx, cx, cy, 140);

  // Arched text around top rim
  ctx.save();
  ctx.fillStyle = '#6E4E16';
  ctx.font = '600 36px "Plus Jakarta Sans", sans-serif';
  drawCurvedText(ctx, 'FRESHGLOW  •  ORGANIC SKINCARE', cx, cy, 380, -Math.PI * 0.78, 1);
  ctx.restore();

  // Custom User Personal Engraving at bottom rim
  const engraving = (customEngraving && customEngraving.trim()) ? customEngraving.toUpperCase() : 'NOURISHED BY NATURE';
  ctx.save();
  ctx.fillStyle = '#5A3D0B';
  ctx.font = '600 32px "Plus Jakarta Sans", sans-serif';
  drawCurvedText(ctx, `★  ${engraving}  ★`, cx, cy, 380, Math.PI * 0.22, 1);
  ctx.restore();

  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = 8;
  texture.needsUpdate = true;
  return texture;
}

/**
 * Creates 2048x1024 texture for the Cylindrical Eco Tube Packaging
 */
export function createEcoTubeTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Kraft paper warm beige color
  ctx.fillStyle = '#E8DAC0';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Organic fiber flecks
  ctx.fillStyle = 'rgba(150, 120, 80, 0.08)';
  for (let i = 0; i < 400; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const w = 2 + Math.random() * 6;
    const h = 1 + Math.random() * 3;
    ctx.fillRect(x, y, w, h);
  }

  const cx = 1024;
  // Leaf emblem
  drawLeafEmblem(ctx, cx, 200, 60, '#2E6B4E');

  // Brand Name
  ctx.fillStyle = '#1E4B35';
  ctx.textAlign = 'center';
  ctx.font = '700 96px "Playfair Display", Georgia, serif';
  ctx.fillText('FreshGlow', cx, 330);

  ctx.font = '600 32px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = '#2E6B4E';
  ctx.letterSpacing = '8px';
  ctx.fillText('ORGANIC SKINCARE', cx, 390);
  ctx.letterSpacing = '0px';

  ctx.font = '600 28px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = '#444444';
  ctx.fillText('CLEAN  |  NATURAL  |  EFFECTIVE', cx, 470);

  ctx.font = '400 32px "Playfair Display", serif';
  ctx.fillStyle = '#333333';
  ctx.fillText('Care for your skin.', cx, 570);
  ctx.fillText('Care for the planet.', cx, 620);
  ctx.fillText('Choose organic.', cx, 670);

  // Eco icons
  drawBadge(ctx, cx - 180, 800, 'VEGAN', 'FRIENDLY');
  drawBadge(ctx, cx, 800, 'CRUELTY', 'FREE');
  drawBadge(ctx, cx + 180, 800, 'PARABEN', 'FREE');

  ctx.font = '600 24px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = '#2E6B4E';
  ctx.fillText('MADE WITH LOVE ♥', cx, 930);

  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = 8;
  texture.needsUpdate = true;
  return texture;
}

// -------------------------------------------------------------
// HELPER DRAWING FUNCTIONS
// -------------------------------------------------------------

function drawLeafEmblem(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color: string) {
  ctx.save();
  ctx.translate(x, y);
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  // Left leaf
  ctx.beginPath();
  ctx.moveTo(0, 20);
  ctx.bezierCurveTo(-size * 0.8, -size * 0.3, -size * 0.9, -size * 0.8, 0, -size);
  ctx.bezierCurveTo(-size * 0.2, -size * 0.6, 0, -size * 0.3, 0, 20);
  ctx.stroke();

  // Right leaf
  ctx.beginPath();
  ctx.moveTo(0, 20);
  ctx.bezierCurveTo(size * 0.8, -size * 0.3, size * 0.9, -size * 0.8, 0, -size);
  ctx.bezierCurveTo(size * 0.2, -size * 0.6, 0, -size * 0.3, 0, 20);
  ctx.stroke();

  // Central vein
  ctx.beginPath();
  ctx.moveTo(0, 20);
  ctx.lineTo(0, -size * 0.8);
  ctx.stroke();

  ctx.restore();
}

function drawEmbossedLidLeaf(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
  ctx.save();
  ctx.translate(x, y);

  // Shadow / highlight for embossed effect
  ctx.shadowColor = 'rgba(255, 255, 255, 0.6)';
  ctx.shadowBlur = 4;
  ctx.shadowOffsetX = -2;
  ctx.shadowOffsetY = -2;

  ctx.strokeStyle = '#5E4112';
  ctx.lineWidth = 10;
  ctx.lineCap = 'round';

  // Leaf 1
  ctx.beginPath();
  ctx.moveTo(-10, 40);
  ctx.bezierCurveTo(-size, 0, -size * 0.8, -size, 0, -size * 0.9);
  ctx.bezierCurveTo(0, -size * 0.3, -10, 0, -10, 40);
  ctx.stroke();

  // Leaf 2
  ctx.beginPath();
  ctx.moveTo(10, 40);
  ctx.bezierCurveTo(size, 0, size * 0.8, -size, 0, -size * 0.9);
  ctx.bezierCurveTo(0, -size * 0.3, 10, 0, 10, 40);
  ctx.stroke();

  // Stem
  ctx.beginPath();
  ctx.moveTo(0, 40);
  ctx.lineTo(0, -size * 0.7);
  ctx.stroke();

  ctx.restore();
}

function drawDividerVine(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, color: string) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x - width / 2, y);
  ctx.lineTo(x - 25, y);
  ctx.moveTo(x + 25, y);
  ctx.lineTo(x + width / 2, y);
  ctx.stroke();

  // Center small diamond or leaf
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawSideLeaves(ctx: CanvasRenderingContext2D, x: number, y: number, color: string, dir: number) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(dir, 1);
  ctx.strokeStyle = color;
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.quadraticCurveTo(40, -30, 70, -10);
  ctx.quadraticCurveTo(40, 20, 0, 0);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(20, -10);
  ctx.quadraticCurveTo(60, -70, 90, -40);
  ctx.quadraticCurveTo(50, -20, 20, -10);
  ctx.stroke();
  ctx.restore();
}

function drawBadge(ctx: CanvasRenderingContext2D, x: number, y: number, top: string, btm: string) {
  ctx.save();
  ctx.strokeStyle = '#2E6B4E';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(x, y, 46, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = '#2E6B4E';
  ctx.textAlign = 'center';
  ctx.font = '700 13px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(top, x, y - 4);
  ctx.font = '600 12px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(btm, x, y + 14);
  ctx.restore();
}

function drawSideCert(ctx: CanvasRenderingContext2D, x: number, y: number, icon: string, l1: string, l2: string) {
  ctx.save();
  ctx.font = '34px serif';
  ctx.textAlign = 'center';
  ctx.fillText(icon, x, y);

  ctx.fillStyle = '#2E6B4E';
  ctx.font = '700 22px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(l1, x, y + 36);
  ctx.font = '500 20px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = '#555555';
  ctx.fillText(l2, x, y + 66);
  ctx.restore();
}

function drawCurvedText(
  ctx: CanvasRenderingContext2D,
  text: string,
  cx: number,
  cy: number,
  radius: number,
  startAngle: number,
  direction: 1 | -1 = 1
) {
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const totalLetters = text.length;
  const angleStep = 0.05 * direction;

  for (let i = 0; i < totalLetters; i++) {
    const char = text[i];
    const angle = startAngle + i * angleStep;
    ctx.save();
    ctx.translate(cx + radius * Math.cos(angle), cy + radius * Math.sin(angle));
    ctx.rotate(angle + Math.PI / 2);
    ctx.fillText(char, 0, 0);
    ctx.restore();
  }
}
