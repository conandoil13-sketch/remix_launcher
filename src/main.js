import { ASSETS } from "./assets.js";
import { GAME_HEIGHT, GAME_WIDTH } from "./game/config.js";
import { attachInput } from "./game/input.js";
import { updateProjectile } from "./game/physics.js";
import { renderGame, setBackgroundImage, setBallImages, setSlingshotImage } from "./game/renderer.js";
import { addBallToLineup, commitShot, confirmLineupDraft, createGameState, finishProjectile, goToNextStage, resetLineupDraft, restartStage, removeBallFromLineup } from "./game/state.js";
import { createUIRefs, renderTeamDraft, updateUI } from "./game/ui.js";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const state = createGameState();
const ui = createUIRefs();

canvas.width = GAME_WIDTH;
canvas.height = GAME_HEIGHT;

function loadImage(src) {
  return new Promise((resolve) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => resolve(null);
    image.src = src;
  });
}

async function preloadBallImages() {
  const entries = Object.entries(ASSETS.balls);
  const loaded = await Promise.all(entries.map(async ([id, src]) => [id, await loadImage(src)]));
  setBallImages(Object.fromEntries(loaded));
}

async function preloadBackgroundImage() {
  const image = await loadImage(ASSETS.background);
  setBackgroundImage(image);
}

async function preloadUiImages() {
  const image = await loadImage(ASSETS.ui.slingshot);
  setSlingshotImage(image);
}

function resizeCanvasDisplay() {
  const wrap = canvas.parentElement;
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const horizontalPadding = viewportWidth <= 560 ? 16 : 40;
  const verticalPadding = viewportWidth <= 560 ? 16 : 32;
  const maxWidth = viewportWidth - horizontalPadding;
  const maxHeight = viewportHeight - verticalPadding;
  const scale = Math.min(maxWidth / GAME_WIDTH, maxHeight / GAME_HEIGHT);
  const width = Math.floor(GAME_WIDTH * scale);
  const height = Math.floor(GAME_HEIGHT * scale);

  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;

  if (wrap) {
    wrap.style.width = `${width}px`;
    wrap.style.height = `${height}px`;
  }
}

function stageWallsToPixels(stage) {
  return (stage.optionalObstacles ?? []).map((wall) => ({
    x: wall.xRatio * GAME_WIDTH,
    y: wall.yRatio * GAME_HEIGHT,
    w: wall.widthRatio * GAME_WIDTH,
    h: wall.heightRatio * GAME_HEIGHT,
  }));
}

function slotsToPixels() {
  state.stageSlots = state.stageSlots.map((slot) => ({
    ...slot,
    x: slot.x <= 1 ? slot.x * GAME_WIDTH : slot.x,
    y: slot.y <= 1 ? slot.y * GAME_HEIGHT : slot.y,
    radius: slot.radius <= 1 ? slot.radius * GAME_WIDTH : slot.radius,
    r: slot.r <= 1 ? slot.r * GAME_WIDTH : slot.r,
  }));
}

function syncStageGeometry() {
  slotsToPixels();
  stageWalls = stageWallsToPixels(state.stage);
}

let stageWalls = stageWallsToPixels(state.stage);
syncStageGeometry();
resizeCanvasDisplay();

attachInput(canvas, state, () => {
  commitShot(state);
  updateUI(state, ui);
});

window.addEventListener("resize", resizeCanvasDisplay);

ui.retryButton.addEventListener("click", () => {
  restartStage(state);
  syncStageGeometry();
  updateUI(state, ui);
  renderTeamDraft(state, ui);
});

ui.restartButton.addEventListener("click", () => {
  restartStage(state);
  syncStageGeometry();
  updateUI(state, ui);
  renderTeamDraft(state, ui);
});

ui.nextButton.addEventListener("click", () => {
  goToNextStage(state);
  syncStageGeometry();
  updateUI(state, ui);
  renderTeamDraft(state, ui);
});

ui.teamSelectGrid.addEventListener("pointerdown", (event) => {
  const card = event.target.closest("[data-ball-id][data-action='add']");
  if (!card) {
    return;
  }

  event.preventDefault();
  addBallToLineup(state, card.dataset.ballId);
  updateUI(state, ui);
  renderTeamDraft(state, ui);
});

ui.teamSummaryChips.addEventListener("pointerdown", (event) => {
  const chip = event.target.closest("[data-ball-id][data-action='remove']");
  if (!chip) {
    return;
  }

  event.preventDefault();
  removeBallFromLineup(state, chip.dataset.ballId);
  updateUI(state, ui);
  renderTeamDraft(state, ui);
});

ui.teamResetButton.addEventListener("click", () => {
  resetLineupDraft(state);
  renderTeamDraft(state, ui);
});

ui.teamConfirmButton.addEventListener("click", () => {
  if (confirmLineupDraft(state)) {
    updateUI(state, ui);
    renderTeamDraft(state, ui);
  }
});

function tick(now) {
  if (!tick.last) {
    tick.last = now;
  }

  const dt = Math.min(32, now - tick.last);
  tick.last = now;

  updateProjectile(state, dt, stageWalls);

  if (state.projectile?.resolved) {
    finishProjectile(state);
  }

  renderGame(ctx, state, stageWalls);
  updateUI(state, ui);
  renderTeamDraft(state, ui);
  requestAnimationFrame(tick);
}

tick.last = 0;
updateUI(state, ui);
renderTeamDraft(state, ui);
preloadBallImages();
preloadBackgroundImage();
preloadUiImages();
requestAnimationFrame(tick);
