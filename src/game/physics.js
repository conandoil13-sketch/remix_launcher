import {
  BASE_LAUNCH_POWER,
  DRAG_LIMIT,
  FLOOR_Y,
  GAME_HEIGHT,
  GAME_WIDTH,
  GHOST_FLOOR_WIDTH_RATIO,
  GHOST_LEFT_WALL_HEIGHT_RATIO,
  GRAVITY,
  MAX_LAUNCH_SPEED,
  OUT_OF_BOUNDS_MARGIN,
  PROJECTILE_RESOLVE_DELAY_MS,
  STOP_SPEED,
  TRAYB_BOUNCE_DAMPING,
} from "./config.js";
import { handleSlotCollisions } from "./collision.js";
import { registerSlotSuccess } from "./state.js";

function clampToLaunchBounds(point, radius) {
  return {
    x: Math.max(radius + 10, Math.min(point.x, GAME_WIDTH * 0.4)),
    y: Math.max(110, Math.min(point.y, FLOOR_Y - radius - 12)),
  };
}

export function clampDragPoint(anchor, point) {
  const dx = point.x - anchor.x;
  const dy = point.y - anchor.y;
  const distance = Math.hypot(dx, dy);

  if (distance <= DRAG_LIMIT) {
    return point;
  }

  const scale = DRAG_LIMIT / distance;
  return {
    x: anchor.x + dx * scale,
    y: anchor.y + dy * scale,
  };
}

export function launchVelocity(anchor, point, ballType) {
  const dx = anchor.x - point.x;
  const dy = anchor.y - point.y;
  const rawVx = dx * BASE_LAUNCH_POWER * 0.1 * ballType.powerMultiplier;
  const rawVy = dy * BASE_LAUNCH_POWER * 0.1 * ballType.powerMultiplier;
  const speed = Math.hypot(rawVx, rawVy);
  const clampScale = speed > MAX_LAUNCH_SPEED ? MAX_LAUNCH_SPEED / speed : 1;

  return {
    vx: rawVx * clampScale,
    vy: rawVy * clampScale,
  };
}

export function clampDragForProjectile(anchor, point, projectile) {
  const radialPoint = clampDragPoint(anchor, point);
  return clampToLaunchBounds(radialPoint, projectile.radius);
}

export function buildTrajectoryPreview(anchor, point, ballType, steps = 7) {
  const velocity = launchVelocity(anchor, point, ballType);
  const points = [];
  let x = anchor.x;
  let y = anchor.y;
  let vx = velocity.vx;
  let vy = velocity.vy;

  for (let i = 0; i < steps; i += 1) {
    vy += GRAVITY * ballType.gravityMultiplier;
    x += vx;
    y += vy;
    points.push({ x, y });
  }

  return points;
}

function stopProjectile(projectile) {
  projectile.vx = 0;
  projectile.vy = 0;
  projectile.stopped = true;
}

function queueResolution(projectile) {
  if (projectile.resolveDelayMs <= 0) {
    projectile.resolveDelayMs = PROJECTILE_RESOLVE_DELAY_MS;
  }
}

function canGhostFloor(projectile) {
  return projectile.worldGraceMs > 0 && projectile.x <= GAME_WIDTH * GHOST_FLOOR_WIDTH_RATIO;
}

function canGhostLeftWall(projectile) {
  return projectile.worldGraceMs > 0 && projectile.y >= GAME_HEIGHT * GHOST_LEFT_WALL_HEIGHT_RATIO;
}

function handleWorldCollision(projectile) {
  const radius = projectile.radius;

  if (projectile.x + radius < -OUT_OF_BOUNDS_MARGIN || projectile.x - radius > GAME_WIDTH + OUT_OF_BOUNDS_MARGIN || projectile.y - radius > GAME_HEIGHT + OUT_OF_BOUNDS_MARGIN) {
    queueResolution(projectile);
    return;
  }

  if (projectile.floorGraceMs <= 0 && projectile.y + radius >= FLOOR_Y) {
    if (canGhostFloor(projectile)) {
      return;
    }

    projectile.y = FLOOR_Y - radius;

    if (projectile.remainingBounces > 0) {
      projectile.vy = -Math.abs(projectile.vy) * TRAYB_BOUNCE_DAMPING;
      projectile.vx *= TRAYB_BOUNCE_DAMPING;
      projectile.remainingBounces -= 1;
      return;
    }

    stopProjectile(projectile);
    return;
  }

  if (projectile.x - radius <= 0) {
    if (canGhostLeftWall(projectile)) {
      return;
    }

    projectile.x = radius;

    if (projectile.remainingBounces > 0) {
      projectile.vx = Math.abs(projectile.vx) * TRAYB_BOUNCE_DAMPING;
      projectile.vy *= TRAYB_BOUNCE_DAMPING;
      projectile.remainingBounces -= 1;
      return;
    }

    stopProjectile(projectile);
    return;
  }

  if (projectile.x + radius >= GAME_WIDTH) {
    projectile.x = GAME_WIDTH - radius;

    if (projectile.remainingBounces > 0) {
      projectile.vx = -Math.abs(projectile.vx) * TRAYB_BOUNCE_DAMPING;
      projectile.vy *= TRAYB_BOUNCE_DAMPING;
      projectile.remainingBounces -= 1;
      return;
    }

    stopProjectile(projectile);
  }
}

