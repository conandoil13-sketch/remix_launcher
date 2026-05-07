import { BALL_TYPES, DEFAULT_MESSAGE, FLOOR_COLLISION_GRACE_MS, SLINGSHOT } from "./config.js";
import { STAGES } from "./stages.js";

const FAILURE_MESSAGES = ["피처링 불발", "각도 다시 잡아라", "리믹스 반려됨"];
const SECRET_SEQUENCE = ["tl", "tr", "tc", "tr", "tl"];
const SECRET_TIMEOUT_MS = 2200;

function stageToSlots(stage) {
  return stage.holes.map((hole, index) => ({
    ...hole,
    id: `${stage.id}-${index}`,
    x: hole.xRatio,
    y: hole.yRatio,
    radius: hole.radiusRatio,
    r: hole.radiusRatio,
    label: hole.label ?? `SLOT ${index + 1}`,
    isCleared: false,
  }));
}

function buildProjectile(ballType) {
  return {
    type: ballType,
    radius: ballType.radius,
    x: SLINGSHOT.x,
    y: SLINGSHOT.y,
    vx: 0,
    vy: 0,
    launched: false,
    resolved: false,
    specialUsed: false,
    remainingBounces: ballType.bounce,
    stopped: false,
    resolveDelayMs: 0,
    floorGraceMs: FLOOR_COLLISION_GRACE_MS,
    worldGraceMs: FLOOR_COLLISION_GRACE_MS,
    trail: [],
  };
}

function stageShotLimit(stage) {
  return stage.id <= 3 ? BALL_TYPES.length : stage.holes.length + 2;
}

function buildTutorialLineup() {
  return BALL_TYPES.map((ballType) => ballType.id);
}

function findBallType(ballId) {
  return BALL_TYPES.find((ballType) => ballType.id === ballId) ?? BALL_TYPES[0];
}

function chooseFailureMessage(state) {
  return FAILURE_MESSAGES[(state.stageIndex + state.shotsUsed) % FAILURE_MESSAGES.length];
}

export function createGameState() {
  const state = {
    stageIndex: 0,
    stage: null,
    retryCount: 0,
    normalStageIndex: 0,
    shotsUsed: 0,
    currentBallIndex: 0,
    shotLimit: 0,
    selectedLineup: [],
    projectile: null,
    stageSlots: [],
    dragging: false,
    dragPoint: null,
    dragAimPoint: null,
    activePointerId: null,
    dragStartPoint: null,
    message: DEFAULT_MESSAGE,
    lastOutcome: null,
    secretCodeProgress: 0,
    secretCodeDeadline: 0,
    warpMode: false,
    warpTargetIndex: 0,
    phase: "aiming",
    cleared: false,
    failed: false,
  };

  loadStage(state, 0);
  return state;
}

export function loadStage(state, stageIndex) {
  const stage = STAGES[stageIndex];
  state.stageIndex = stageIndex;
  state.normalStageIndex = stageIndex;
  state.stage = stage;
  state.shotLimit = stageShotLimit(stage);
  state.shotsUsed = 0;
  state.currentBallIndex = 0;
  state.selectedLineup = stage.id <= 3 ? buildTutorialLineup() : [];
  state.projectile = null;
  state.stageSlots = stageToSlots(stage);
  state.dragging = false;
  state.dragPoint = null;
  state.dragAimPoint = null;
  state.activePointerId = null;
  state.dragStartPoint = null;
  state.secretCodeProgress = 0;
  state.secretCodeDeadline = 0;
  state.warpMode = false;
  state.warpTargetIndex = stageIndex;
  state.message = stage.id <= 3 ? `${stage.name}: ${DEFAULT_MESSAGE}` : "피처링으로 함께할 래퍼를 선택하세요.";
  state.lastOutcome = null;
  state.phase = stage.id <= 3 ? "aiming" : "draft";
  state.cleared = false;
  state.failed = false;

  if (stage.id <= 3) {
    beginNextShot(state);
  }
}

export function restartStage(state) {
  state.retryCount += 1;
  loadStage(state, state.stageIndex);
}

export function goToNextStage(state) {
  const nextIndex = (state.stageIndex + 1) % STAGES.length;
  state.retryCount = 0;
  loadStage(state, nextIndex);
}

export function beginNextShot(state) {
  if (state.shotsUsed >= state.selectedLineup.length) {
    state.projectile = null;
    return;
  }

  state.currentBallIndex = state.shotsUsed;
  state.projectile = buildProjectile(findBallType(state.selectedLineup[state.currentBallIndex]));
  state.phase = "aiming";
}

