export const STAGES = [
  {
    id: 1,
    name: "리믹스 첫 장전",
    holes: [
      { xRatio: 0.78, yRatio: 0.56, radiusRatio: 0.056, label: "OPENING" },
    ],
    optionalObstacles: [],
  },
  {
    id: 2,
    name: "피처링 자리",
    holes: [
      { xRatio: 0.88, yRatio: 0.4, radiusRatio: 0.052, label: "FEATURE" },
    ],
    optionalObstacles: [],
  },
  {
    id: 3,
    name: "쇼츠 알고리즘",
    holes: [
      { xRatio: 0.72, yRatio: 0.48, radiusRatio: 0.05, label: "SHORT A" },
      { xRatio: 0.87, yRatio: 0.34, radiusRatio: 0.048, label: "SHORT B" },
    ],
    optionalObstacles: [
      { xRatio: 0.58, yRatio: 0.66, widthRatio: 0.1, heightRatio: 0.06 },
    ],
  },
  {
    id: 4,
    name: "댓글창 폭발",
    holes: [
      { xRatio: 0.79, yRatio: 0.58, radiusRatio: 0.049, label: "COMMENT A" },
      { xRatio: 0.88, yRatio: 0.22, radiusRatio: 0.047, label: "COMMENT B" },
    ],
    optionalObstacles: [
      { xRatio: 0.63, yRatio: 0.53, widthRatio: 0.045, heightRatio: 0.14 },
    ],
  },
  {
    id: 5,
    name: "차트 진입구",
    holes: [
      { xRatio: 0.67, yRatio: 0.47, radiusRatio: 0.047, label: "CHART 1" },
      { xRatio: 0.84, yRatio: 0.41, radiusRatio: 0.045, label: "CHART 2" },
      { xRatio: 0.91, yRatio: 0.28, radiusRatio: 0.043, label: "CHART 3" },
    ],
    optionalObstacles: [
      { xRatio: 0.56, yRatio: 0.68, widthRatio: 0.14, heightRatio: 0.038 },
    ],
  },
  {
    id: 6,
    name: "A&R 회의실",
    holes: [
      { xRatio: 0.7, yRatio: 0.36, radiusRatio: 0.041, label: "A&R 1" },
      { xRatio: 0.84, yRatio: 0.31, radiusRatio: 0.04, label: "A&R 2" },
      { xRatio: 0.9, yRatio: 0.5, radiusRatio: 0.04, label: "A&R 3" },
    ],
    optionalObstacles: [
      { xRatio: 0.57, yRatio: 0.52, widthRatio: 0.13, heightRatio: 0.03 },
      { xRatio: 0.76, yRatio: 0.63, widthRatio: 0.05, heightRatio: 0.14 },
    ],
  },
  {
    id: 7,
    name: "롱샷 테스트",
    holes: [
      { xRatio: 0.91, yRatio: 0.19, radiusRatio: 0.038, label: "LONGSHOT" },
    ],
    optionalObstacles: [
      { xRatio: 0.58, yRatio: 0.63, widthRatio: 0.17, heightRatio: 0.03 },
    ],
  },
  {
    id: 8,
    name: "피처링 대기열",
    holes: [
      { xRatio: 0.65, yRatio: 0.32, radiusRatio: 0.043, label: "QUEUE 1" },
      { xRatio: 0.79, yRatio: 0.25, radiusRatio: 0.042, label: "QUEUE 2" },
      { xRatio: 0.9, yRatio: 0.34, radiusRatio: 0.042, label: "QUEUE 3" },
      { xRatio: 0.83, yRatio: 0.53, radiusRatio: 0.044, label: "QUEUE 4" },
    ],
    optionalObstacles: [
      { xRatio: 0.55, yRatio: 0.43, widthRatio: 0.15, heightRatio: 0.03 },
      { xRatio: 0.71, yRatio: 0.66, widthRatio: 0.07, heightRatio: 0.13 },
    ],
  },
  {
    id: 9,
    name: "리믹스 업로드",
    holes: [
      { xRatio: 0.63, yRatio: 0.25, radiusRatio: 0.041, label: "UPLOAD 1" },
      { xRatio: 0.86, yRatio: 0.22, radiusRatio: 0.04, label: "UPLOAD 2" },
      { xRatio: 0.72, yRatio: 0.48, radiusRatio: 0.042, label: "UPLOAD 3" },
      { xRatio: 0.92, yRatio: 0.56, radiusRatio: 0.043, label: "UPLOAD 4" },
    ],
    optionalObstacles: [
      { xRatio: 0.54, yRatio: 0.58, widthRatio: 0.06, heightRatio: 0.21 },
      { xRatio: 0.8, yRatio: 0.39, widthRatio: 0.05, heightRatio: 0.16 },
    ],
  },
  {
    id: 10,
    name: "알고리즘 2차 테스트",
    holes: [
      { xRatio: 0.64, yRatio: 0.2, radiusRatio: 0.039, label: "ALGO 1" },
      { xRatio: 0.78, yRatio: 0.17, radiusRatio: 0.038, label: "ALGO 2" },
      { xRatio: 0.92, yRatio: 0.23, radiusRatio: 0.039, label: "ALGO 3" },
      { xRatio: 0.72, yRatio: 0.43, radiusRatio: 0.041, label: "ALGO 4" },
      { xRatio: 0.9, yRatio: 0.51, radiusRatio: 0.042, label: "ALGO 5" },
    ],
    optionalObstacles: [
      { xRatio: 0.52, yRatio: 0.47, widthRatio: 0.06, heightRatio: 0.26 },
      { xRatio: 0.61, yRatio: 0.31, widthRatio: 0.14, heightRatio: 0.03 },
      { xRatio: 0.77, yRatio: 0.65, widthRatio: 0.17, heightRatio: 0.03 },
    ],
  },
  {
    id: 11,
    name: "본인등판 스테이지",
    holes: [
      { xRatio: 0.7, yRatio: 0.33, radiusRatio: 0.039, label: "SELF 1" },
      { xRatio: 0.86, yRatio: 0.28, radiusRatio: 0.039, label: "SELF 2" },
      { xRatio: 0.92, yRatio: 0.49, radiusRatio: 0.039, label: "SELF 3" },
    ],
    optionalObstacles: [
      { xRatio: 0.56, yRatio: 0.64, widthRatio: 0.16, heightRatio: 0.03 },
      { xRatio: 0.74, yRatio: 0.44, widthRatio: 0.05, heightRatio: 0.15 },
      { xRatio: 0.82, yRatio: 0.61, widthRatio: 0.05, heightRatio: 0.15 },
    ],
  },
  {
    id: 12,
    name: "최종 리믹스 슬롯",
    holes: [
      { xRatio: 0.64, yRatio: 0.19, radiusRatio: 0.036, label: "FINAL 1" },
      { xRatio: 0.77, yRatio: 0.16, radiusRatio: 0.035, label: "FINAL 2" },
      { xRatio: 0.91, yRatio: 0.2, radiusRatio: 0.036, label: "FINAL 3" },
      { xRatio: 0.72, yRatio: 0.39, radiusRatio: 0.038, label: "FINAL 4" },
      { xRatio: 0.9, yRatio: 0.48, radiusRatio: 0.038, label: "FINAL 5" },
    ],
    optionalObstacles: [
      { xRatio: 0.5, yRatio: 0.51, widthRatio: 0.07, heightRatio: 0.28 },
      { xRatio: 0.61, yRatio: 0.29, widthRatio: 0.14, heightRatio: 0.03 },
      { xRatio: 0.76, yRatio: 0.57, widthRatio: 0.17, heightRatio: 0.03 },
      { xRatio: 0.88, yRatio: 0.66, widthRatio: 0.06, heightRatio: 0.12 },
    ],
  },
];

export const SECRET_STAGE = {
  id: 99,
  name: "비밀 리믹스 터널",
  secret: true,
  holes: [
    { xRatio: 0.68, yRatio: 0.27, radiusRatio: 0.04, label: "SECRET 1" },
    { xRatio: 0.88, yRatio: 0.22, radiusRatio: 0.038, label: "SECRET 2" },
    { xRatio: 0.78, yRatio: 0.48, radiusRatio: 0.04, label: "SECRET 3" },
    { xRatio: 0.92, yRatio: 0.57, radiusRatio: 0.04, label: "SECRET 4" },
  ],
  optionalObstacles: [
    { xRatio: 0.54, yRatio: 0.41, widthRatio: 0.06, heightRatio: 0.26 },
    { xRatio: 0.66, yRatio: 0.31, widthRatio: 0.16, heightRatio: 0.03 },
    { xRatio: 0.8, yRatio: 0.64, widthRatio: 0.1, heightRatio: 0.14 },
  ],
};
