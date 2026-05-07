import { FLOOR_Y, GAME_HEIGHT, GAME_WIDTH, PROJECTILE_VISUAL_SCALE, SLINGSHOT, STAGE_SAFE_RIGHT, STAGE_SAFE_TOP } from "./config.js";
import { buildTrajectoryPreview } from "./physics.js";

const ballImages = new Map();
let backgroundImage = null;
let slingshotImage = null;

export function setBallImages(images) {
  ballImages.clear();
  for (const [id, image] of Object.entries(images)) {
    if (image) {
      ballImages.set(id, image);
    }
  }
}

export function setBackgroundImage(image) {
  backgroundImage = image;
}

export function setSlingshotImage(image) {
  slingshotImage = image;
}

function drawRoundedRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + width, y, x + width, y + height, radius);
  ctx.arcTo(x + width, y + height, x, y + height, radius);
  ctx.arcTo(x, y + height, x, y, radius);
  ctx.arcTo(x, y, x + width, y, radius);
  ctx.closePath();
}

function drawBackground(ctx) {
  const sky = ctx.createLinearGradient(0, 0, 0, GAME_HEIGHT);
  sky.addColorStop(0, "#1e2846");
  sky.addColorStop(0.46, "#10182a");
  sky.addColorStop(1, "#070c14");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

  if (backgroundImage?.complete && backgroundImage.naturalWidth > 0) {
    const imageRatio = backgroundImage.naturalWidth / backgroundImage.naturalHeight;
    const canvasRatio = GAME_WIDTH / GAME_HEIGHT;
    let drawWidth = GAME_WIDTH;
    let drawHeight = GAME_HEIGHT;
    let offsetX = 0;
    let offsetY = 0;

    if (imageRatio > canvasRatio) {
      drawHeight = GAME_HEIGHT;
      drawWidth = drawHeight * imageRatio;
      offsetX = (GAME_WIDTH - drawWidth) / 2;
    } else {
      drawWidth = GAME_WIDTH;
      drawHeight = drawWidth / imageRatio;
      offsetY = (GAME_HEIGHT - drawHeight) / 2;
    }

    ctx.save();
    ctx.globalAlpha = 0.54;
    ctx.drawImage(backgroundImage, offsetX, offsetY, drawWidth, drawHeight);
    ctx.restore();
  }

  const spotlight = ctx.createRadialGradient(GAME_WIDTH * 0.78, 120, 30, GAME_WIDTH * 0.78, 160, 280);
  spotlight.addColorStop(0, "rgba(255, 215, 138, 0.14)");
  spotlight.addColorStop(0.4, "rgba(255, 145, 92, 0.08)");
  spotlight.addColorStop(1, "rgba(255, 145, 92, 0)");
  ctx.fillStyle = spotlight;
  ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

  ctx.fillStyle = "rgba(255,255,255,0.045)";
  for (let i = 0; i < 12; i += 1) {
    ctx.beginPath();
    ctx.arc(28 + i * 31, 88 + (i % 3) * 28, 2 + (i % 3), 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.strokeStyle = "rgba(255,255,255,0.05)";
  ctx.lineWidth = 1;
  for (let i = 0; i < 4; i += 1) {
    ctx.beginPath();
    ctx.moveTo(0, STAGE_SAFE_TOP + i * 54);
    ctx.lineTo(GAME_WIDTH, STAGE_SAFE_TOP + i * 54 + 24);
    ctx.stroke();
  }

  const floor = ctx.createLinearGradient(0, FLOOR_Y - 40, 0, GAME_HEIGHT);
  floor.addColorStop(0, "#22303f");
  floor.addColorStop(1, "#10161d");
  ctx.fillStyle = floor;
  ctx.fillRect(0, FLOOR_Y, GAME_WIDTH, GAME_HEIGHT - FLOOR_Y);

  ctx.fillStyle = "rgba(255, 181, 114, 0.12)";
  ctx.fillRect(0, FLOOR_Y - 6, GAME_WIDTH, 6);
}

function drawSlingshot(ctx, projectile) {
  if (slingshotImage?.complete && slingshotImage.naturalWidth > 0) {
    const drawWidth = 124;
    const drawHeight = 156;
    const drawX = 10;
    const drawY = FLOOR_Y - drawHeight + 22;
    ctx.drawImage(slingshotImage, drawX, drawY, drawWidth, drawHeight);
  } else {
    ctx.strokeStyle = "#5d371f";
    ctx.lineWidth = 8;

    ctx.beginPath();
    ctx.moveTo(SLINGSHOT.x - 18, FLOOR_Y + 8);
    ctx.lineTo(SLINGSHOT.x - 10, FLOOR_Y - 70);
    ctx.lineTo(SLINGSHOT.x + 10, FLOOR_Y - 70);
    ctx.lineTo(SLINGSHOT.x + 18, FLOOR_Y + 8);
    ctx.stroke();

    ctx.fillStyle = "rgba(15, 24, 34, 0.92)";
    drawRoundedRect(ctx, 18, FLOOR_Y - 104, 110, 120, 18);
    ctx.fill();
  }

  const pocketX = projectile && !projectile.launched ? projectile.x : SLINGSHOT.x;
  const pocketY = projectile && !projectile.launched ? projectile.y : SLINGSHOT.y;

  ctx.lineWidth = 4;
  ctx.strokeStyle = "#f6d39d";
  ctx.beginPath();
  ctx.moveTo(SLINGSHOT.x - 8, FLOOR_Y - 64);
  ctx.lineTo(pocketX, pocketY);
  ctx.lineTo(SLINGSHOT.x + 8, FLOOR_Y - 64);
  ctx.stroke();

  if (slingshotImage?.complete && slingshotImage.naturalWidth > 0) {
    return;
  }

  ctx.strokeStyle = "#5d371f";
  ctx.fillStyle = "#f0d9aa";
  ctx.font = "12px Arial";
  ctx.textAlign = "center";
  ctx.fillText("SLING", 72, FLOOR_Y - 30);
}

function drawWalls(ctx, walls) {
  ctx.fillStyle = "#436076";
  ctx.strokeStyle = "rgba(255,255,255,0.2)";
  for (const wall of walls) {
    drawRoundedRect(ctx, wall.x, wall.y, wall.w, wall.h, 8);
    ctx.fill();
    ctx.stroke();
  }
}

function drawSlots(ctx, slots) {
  for (const slot of slots) {
    const pulse = ctx.createRadialGradient(slot.x, slot.y, 2, slot.x, slot.y, slot.radius * 2.1);
    pulse.addColorStop(0, slot.isCleared ? "rgba(116,240,179,0.25)" : "rgba(255,211,119,0.16)");
    pulse.addColorStop(1, "rgba(255,211,119,0)");
    ctx.fillStyle = pulse;
    ctx.beginPath();
    ctx.arc(slot.x, slot.y, slot.radius * 2.1, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(slot.x, slot.y, slot.radius, 0, Math.PI * 2);
    ctx.fillStyle = slot.isCleared ? "#74f0b3" : "#111b28";
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = slot.isCleared ? "rgba(116,240,179,0.35)" : "#ffd377";
    ctx.stroke();

    if (slot.isCleared) {
      ctx.strokeStyle = "#0e1a2b";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(slot.x - 10, slot.y + 1);
      ctx.lineTo(slot.x - 3, slot.y + 9);
      ctx.lineTo(slot.x + 12, slot.y - 8);
      ctx.stroke();
      continue;
    }

    ctx.fillStyle = "#ffd377";
    ctx.font = "bold 10px Arial";
    ctx.textAlign = "center";
    ctx.fillText("REMIX", slot.x, slot.y - 2);
    ctx.fillText("SLOT", slot.x, slot.y + 10);
  }
}

function drawProjectile(ctx, projectile) {
  if (!projectile) {
    return;
  }

  if (projectile.trail?.length) {
    for (let i = 0; i < projectile.trail.length; i += 1) {
      const trailPoint = projectile.trail[i];
      const alpha = (i + 1) / projectile.trail.length;
      ctx.beginPath();
      ctx.arc(trailPoint.x, trailPoint.y, Math.max(3, projectile.radius * 0.22), 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${alpha * 0.18})`;
      ctx.fill();
    }
  }

  const image = ballImages.get(projectile.type.id);
  const radius = projectile.type.radius;
  const visualRadius = radius * PROJECTILE_VISUAL_SCALE;
  const labelY = projectile.y - visualRadius - 16;

  ctx.font = "bold 11px Arial";
  const textWidth = ctx.measureText(projectile.type.name).width;
  const pillWidth = textWidth + 16;
  const pillHeight = 20;
  const pillX = projectile.x - pillWidth / 2;
  const pillY = labelY - pillHeight / 2;

  ctx.fillStyle = "rgba(8, 14, 24, 0.78)";
  drawRoundedRect(ctx, pillX, pillY, pillWidth, pillHeight, 10);
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.14)";
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.fillStyle = "#f8f5ef";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(projectile.type.name, projectile.x, labelY);

  if (image?.complete && image.naturalWidth > 0) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(projectile.x, projectile.y, visualRadius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(image, projectile.x - visualRadius, projectile.y - visualRadius, visualRadius * 2, visualRadius * 2);
    ctx.restore();

    ctx.lineWidth = 3;
    ctx.strokeStyle = "rgba(255,255,255,0.82)";
    ctx.beginPath();
    ctx.arc(projectile.x, projectile.y, visualRadius, 0, Math.PI * 2);
    ctx.stroke();
    return;
  }

  ctx.beginPath();
  ctx.arc(projectile.x, projectile.y, visualRadius, 0, Math.PI * 2);
  ctx.fillStyle = projectile.type.color;
  ctx.fill();
  ctx.lineWidth = 3;
  ctx.strokeStyle = "rgba(255,255,255,0.75)";
  ctx.stroke();

  ctx.strokeStyle = "rgba(255,255,255,0.12)";
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.arc(projectile.x - 4, projectile.y - 4, Math.max(4, visualRadius * 0.54), Math.PI * 1.1, Math.PI * 1.75);
  ctx.stroke();

  ctx.fillStyle = "#07111a";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "bold 11px Arial";
  ctx.fillText(projectile.type.name, projectile.x, projectile.y + 4);
}

function drawTrajectoryGuide(ctx, state) {
  if (!state.dragging || !state.projectile) {
    return;
  }

  const aimPoint = state.dragAimPoint ?? { x: state.projectile.x, y: state.projectile.y };
  const previewPoints = buildTrajectoryPreview(SLINGSHOT, aimPoint, state.projectile.type, 8);
  ctx.fillStyle = "rgba(255,255,255,0.42)";

  for (let i = 0; i < previewPoints.length; i += 1) {
    const point = previewPoints[i];
    ctx.beginPath();
    ctx.arc(point.x, point.y, Math.max(2, 5 - i * 0.38), 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawPlayfieldFrame(ctx, state) {
  ctx.fillStyle = "rgba(4,11,19,0.46)";
  drawRoundedRect(ctx, 14, STAGE_SAFE_TOP - 16, GAME_WIDTH - 28, FLOOR_Y - STAGE_SAFE_TOP - 24, 24);
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.08)";
  ctx.lineWidth = 1.2;
  ctx.stroke();

  ctx.fillStyle = "rgba(255,255,255,0.78)";
  ctx.font = "12px Arial";
  ctx.textAlign = "right";
  ctx.fillText(state.stage.name, GAME_WIDTH - STAGE_SAFE_RIGHT, STAGE_SAFE_TOP - 26);

  ctx.fillStyle = "rgba(255,255,255,0.52)";
  ctx.font = "11px Arial";
  ctx.fillText(`슬롯 ${state.stage.holes.length}개`, GAME_WIDTH - STAGE_SAFE_RIGHT, STAGE_SAFE_TOP - 10);
}

function drawLaunchHint(ctx) {
  ctx.fillStyle = "rgba(255,255,255,0.08)";
  drawRoundedRect(ctx, 20, FLOOR_Y + 24, GAME_WIDTH - 40, 40, 14);
  ctx.fill();
  ctx.fillStyle = "rgba(255,255,255,0.75)";
  ctx.font = "13px Arial";
  ctx.textAlign = "center";
  ctx.fillText("왼쪽 아래 새총에서 당겨 발사", GAME_WIDTH / 2, FLOOR_Y + 50);
}

export function renderGame(ctx, state, stageWalls) {
  ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
  drawBackground(ctx);
  drawPlayfieldFrame(ctx, state);
  drawWalls(ctx, stageWalls);
  drawSlots(ctx, state.stageSlots);
  drawSlingshot(ctx, state.projectile);
  drawTrajectoryGuide(ctx, state);
  drawProjectile(ctx, state.projectile);
  drawLaunchHint(ctx);
}