export function updateProjectile(state, dt, stageWalls) {
  const projectile = state.projectile;

  if (!projectile || !projectile.launched) {
    return;
  }

  const subSteps = Math.max(1, Math.ceil(dt / 8));
  const stepScale = dt / 16.6667 / subSteps;
  projectile.floorGraceMs = Math.max(0, projectile.floorGraceMs - dt);
  projectile.worldGraceMs = Math.max(0, projectile.worldGraceMs - dt);

  for (let step = 0; step < subSteps; step += 1) {
    if (projectile.resolveDelayMs > 0) {
      break;
    }

    projectile.vy += GRAVITY * projectile.type.gravityMultiplier * stepScale;
    projectile.x += projectile.vx * stepScale;
    projectile.y += projectile.vy * stepScale;

    projectile.trail.push({ x: projectile.x, y: projectile.y });
    if (projectile.trail.length > 10) {
      projectile.trail.shift();
    }

    handleWorldCollision(projectile);

    if (projectile.resolveDelayMs > 0 || projectile.stopped) {
      queueResolution(projectile);
      break;
    }

    const slotResult = handleSlotCollisions(projectile, state.stageSlots);
    if (slotResult) {
      registerSlotSuccess(state, slotResult.message);
      queueResolution(projectile);
      break;
    }

    for (const wall of stageWalls) {
      if (
        projectile.x + projectile.radius >= wall.x &&
        projectile.x - projectile.radius <= wall.x + wall.w &&
        projectile.y + projectile.radius >= wall.y &&
        projectile.y - projectile.radius <= wall.y + wall.h
      ) {
        if (projectile.remainingBounces > 0) {
          const leftPen = Math.abs(projectile.x + projectile.radius - wall.x);
          const rightPen = Math.abs(wall.x + wall.w - (projectile.x - projectile.radius));
          const topPen = Math.abs(projectile.y + projectile.radius - wall.y);
          const bottomPen = Math.abs(wall.y + wall.h - (projectile.y - projectile.radius));
          const minPen = Math.min(leftPen, rightPen, topPen, bottomPen);

          if (minPen === leftPen) {
            projectile.x = wall.x - projectile.radius;
            projectile.vx = -Math.abs(projectile.vx) * TRAYB_BOUNCE_DAMPING;
          } else if (minPen === rightPen) {
            projectile.x = wall.x + wall.w + projectile.radius;
            projectile.vx = Math.abs(projectile.vx) * TRAYB_BOUNCE_DAMPING;
          } else if (minPen === topPen) {
            projectile.y = wall.y - projectile.radius;
            projectile.vy = -Math.abs(projectile.vy) * TRAYB_BOUNCE_DAMPING;
          } else {
            projectile.y = wall.y + wall.h + projectile.radius;
            projectile.vy = Math.abs(projectile.vy) * TRAYB_BOUNCE_DAMPING;
          }

          projectile.remainingBounces -= 1;
        } else {
          stopProjectile(projectile);
          queueResolution(projectile);
        }

        break;
      }
    }

    const speed = Math.hypot(projectile.vx, projectile.vy);
    const restingOnFloor =
      projectile.floorGraceMs <= 0 &&
      projectile.y + projectile.radius >= FLOOR_Y - 1 &&
      !canGhostFloor(projectile);

    if (projectile.stopped || (restingOnFloor && speed < STOP_SPEED)) {
      stopProjectile(projectile);
      queueResolution(projectile);
      break;
    }
  }

  const allHit = state.stageSlots.every((slot) => slot.isCleared);
  if (allHit) {
    queueResolution(projectile);
  }

  if (projectile.resolveDelayMs > 0) {
    projectile.resolveDelayMs -= dt;
    if (projectile.resolveDelayMs <= 0) {
      projectile.resolved = true;
    }
  }
}