export function commitShot(state) {
  state.shotsUsed += 1;
  state.phase = "flying";
  state.dragging = false;
  state.dragPoint = null;
  state.dragAimPoint = null;
  state.activePointerId = null;
  state.dragStartPoint = null;
}

export function finishProjectile(state) {
  state.projectile = null;
  state.dragging = false;
  state.dragPoint = null;
  state.dragAimPoint = null;
  state.activePointerId = null;
  state.dragStartPoint = null;

  if (state.stageSlots.every((slot) => slot.isCleared)) {
    state.cleared = true;
    state.phase = "cleared";
    state.message = `클리어! ${state.stage.name}을 돌파했습니다.`;
    state.lastOutcome = "cleared";
    return;
  }

  if (state.shotsUsed >= state.selectedLineup.length) {
    state.failed = true;
    state.phase = "failed";
    state.message = chooseFailureMessage(state);
    state.lastOutcome = "failed";
    return;
  }

  beginNextShot(state);
}

export function registerSlotSuccess(state, message) {
  state.message = message;
  state.lastOutcome = "success";
}

export function registerSecretTap(state, point, now = performance.now()) {
  if (state.dragging || state.phase !== "aiming") {
    return false;
  }

  const region =
    point.y < 150
      ? point.x < 110
        ? "tl"
        : point.x > 280
          ? "tr"
          : "tc"
      : null;

  if (!region) {
    state.secretCodeProgress = 0;
    state.secretCodeDeadline = 0;
    return false;
  }

  if (state.secretCodeProgress === 0 || now > state.secretCodeDeadline) {
    state.secretCodeProgress = 0;
  }

  if (region !== SECRET_SEQUENCE[state.secretCodeProgress]) {
    state.secretCodeProgress = region === SECRET_SEQUENCE[0] ? 1 : 0;
    state.secretCodeDeadline = now + SECRET_TIMEOUT_MS;
    return false;
  }

  state.secretCodeProgress += 1;
  state.secretCodeDeadline = now + SECRET_TIMEOUT_MS;

  if (state.secretCodeProgress >= SECRET_SEQUENCE.length) {
    state.secretCodeProgress = 0;
    state.secretCodeDeadline = 0;
    state.warpMode = true;
    state.warpTargetIndex = state.normalStageIndex;
    state.message = `워프 모드 · Stage ${state.warpTargetIndex + 1}`;
    return true;
  }

  return false;
}

export function handleWarpTap(state, point) {
  if (!state.warpMode) {
    return false;
  }

  if (point.y > 160) {
    state.warpMode = false;
    state.message = `${state.stage.name}: ${DEFAULT_MESSAGE}`;
    return true;
  }

  if (point.x < 130) {
    state.warpTargetIndex = (state.warpTargetIndex - 1 + STAGES.length) % STAGES.length;
    state.message = `워프 모드 · Stage ${state.warpTargetIndex + 1}`;
    return true;
  }

  if (point.x > 260) {
    state.warpTargetIndex = (state.warpTargetIndex + 1) % STAGES.length;
    state.message = `워프 모드 · Stage ${state.warpTargetIndex + 1}`;
    return true;
  }

  loadStage(state, state.warpTargetIndex);
  state.message = `워프 완료 · Stage ${state.stageIndex + 1}`;
  return true;
}

export function getCurrentBallType(state) {
  if (state.projectile) {
    return state.projectile.type;
  }

  if (state.selectedLineup.length > 0 && state.shotsUsed < state.selectedLineup.length) {
    return findBallType(state.selectedLineup[state.shotsUsed]);
  }

  return BALL_TYPES[0];
}

export function addBallToLineup(state, ballId) {
  if (state.phase !== "draft" || state.selectedLineup.length >= state.shotLimit) {
    return;
  }

  state.selectedLineup.push(ballId);
}

export function removeBallFromLineup(state, ballId) {
  if (state.phase !== "draft") {
    return;
  }

  const index = state.selectedLineup.lastIndexOf(ballId);
  if (index >= 0) {
    state.selectedLineup.splice(index, 1);
  }
}

export function resetLineupDraft(state) {
  if (state.phase !== "draft") {
    return;
  }

  state.selectedLineup = [];
}

export function confirmLineupDraft(state) {
  if (state.phase !== "draft" || state.selectedLineup.length !== state.shotLimit) {
    return false;
  }

  state.message = `${state.stage.name}: ${DEFAULT_MESSAGE}`;
  beginNextShot(state);
  return true;
}
