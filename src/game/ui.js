import { ASSETS } from "../assets.js";
import { BALL_TYPES } from "./config.js";
import { STAGES } from "./stages.js";

export function createUIRefs() {
  return {
    stageLabel: document.getElementById("stageLabel"),
    retryLabel: document.getElementById("retryLabel"),
    shotsLabel: document.getElementById("shotsLabel"),
    ballLabel: document.getElementById("ballLabel"),
    messageLabel: document.getElementById("messageLabel"),
    retryButton: document.getElementById("retryButton"),
    nextButton: document.getElementById("nextButton"),
    restartButton: document.getElementById("restartButton"),
    teamModal: document.getElementById("teamModal"),
    teamSelectGrid: document.getElementById("teamSelectGrid"),
    teamSummaryLabel: document.getElementById("teamSummaryLabel"),
    teamSummaryChips: document.getElementById("teamSummaryChips"),
    teamModalMeta: document.getElementById("teamModalMeta"),
    teamResetButton: document.getElementById("teamResetButton"),
    teamConfirmButton: document.getElementById("teamConfirmButton"),
  };
}

export function updateUI(state, refs) {
  const activeBall = state.projectile ?? (state.selectedLineup.length > 0 && state.shotsUsed < state.selectedLineup.length
    ? BALL_TYPES.find((ballType) => ballType.id === state.selectedLineup[state.shotsUsed])
    : null);
  const stageText = `Stage ${state.stageIndex + 1}`;
  refs.stageLabel.textContent = `${stageText} · ${STAGES.length}개 중`;
  refs.retryLabel.textContent = `${state.retryCount}회`;
  refs.shotsLabel.textContent = `${Math.max(0, state.selectedLineup.length - state.shotsUsed)}개`;
  refs.ballLabel.textContent = activeBall ? `${activeBall.type?.name ?? activeBall.name} 장전 완료` : "장전 없음";
  refs.messageLabel.textContent = state.cleared
    ? "클리어! 다음 스테이지로 이동하세요."
    : state.failed
      ? state.message
      : state.message || "당겨서 발사";
  refs.nextButton.classList.toggle("is-hidden", !state.cleared);
}

export function renderTeamDraft(state, refs) {
  const isDraftPhase = state.phase === "draft";
  refs.teamModal.classList.toggle("is-hidden", !isDraftPhase);
  document.body.classList.toggle("modal-open", isDraftPhase);

  if (!isDraftPhase) {
    return;
  }

  refs.teamModalMeta.textContent = `구멍 ${state.stage.holes.length}개 + 2 · 총 ${state.shotLimit}개 선택`;
  refs.teamSummaryLabel.textContent = `선택된 공 ${state.selectedLineup.length} / ${state.shotLimit}`;
  refs.teamConfirmButton.disabled = state.selectedLineup.length !== state.shotLimit;

  refs.teamSelectGrid.innerHTML = "";
  refs.teamSummaryChips.innerHTML = "";

  if (state.selectedLineup.length === 0) {
    const empty = document.createElement("div");
    empty.className = "team-summary-empty";
    empty.textContent = "아직 피처링이 없습니다. 아래에서 래퍼를 골라보세요.";
    refs.teamSummaryChips.appendChild(empty);
  } else {
    state.selectedLineup.forEach((ballId, index) => {
      const ballType = BALL_TYPES.find((entry) => entry.id === ballId);
      if (!ballType) {
        return;
      }

      const chip = document.createElement("button");
      chip.type = "button";
      chip.className = "team-lineup-card";
      chip.dataset.ballId = ballType.id;
      chip.dataset.action = "remove";
      chip.innerHTML = `
        <img class="team-lineup-face" src="${ASSETS.balls[ballType.id]}" alt="${ballType.name}">
        <span class="team-lineup-order">${index + 1}</span>
        <span class="team-lineup-name">${ballType.name}</span>
      `;
      refs.teamSummaryChips.appendChild(chip);
    });
  }

  for (const ballType of BALL_TYPES) {
    const count = state.selectedLineup.filter((id) => id === ballType.id).length;
    const card = document.createElement("button");
    card.type = "button";
    card.className = "team-pick-card";
    card.dataset.ballId = ballType.id;
    card.dataset.action = "add";
    card.innerHTML = `
      <img class="team-pick-face" src="${ASSETS.balls[ballType.id]}" alt="${ballType.name}">
      <span class="team-pick-name">${ballType.name}</span>
      <span class="team-pick-role">${ballType.label}</span>
      <span class="team-pick-count">${count} pick</span>
      <span class="team-pick-plus">+ 추가</span>
    `;
    refs.teamSelectGrid.appendChild(card);
  }
}
