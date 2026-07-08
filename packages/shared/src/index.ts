export type JlptLevel = "N5" | "N4" | "N3";

export type HealthResponse = {
  status: "ok";
  service: "yomimasu-api";
  timestamp: string;
};

export const APP_NAME = "Yomimasu" as const;
