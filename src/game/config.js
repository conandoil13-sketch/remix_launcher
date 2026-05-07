export const GAME_WIDTH = 390;
export const GAME_HEIGHT = 844;
export const FLOOR_Y = 748;
export const SLOT_CAPTURE_RADIUS = 18;
export const OUT_OF_BOUNDS_MARGIN = 120;
export const MAX_SHOTS = 5;
export const DRAG_LIMIT = 112;
export const BASE_LAUNCH_POWER = 2.5;
export const MAX_LAUNCH_SPEED = 16.8;
export const GRAVITY = 0.215;
export const STOP_SPEED = 0.28;
export const TRAYB_BOUNCE_DAMPING = 0.72;
export const PROJECTILE_RESOLVE_DELAY_MS = 260;
export const FLOOR_COLLISION_GRACE_MS = 800;
export const PROJECTILE_VISUAL_SCALE = 1.35;
export const GLOBAL_SLOT_HIT_BONUS = 4;
export const DEFAULT_MESSAGE = "새총을 당겨 모든 REMIX SLOT을 맞히세요.";
export const STAGE_SAFE_TOP = 126;
export const STAGE_SAFE_RIGHT = 26;
export const GHOST_FLOOR_WIDTH_RATIO = 0.5;
export const GHOST_LEFT_WALL_HEIGHT_RATIO = 0.5;

export const SLINGSHOT = {
  x: 72,
  y: FLOOR_Y - 30,
  pocketRadius: 34,
};

export const BALL_TYPES = [
  {
    id: "toigo",
    name: "토이고",
    label: "균형형",
    radius: 18,
    powerMultiplier: 1.0,
    gravityMultiplier: 1.0,
    bounce: 0,
    color: "#ffba7b",
  },
  {
    id: "yln",
    name: "YLN Foreign",
    label: "고속형",
    radius: 16,
    powerMultiplier: 1.38,
    gravityMultiplier: 0.88,
    slotHitBonus: 6,
    bounce: 0,
    color: "#72d0ff",
  },
  {
    id: "flowsik",
    name: "플로우식",
    label: "중량형",
    radius: 22,
    powerMultiplier: 0.85,
    gravityMultiplier: 1.25,
    bounce: 0,
    color: "#d4d7de",
  },
  {
    id: "trayb",
    name: "트레이비",
    label: "튕김형",
    radius: 18,
    powerMultiplier: 1.0,
    gravityMultiplier: 1.0,
    bounce: 1,
    color: "#a98dff",
  },
  {
    id: "jaypark",
    name: "박재범",
    label: "본인등판 특수공",
    radius: 20,
    powerMultiplier: 1.1,
    gravityMultiplier: 0.9,
    bounce: 0,
    specialRadius: 84,
    color: "#7dffb2",
    bonusMessage: "박재범 보너스! 점수 2배",
  },
];
