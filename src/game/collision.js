import { GLOBAL_SLOT_HIT_BONUS, OUT_OF_BOUNDS_MARGIN, GAME_HEIGHT, GAME_WIDTH, SLINGSHOT } from "./config.js";

const LONG_SHOT_DISTANCE = 250;

export function isProjectileOut(projectile) {
  return (
    projectile.x < -OUT_OF_BOUNDS_MARGIN ||
    projectile.x > GAME_WIDTH + OUT_OF_BOUNDS_MARGIN ||
    projectile.y > GAME_HEIGHT + OUT_OF_BOUNDS_MARGIN ||
    projectile.y < -OUT_OF_BOUNDS_MARGIN
  );
}

function successMessage(projectile, slot) {
  if (projectile.type.id === "jaypark") {
    return "본인등판! 셀프 리믹스 성공";
  }

  const launchDistance = Math.hypot(slot.x - SLINGSHOT.x, slot.y - SLINGSHOT.y);
  return launchDistance >= LONG_SHOT_DISTANCE ? "LONG SHOT!" : "REMIX IN!";
}

export function handleSlotCollisions(projectile, stageSlots) {
  let closestSlot = null;
  let closestDistance = Infinity;
  const slotHitBonus = GLOBAL_SLOT_HIT_BONUS + (projectile.type.slotHitBonus ?? 0);

  for (const slot of stageSlots) {
    if (slot.isCleared) {
      continue;
    }

    const dx = projectile.x - slot.x;
    const dy = projectile.y - slot.y;
    const distance = Math.hypot(dx, dy);
    const captureRadius = slot.radius + slotHitBonus;

    if (distance < captureRadius && distance < closestDistance) {
      closestSlot = slot;
      closestDistance = distance;
    }
  }

  if (!closestSlot) {
    return null;
  }

  closestSlot.isCleared = true;

  return {
    slotId: closestSlot.id,
    label: closestSlot.label,
    message: successMessage(projectile, closestSlot),
  };
}
