import { SLINGSHOT } from "./config.js";
import { clampDragPoint, launchVelocity } from "./physics.js";
import { handleWarpTap, registerSecretTap } from "./state.js";

function canvasPoint(canvas, event) {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;

  return {
    x: (event.clientX - rect.left) * scaleX,
    y: (event.clientY - rect.top) * scaleY,
  };
}

function canBeginDrag(state) {
  return state.projectile && !state.projectile.launched && !state.cleared && !state.failed && !state.activePointerId;
}

export function attachInput(canvas, state, onLaunch) {
  function stopDefault(event) {
    event.preventDefault();
  }

  function isTrackedPointer(event) {
    return state.activePointerId !== null && event.pointerId === state.activePointerId;
  }

  function resetDrag() {
    if (!state.projectile || state.projectile.launched) {
      state.dragging = false;
      state.dragPoint = null;
      state.dragAimPoint = null;
      state.activePointerId = null;
      state.dragStartPoint = null;
      return;
    }

    state.dragging = false;
    state.dragPoint = null;
    state.dragAimPoint = null;
    state.activePointerId = null;
    state.dragStartPoint = null;
    state.projectile.x = SLINGSHOT.x;
    state.projectile.y = SLINGSHOT.y;
  }

  function handlePointerDown(event) {
    stopDefault(event);

    if (!canBeginDrag(state)) {
      return;
    }

    const point = canvasPoint(canvas, event);

    if (state.warpMode) {
      handleWarpTap(state, point);
      return;
    }

    const dx = point.x - state.projectile.x;
    const dy = point.y - state.projectile.y;

    if (Math.hypot(dx, dy) > 44) {
      registerSecretTap(state, point);
      return;
    }

    state.dragging = true;
    state.activePointerId = event.pointerId;
    state.dragStartPoint = point;
    state.dragAimPoint = clampDragPoint(SLINGSHOT, point);
    state.dragPoint = state.dragAimPoint;
    state.projectile.x = state.dragPoint.x;
    state.projectile.y = state.dragPoint.y;
    canvas.setPointerCapture(event.pointerId);
  }

  function handlePointerMove(event) {
    if (!state.dragging || !state.projectile || !isTrackedPointer(event)) {
      return;
    }

    stopDefault(event);

    const rawPoint = canvasPoint(canvas, event);
    state.dragAimPoint = clampDragPoint(SLINGSHOT, rawPoint);
    state.dragPoint = state.dragAimPoint;
    state.projectile.x = state.dragPoint.x;
    state.projectile.y = state.dragPoint.y;
  }

  function releaseShot() {
    if (!state.dragging || !state.projectile) {
      return;
    }

    state.dragging = false;
    const aimPoint = state.dragAimPoint ?? state.dragPoint ?? { x: state.projectile.x, y: state.projectile.y };
    const point = state.dragPoint ?? { x: state.projectile.x, y: state.projectile.y };
    const velocity = launchVelocity(SLINGSHOT, aimPoint, state.projectile.type);

    state.projectile.x = point.x;
    state.projectile.y = point.y;
    state.projectile.vx = velocity.vx;
    state.projectile.vy = velocity.vy;
    state.projectile.launched = true;
    state.dragPoint = null;
    state.dragAimPoint = null;
    onLaunch();
  }

  function handlePointerUp(event) {
    if (!isTrackedPointer(event)) {
      return;
    }

    stopDefault(event);
    releaseShot();
    canvas.releasePointerCapture(event.pointerId);
  }

  function handlePointerCancel(event) {
    if (!isTrackedPointer(event)) {
      return;
    }

    stopDefault(event);
    resetDrag();
  }

  canvas.addEventListener("pointerdown", handlePointerDown, { passive: false });
  canvas.addEventListener("pointermove", handlePointerMove, { passive: false });
  canvas.addEventListener("pointerup", handlePointerUp, { passive: false });
  canvas.addEventListener("pointercancel", handlePointerCancel, { passive: false });
  canvas.addEventListener("touchmove", stopDefault, { passive: false });
  canvas.addEventListener("touchstart", stopDefault, { passive: false });
  canvas.addEventListener("touchend", stopDefault, { passive: false });
}
